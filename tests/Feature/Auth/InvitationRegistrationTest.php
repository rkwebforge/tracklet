<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;
use App\Models\OrganizationInvitation;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InvitationRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_via_invitation_link(): void
    {
        // Arrange: Create organization and invitation
        $organization = Organization::factory()->create();
        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $organization->owner_id,
            'email' => 'newuser@example.com',
            'token' => 'test-token-123',
            'role' => 'member',
            'expires_at' => now()->addDays(7),
        ]);

        // Act: Register with invitation token
        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'invite_token' => 'test-token-123',
        ]);

        // Assert: User created and added to organization
        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
        ]);

        $user = User::where('email', 'newuser@example.com')->first();
        
        $this->assertDatabaseHas('organization_members', [
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'member',
        ]);

        // Assert: Invitation marked as accepted
        $invitation->refresh();
        $this->assertNotNull($invitation->accepted_at);
        $this->assertEquals($user->id, $invitation->accepted_by);
    }

    public function test_invitation_registration_requires_matching_email(): void
    {
        $organization = Organization::factory()->create();
        OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $organization->owner_id,
            'email' => 'invited@example.com',
            'token' => 'test-token-123',
            'role' => 'member',
            'expires_at' => now()->addDays(7),
        ]);

        // Try to register with different email
        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'different@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'invite_token' => 'test-token-123',
        ]);

        // User is created but not added to organization
        $user = User::where('email', 'different@example.com')->first();
        
        $this->assertDatabaseMissing('organization_members', [
            'user_id' => $user->id,
        ]);
    }

    public function test_expired_invitation_does_not_add_user_to_organization(): void
    {
        $organization = Organization::factory()->create();
        OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $organization->owner_id,
            'email' => 'newuser@example.com',
            'token' => 'expired-token',
            'role' => 'member',
            'expires_at' => now()->subDay(), // Expired
        ]);

        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'invite_token' => 'expired-token',
        ]);

        $user = User::where('email', 'newuser@example.com')->first();
        
        // User created but not added to organization
        $this->assertNotNull($user);
        $this->assertDatabaseMissing('organization_members', [
            'user_id' => $user->id,
        ]);
    }

    public function test_already_accepted_invitation_cannot_be_reused(): void
    {
        $organization = Organization::factory()->create();
        $firstUser = User::factory()->create();
        
        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $organization->owner_id,
            'email' => 'shared@example.com',
            'token' => 'used-token',
            'role' => 'member',
            'expires_at' => now()->addDays(7),
            'accepted_at' => now(),
            'accepted_by' => $firstUser->id,
        ]);

        // Try to register with the same token
        $response = $this->post('/register', [
            'name' => 'Second User',
            'email' => 'shared@example.com', // Different user, same email
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'invite_token' => 'used-token',
        ]);

        // Should not create duplicate membership
        $membershipCount = OrganizationMember::where('organization_id', $organization->id)
            ->where('user_id', $firstUser->id)
            ->count();
        
        $this->assertEquals(1, $membershipCount);
    }

    public function test_user_lands_in_dashboard_after_invitation_registration(): void
    {
        $organization = Organization::factory()->create();
        OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by' => $organization->owner_id,
            'email' => 'newuser@example.com',
            'token' => 'test-token-123',
            'role' => 'member',
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->post('/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'invite_token' => 'test-token-123',
        ]);

        // Should redirect to dashboard (not setup)
        $response->assertRedirect('/dashboard');
        
        // User should NOT be redirected to setup since they have an organization
        $user = User::where('email', 'newuser@example.com')->first();
        $this->actingAs($user);
        
        $dashboardResponse = $this->get('/dashboard');
        $dashboardResponse->assertStatus(200); // Not redirected to setup
    }
}
