<?php

namespace Domain\Organization\Services;

use Domain\Organization\Contracts\InvitationServiceInterface;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Domain\Organization\DTOs\CreateInvitationDTO;
use Domain\Organization\DTOs\InvitationResultDTO;
use Domain\Organization\Exceptions\MemberAlreadyExistsException;
use Domain\Organization\Exceptions\InvitationAlreadyExistsException;
use Domain\Organization\Exceptions\InvalidInvitationException;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InvitationService implements InvitationServiceInterface
{
    /**
     * Create a new invitation link.
     */
    public function create(Organization $organization, CreateInvitationDTO $dto, User $inviter): InvitationResultDTO
    {
        $expiresAt = $dto->expiresInDays 
            ? now()->addDays($dto->expiresInDays) 
            : null;

        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $inviter->id,
            'token' => OrganizationInvitation::generateToken(),
            'role' => $dto->role,
            'max_uses' => $dto->maxUses,
            'uses_count' => 0,
            'expires_at' => $expiresAt,
        ]);

        $invitationUrl = url('/register?invite=' . $invitation->token);

        return InvitationResultDTO::success($invitation, $invitationUrl);
    }

    /**
     * Accept an invitation (for newly registered users).
     */
    public function accept(string $token, User $user): Organization
    {
        $invitation = $this->getByToken($token);

        if (!$invitation) {
            throw new InvalidInvitationException('Invalid invitation.');
        }

        if (!$this->isValidInvitation($invitation)) {
            throw new InvalidInvitationException('This invitation is no longer valid.');
        }

        // Check if user is already a member
        $existingMember = OrganizationMember::where('organization_id', $invitation->organization_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($existingMember) {
            throw new InvalidInvitationException('You are already a member of this organization.');
        }

        return DB::transaction(function () use ($invitation, $user) {
            // Add user to organization
            OrganizationMember::create([
                'organization_id' => $invitation->organization_id,
                'user_id' => $user->id,
                'role' => $invitation->role,
            ]);

            // Increment usage count
            $invitation->increment('uses_count');

            return $invitation->organization;
        });
    }

    /**
     * Get invitation by token.
     */
    public function getByToken(string $token): ?OrganizationInvitation
    {
        return OrganizationInvitation::with(['organization', 'inviter'])
            ->where('token', $token)
            ->first();
    }

    /**
     * Get active invitations for an organization.
     */
    public function getActiveInvitations(Organization $organization): Collection
    {
        return OrganizationInvitation::with('inviter')
            ->where('organization_id', $organization->id)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->where(function ($query) {
                $query->whereNull('max_uses')
                    ->orWhereRaw('uses_count < max_uses');
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get pending invitations for an organization (deprecated - use getActiveInvitations).
     */
    public function getPendingInvitations(Organization $organization): Collection
    {
        return $this->getActiveInvitations($organization);
    }

    /**
     * Cancel an invitation.
     */
    public function cancel(OrganizationInvitation $invitation): bool
    {
        return $invitation->delete();
    }

    /**
     * Check if invitation is valid.
     */
    public function isValidInvitation(OrganizationInvitation $invitation): bool
    {
        return !$invitation->isExpired() && !$invitation->isMaxUsesReached();
    }

    /**
     * Check if email already has pending invitation (deprecated for link-based system).
     */
    public function hasPendingInvitation(Organization $organization, string $email): bool
    {
        return false; // No longer applicable for link-based invitations
    }
}
