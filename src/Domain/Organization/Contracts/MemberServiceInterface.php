<?php

namespace Domain\Organization\Contracts;

use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Domain\Organization\DTOs\AddMemberDTO;
use Domain\Organization\DTOs\UpdateMemberRoleDTO;
use App\Models\User;
use Illuminate\Support\Collection;

interface MemberServiceInterface
{
    /**
     * Get all members of an organization.
     */
    public function getMembers(Organization $organization): Collection;

    /**
     * Add a member to the organization.
     */
    public function addMember(Organization $organization, AddMemberDTO $dto): OrganizationMember;

    /**
     * Update a member's role.
     */
    public function updateRole(Organization $organization, User $user, UpdateMemberRoleDTO $dto): OrganizationMember;

    /**
     * Remove a member from the organization.
     */
    public function removeMember(Organization $organization, User $user): bool;

    /**
     * Check if a user is already a member.
     */
    public function isMember(Organization $organization, User $user): bool;

    /**
     * Get member by user ID.
     */
    public function getMember(Organization $organization, User $user): ?OrganizationMember;
}
