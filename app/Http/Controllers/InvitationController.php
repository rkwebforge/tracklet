<?php

namespace App\Http\Controllers;

use App\Models\OrganizationInvitation;
use Domain\Organization\Models\Organization;
use Domain\Organization\Contracts\InvitationServiceInterface;
use Domain\Organization\DTOs\CreateInvitationDTO;
use Domain\Organization\Exceptions\MemberAlreadyExistsException;
use Domain\Organization\Exceptions\InvitationAlreadyExistsException;
use Domain\Organization\Exceptions\InvalidInvitationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function __construct(
        private InvitationServiceInterface $invitationService
    ) {}

    /**
     * Create a new invitation link for the organization
     */
    public function create(Request $request, Organization $organization)
    {
        $this->authorize('manageMembers', $organization);

        $validated = $request->validate([
            'role' => ['required', 'in:admin,manager,member'],
            'expires_in_days' => ['nullable', 'integer', 'min:1'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
        ]);

        try {
            $dto = CreateInvitationDTO::fromArray($validated);
            $result = $this->invitationService->create($organization, $dto, Auth::user());

            return back()->with('success', 'Invitation link generated successfully!')
                ->with('invitation_token', $result->invitation->token);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * View invitation details (before registration)
     */
    public function show(string $token)
    {
        $invitation = $this->invitationService->getByToken($token);

        if (!$invitation) {
            abort(404, 'Invitation not found');
        }

        if ($invitation->isExpired()) {
            return Inertia::render('Invitation/Expired', [
                'organization' => $invitation->organization->name,
            ]);
        }

        if ($invitation->isMaxUsesReached()) {
            return Inertia::render('Invitation/MaxUsesReached', [
                'organization' => $invitation->organization->name,
            ]);
        }

        return Inertia::render('Invitation/Show', [
            'invitation' => [
                'token' => $invitation->token,
                'role' => $invitation->role,
                'organization' => [
                    'id' => $invitation->organization->id,
                    'name' => $invitation->organization->name,
                ],
                'inviter' => [
                    'name' => $invitation->inviter->name,
                ],
                'expires_at' => $invitation->expires_at?->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Accept invitation (for already logged in users)
     */
    public function accept(Request $request, string $token)
    {
        $user = Auth::user();

        try {
            $organization = $this->invitationService->accept($token, $user);

            return redirect()->route('dashboard')
                ->with('success', 'You have successfully joined ' . $organization->name);
        } catch (InvalidInvitationException $e) {
            return back()->withErrors(['invitation' => $e->getMessage()]);
        }
    }

    /**
     * List all active invitations for an organization
     */
    public function index(Organization $organization)
    {
        $this->authorize('manageMembers', $organization);

        $invitations = $this->invitationService->getActiveInvitations($organization);

        return Inertia::render('Organization/Invitations', [
            'organization' => $organization,
            'invitations' => $invitations->map(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'token' => $invitation->token,
                    'role' => $invitation->role,
                    'max_uses' => $invitation->max_uses,
                    'uses_count' => $invitation->uses_count,
                    'expires_at' => $invitation->expires_at?->toDateTimeString(),
                    'created_at' => $invitation->created_at->toDateTimeString(),
                    'inviter' => $invitation->inviter ? [
                        'id' => $invitation->inviter->id,
                        'name' => $invitation->inviter->name,
                    ] : null,
                ];
            }),
        ]);
    }

    /**
     * Revoke/cancel an invitation
     */
    public function destroy(Organization $organization, OrganizationInvitation $invitation)
    {
        $this->authorize('manageMembers', $organization);

        if ($invitation->organization_id !== $organization->id) {
            abort(403);
        }

        $this->invitationService->cancel($invitation);

        return back()->with('success', 'Invitation revoked successfully.');
    }
}
