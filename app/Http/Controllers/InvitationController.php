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
     * Create a new invitation for the organization
     */
    public function create(Request $request, Organization $organization)
    {
        $this->authorize('manageMembers', $organization);

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,manager,member'],
        ]);

        try {
            $dto = CreateInvitationDTO::fromArray($validated);
            $result = $this->invitationService->create($organization, $dto, Auth::user());

            return back()->with('success', 'Invitation sent successfully!')
                ->with('invitation_url', $result->invitationUrl);
        } catch (MemberAlreadyExistsException $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        } catch (InvitationAlreadyExistsException $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    /**
     * View invitation details (before registration)
     */
    public function show(string $token)
    {
        $invitation = $this->invitationService->getByToken($token);

        if (!$invitation) {
            abort(404);
        }

        if ($invitation->isExpired()) {
            return Inertia::render('Invitation/Expired', [
                'organization' => $invitation->organization->name,
            ]);
        }

        if ($invitation->isAccepted()) {
            return Inertia::render('Invitation/AlreadyAccepted', [
                'organization' => $invitation->organization->name,
            ]);
        }

        return Inertia::render('Invitation/Show', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'organization' => [
                    'id' => $invitation->organization->id,
                    'name' => $invitation->organization->name,
                ],
                'inviter' => [
                    'name' => $invitation->inviter->name,
                ],
                'expires_at' => $invitation->expires_at->toDateTimeString(),
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
     * List all pending invitations for an organization
     */
    public function index(Organization $organization)
    {
        $this->authorize('manageMembers', $organization);

        $invitations = $this->invitationService->getPendingInvitations($organization);

        return Inertia::render('Organization/Invitations', [
            'organization' => $organization,
            'invitations' => $invitations,
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
