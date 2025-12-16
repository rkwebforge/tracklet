<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Domain\Organization\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class MemberController extends Controller
{
    /**
     * Display members of an organization.
     */
    public function index(Organization $organization)
    {
        $this->authorize('view', $organization);

        $members = $organization->members()
            ->with('user')
            ->get();

        return Inertia::render('Organizations/Members', [
            'organization' => $organization,
            'members' => $members,
        ]);
    }

    /**
     * Add a member to the organization.
     */
    public function store(Request $request, Organization $organization)
    {
        $this->authorize('update', $organization);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,manager,member',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Check if user is already a member
        if ($organization->members()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'User is already a member of this organization.');
        }

        $organization->members()->create([
            'user_id' => $user->id,
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'Member added successfully.');
    }

    /**
     * Remove a member from the organization.
     */
    public function destroy(Organization $organization, User $user)
    {
        $this->authorize('update', $organization);

        $organization->members()->where('user_id', $user->id)->delete();

        return back()->with('success', 'Member removed successfully.');
    }
}
