<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Domain\Organization\Models\Organization;
use Domain\Organization\Contracts\OrganizationServiceInterface;
use Domain\Organization\DTOs\CreateOrganizationDTO;
use Domain\Organization\DTOs\UpdateOrganizationDTO;

class OrganizationController extends Controller
{
    public function __construct(
        private OrganizationServiceInterface $organizationService
    ) {}

    /**
     * Display a listing of organizations.
     */
    public function index(): Response
    {
        $organizations = $this->organizationService->getOrganizationsForUser(auth()->user());

        return Inertia::render('Organization/Index', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Show the form for creating a new organization.
     */
    public function create(): Response
    {
        $this->authorize('create', Organization::class);

        return Inertia::render('Organization/Create');
    }

    /**
     * Store a newly created organization.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Organization::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:organizations,slug',
            'description' => 'nullable|string',
        ]);

        $dto = CreateOrganizationDTO::fromArray($validated);
        $organization = $this->organizationService->create($dto, auth()->user());

        return redirect()->route('organizations.show', $organization->id)
            ->with('success', 'Organization created successfully.');
    }

    /**
     * Show the organization details.
     */
    public function show(Organization $organization): Response
    {
        $this->authorize('view', $organization);

        $organization = $this->organizationService->getWithDetails($organization);

        return Inertia::render('Organization/Show', [
            'organization' => $organization,
            'can' => [
                'update' => auth()->user()->can('update', $organization),
                'delete' => auth()->user()->can('delete', $organization),
                'manageMembers' => auth()->user()->can('manageMembers', $organization),
            ],
        ]);
    }

    /**
     * Show the form for editing the organization.
     */
    public function edit(Organization $organization): Response
    {
        $this->authorize('update', $organization);

        return Inertia::render('Organization/Edit', [
            'organization' => $organization,
        ]);
    }

    /**
     * Update the specified organization.
     */
    public function update(Request $request, Organization $organization): RedirectResponse
    {
        $this->authorize('update', $organization);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:organizations,slug,' . $organization->id,
            'description' => 'nullable|string',
        ]);

        $dto = UpdateOrganizationDTO::fromArray($validated);
        $this->organizationService->update($organization, $dto);

        return redirect()->route('organizations.show', $organization->id)
            ->with('success', 'Organization updated successfully.');
    }

    /**
     * Remove the specified organization.
     */
    public function destroy(Organization $organization): RedirectResponse
    {
        $this->authorize('delete', $organization);

        $this->organizationService->delete($organization);

        return redirect()->route('organizations.index')
            ->with('success', 'Organization deleted successfully.');
    }
}
