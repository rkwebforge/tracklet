<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use Domain\Organization\Models\Organization;
use Domain\Organization\Contracts\MemberServiceInterface;
use Domain\Organization\DTOs\AddMemberDTO;
use Domain\Organization\DTOs\UpdateMemberRoleDTO;
use Domain\Organization\Exceptions\MemberAlreadyExistsException;
use Domain\Organization\Exceptions\CannotModifyOwnerException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class MemberController extends Controller
{
    public function __construct(
        private MemberServiceInterface $memberService
    ) {}

    /**
     * Display members of an organization.
     */
    public function index(Organization $organization)
    {
        $this->authorize('view', $organization);

        $members = $this->memberService->getMembers($organization);
        $organization->load('owner');

        return Inertia::render('Organization/Members', [
            'organization' => $organization,
            'members' => $members,
        ]);
    }

    /**
     * Add a member to the organization.
     */
    public function store(Request $request, Organization $organization)
    {
        $this->authorize('manageMembers', $organization);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,manager,member',
        ]);

        try {
            $dto = AddMemberDTO::fromArray($validated);
            $this->memberService->addMember($organization, $dto);

            return back()->with('success', 'Member added successfully.');
        } catch (MemberAlreadyExistsException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update a member's role.
     */
    public function update(Request $request, Organization $organization, User $user)
    {
        $this->authorize('manageMembers', $organization);

        $validated = $request->validate([
            'role' => 'required|in:admin,manager,member',
        ]);

        try {
            $dto = UpdateMemberRoleDTO::fromArray($validated);
            $this->memberService->updateRole($organization, $user, $dto);

            return back()->with('success', 'Member role updated successfully.');
        } catch (CannotModifyOwnerException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove a member from the organization.
     */
    public function destroy(Organization $organization, User $user)
    {
        $this->authorize('manageMembers', $organization);

        try {
            $this->memberService->removeMember($organization, $user);

            return back()->with('success', 'Member removed successfully.');
        } catch (CannotModifyOwnerException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
