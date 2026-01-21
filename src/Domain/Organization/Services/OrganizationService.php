<?php

namespace Domain\Organization\Services;

use Domain\Organization\Contracts\OrganizationServiceInterface;
use Domain\Organization\Models\Organization;
use Domain\Organization\DTOs\CreateOrganizationDTO;
use Domain\Organization\DTOs\UpdateOrganizationDTO;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class OrganizationService implements OrganizationServiceInterface
{
    /**
     * Get all organizations for a user.
     */
    public function getOrganizationsForUser(User $user): Collection
    {
        return Organization::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with('owner')
            ->withCount('members')
            ->get()
            ->map(function ($org) use ($user) {
                $org->can_manage_members = $user->can('manageMembers', $org);
                return $org;
            });
    }

    /**
     * Create a new organization.
     */
    public function create(CreateOrganizationDTO $dto, User $owner): Organization
    {
        return DB::transaction(function () use ($dto, $owner) {
            $organization = Organization::create([
                'name' => $dto->name,
                'slug' => $dto->slug,
                'description' => $dto->description,
                'owner_id' => $owner->id,
            ]);

            // Add owner as admin member
            $organization->members()->create([
                'user_id' => $owner->id,
                'role' => 'admin',
            ]);

            return $organization;
        });
    }

    /**
     * Update an organization.
     */
    public function update(Organization $organization, UpdateOrganizationDTO $dto): Organization
    {
        $organization->update($dto->toArray());

        return $organization->fresh();
    }

    /**
     * Delete an organization.
     */
    public function delete(Organization $organization): bool
    {
        return $organization->delete();
    }

    /**
     * Get organization details with related data.
     */
    public function getWithDetails(Organization $organization): Organization
    {
        return $organization->load(['owner', 'projects', 'members.user']);
    }
}
