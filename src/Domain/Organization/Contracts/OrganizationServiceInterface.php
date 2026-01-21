<?php

namespace Domain\Organization\Contracts;

use Domain\Organization\Models\Organization;
use Domain\Organization\DTOs\CreateOrganizationDTO;
use Domain\Organization\DTOs\UpdateOrganizationDTO;
use App\Models\User;
use Illuminate\Support\Collection;

interface OrganizationServiceInterface
{
    /**
     * Get all organizations for a user.
     */
    public function getOrganizationsForUser(User $user): Collection;

    /**
     * Create a new organization.
     */
    public function create(CreateOrganizationDTO $dto, User $owner): Organization;

    /**
     * Update an organization.
     */
    public function update(Organization $organization, UpdateOrganizationDTO $dto): Organization;

    /**
     * Delete an organization.
     */
    public function delete(Organization $organization): bool;

    /**
     * Get organization details with related data.
     */
    public function getWithDetails(Organization $organization): Organization;
}
