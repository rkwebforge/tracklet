<?php

namespace App\Http\Controllers;

use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    /**
     * Show onboarding page for new users to create their first organization
     */
    public function setup()
    {
        $user = Auth::user();

        // Check if user already has an organization
        $hasOrganization = $user->ownedOrganizations()->exists() 
            || $user->organizationMemberships()->exists();

        if ($hasOrganization) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Organizations/Setup');
    }

    /**
     * Create first organization for a new user
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user already has an organization
        $hasOrganization = $user->ownedOrganizations()->exists() 
            || $user->organizationMemberships()->exists();

        if ($hasOrganization) {
            return redirect()->route('dashboard')
                ->with('error', 'You already belong to an organization.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        // Generate slug from name
        $slug = \Illuminate\Support\Str::slug($validated['name']);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (Organization::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Create organization and member in a transaction
        DB::transaction(function () use ($validated, $slug, $user, &$organization) {
            // Create organization
            $organization = Organization::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'owner_id' => $user->id,
            ]);

            // Add creator as admin member
            OrganizationMember::create([
                'organization_id' => $organization->id,
                'user_id' => $user->id,
                'role' => 'admin',
            ]);
        });

        // Refresh user relationships to ensure data is available
        $user->refresh();
        $user->load(['ownedOrganizations', 'organizationMemberships']);

        return redirect()->route('dashboard')
            ->with('success', 'Organization created successfully! You can now start creating projects.');
    }

    /**
     * Display the organization dashboard
     */
    public function show(Organization $organization)
    {
        $this->authorize('view', $organization);

        $organization->load(['owner', 'members.user']);

        return Inertia::render('Organizations/Show', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show organization settings
     */
    public function edit(Organization $organization)
    {
        $this->authorize('update', $organization);

        return Inertia::render('Organizations/Edit', [
            'organization' => $organization,
        ]);
    }

    /**
     * Update organization details
     */
    public function update(Request $request, Organization $organization)
    {
        $this->authorize('update', $organization);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $organization->update($validated);

        return back()->with('success', 'Organization updated successfully.');
    }

    /**
     * Delete organization
     */
    public function destroy(Organization $organization)
    {
        $this->authorize('delete', $organization);

        $organization->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Organization deleted successfully.');
    }
}
