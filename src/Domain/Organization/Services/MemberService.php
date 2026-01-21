<?php

namespace Domain\Organization\Services;

use Domain\Organization\Contracts\MemberServiceInterface;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Domain\Organization\DTOs\AddMemberDTO;
use Domain\Organization\DTOs\UpdateMemberRoleDTO;
use Domain\Organization\Exceptions\CannotModifyOwnerException;
use Domain\Organization\Exceptions\MemberAlreadyExistsException;
use Domain\Organization\Exceptions\MemberNotFoundException;
use App\Models\User;
use Illuminate\Support\Collection;

class MemberService implements MemberServiceInterface
{
    /**
     * Get all members of an organization.
     */
    public function getMembers(Organization $organization): Collection
    {
        return $organization->members()->with('user')->get();
    }

    /**
     * Add a member to the organization.
     */
    public function addMember(Organization $organization, AddMemberDTO $dto): OrganizationMember
    {
        $user = User::where('email', $dto->email)->firstOrFail();

        if ($this->isMember($organization, $user)) {
            throw new MemberAlreadyExistsException('User is already a member of this organization.');
        }

        return $organization->members()->create([
            'user_id' => $user->id,
            'role' => $dto->role,
        ]);
    }

    /**
     * Update a member's role.
     */
    public function updateRole(Organization $organization, User $user, UpdateMemberRoleDTO $dto): OrganizationMember
    {
        if ($organization->owner_id === $user->id) {
            throw new CannotModifyOwnerException('Cannot change the owner\'s role.');
        }

        $member = $this->getMember($organization, $user);

        if (!$member) {
            throw new MemberNotFoundException('User is not a member of this organization.');
        }

        $member->update(['role' => $dto->role]);

        return $member->fresh();
    }

    /**
     * Remove a member from the organization.
     */
    public function removeMember(Organization $organization, User $user): bool
    {
        if ($organization->owner_id === $user->id) {
            throw new CannotModifyOwnerException('Cannot remove the organization owner.');
        }

        return $organization->members()->where('user_id', $user->id)->delete() > 0;
    }

    /**
     * Check if a user is already a member.
     */
    public function isMember(Organization $organization, User $user): bool
    {
        return $organization->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Get member by user ID.
     */
    public function getMember(Organization $organization, User $user): ?OrganizationMember
    {
        return $organization->members()->where('user_id', $user->id)->first();
    }
}
