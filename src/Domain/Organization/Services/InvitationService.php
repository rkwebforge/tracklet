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
     * Create a new invitation.
     */
    public function create(Organization $organization, CreateInvitationDTO $dto, User $inviter): InvitationResultDTO
    {
        // Check if user is already a member
        $existingMember = OrganizationMember::where('organization_id', $organization->id)
            ->whereHas('user', function ($query) use ($dto) {
                $query->where('email', $dto->email);
            })
            ->exists();

        if ($existingMember) {
            throw new MemberAlreadyExistsException('User is already a member of this organization.');
        }

        // Check if there's already a pending invitation
        if ($this->hasPendingInvitation($organization, $dto->email)) {
            throw new InvitationAlreadyExistsException('An invitation has already been sent to this email.');
        }

        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $inviter->id,
            'email' => $dto->email,
            'token' => OrganizationInvitation::generateToken(),
            'role' => $dto->role,
            'expires_at' => now()->addDays(7),
        ]);

        $invitationUrl = url('/register?invite=' . $invitation->token);

        return InvitationResultDTO::success($invitation, $invitationUrl);
    }

    /**
     * Accept an invitation.
     */
    public function accept(string $token, User $user): Organization
    {
        $invitation = $this->getByToken($token);

        if (!$invitation || $invitation->email !== $user->email) {
            throw new InvalidInvitationException('Invalid invitation.');
        }

        if (!$this->isValidInvitation($invitation)) {
            throw new InvalidInvitationException('This invitation is no longer valid.');
        }

        return DB::transaction(function () use ($invitation, $user) {
            // Add user to organization
            OrganizationMember::create([
                'organization_id' => $invitation->organization_id,
                'user_id' => $user->id,
                'role' => $invitation->role,
            ]);

            // Mark invitation as accepted
            $invitation->markAsAccepted($user);

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
     * Get pending invitations for an organization.
     */
    public function getPendingInvitations(Organization $organization): Collection
    {
        return OrganizationInvitation::with('inviter')
            ->where('organization_id', $organization->id)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->get();
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
        return !$invitation->isExpired() && !$invitation->isAccepted();
    }

    /**
     * Check if email already has pending invitation.
     */
    public function hasPendingInvitation(Organization $organization, string $email): bool
    {
        return OrganizationInvitation::where('organization_id', $organization->id)
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->exists();
    }
}
