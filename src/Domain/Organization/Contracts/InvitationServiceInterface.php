<?php

namespace Domain\Organization\Contracts;

use Domain\Organization\Models\Organization;
use Domain\Organization\DTOs\CreateInvitationDTO;
use Domain\Organization\DTOs\InvitationResultDTO;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Support\Collection;

interface InvitationServiceInterface
{
    /**
     * Create a new invitation link.
     */
    public function create(Organization $organization, CreateInvitationDTO $dto, User $inviter): InvitationResultDTO;

    /**
     * Accept an invitation.
     */
    public function accept(string $token, User $user): Organization;

    /**
     * Get invitation by token.
     */
    public function getByToken(string $token): ?OrganizationInvitation;

    /**
     * Get active invitations for an organization.
     */
    public function getActiveInvitations(Organization $organization): Collection;

    /**
     * Get pending invitations for an organization (deprecated - use getActiveInvitations).
     */
    public function getPendingInvitations(Organization $organization): Collection;

    /**
     * Cancel an invitation.
     */
    public function cancel(OrganizationInvitation $invitation): bool;

    /**
     * Check if invitation is valid.
     */
    public function isValidInvitation(OrganizationInvitation $invitation): bool;

    /**
     * Check if email already has pending invitation (deprecated).
     */
    public function hasPendingInvitation(Organization $organization, string $email): bool;
}
