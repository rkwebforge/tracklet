<?php

namespace App\Policies;

use App\Models\User;
use Domain\Organization\Models\Organization;

class OrganizationPolicy
{
    /**
     * Determine if the user can view any organizations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the organization.
     */
    public function view(User $user, Organization $organization): bool
    {
        return $organization->hasMember($user) || $organization->owner_id === $user->id;
    }

    /**
     * Determine if the user can create organizations.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the organization.
     */
    public function update(User $user, Organization $organization): bool
    {
        return $organization->hasAdmin($user) || $organization->owner_id === $user->id;
    }

    /**
     * Determine if the user can delete the organization.
     */
    public function delete(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id;
    }

    /**
     * Determine if the user can manage members.
     */
    public function manageMembers(User $user, Organization $organization): bool
    {
        return $organization->hasAdmin($user) || $organization->owner_id === $user->id;
    }
}
