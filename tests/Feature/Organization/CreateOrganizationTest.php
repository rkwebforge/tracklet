<?php

namespace Tests\Feature\Organization;

use Tests\TestCase;
use App\Models\User;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateOrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_user_can_access_setup_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/setup');

        $response->assertStatus(200);
    }

    public function test_user_can_create_first_organization(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/setup', [
            'name' => 'Test Organization',
            'description' => 'This is a test organization',
        ]);

        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('organizations', [
            'name' => 'Test Organization',
            'owner_id' => $user->id,
        ]);

        // Check that user is added as admin member
        $organization = Organization::where('owner_id', $user->id)->first();
        
        $this->assertDatabaseHas('organization_members', [
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);
    }

    public function test_organization_creation_generates_unique_slug(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/setup', [
            'name' => 'My Cool Org',
            'description' => 'Description',
        ]);

        $organization = Organization::where('owner_id', $user->id)->first();
        
        $this->assertEquals('my-cool-org', $organization->slug);
    }

    public function test_duplicate_org_names_get_unique_slugs(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        // First user creates organization
        Organization::create([
            'name' => 'Acme Corp',
            'slug' => 'acme-corp',
            'owner_id' => $firstUser->id,
        ]);

        // Second user tries to create organization with same name
        $response = $this->actingAs($secondUser)->post('/setup', [
            'name' => 'Acme Corp',
            'description' => 'Another Acme',
        ]);

        $organization = Organization::where('owner_id', $secondUser->id)->first();
        
        // Should have different slug
        $this->assertNotEquals('acme-corp', $organization->slug);
        $this->assertStringStartsWith('acme-corp-', $organization->slug);
    }

    public function test_user_with_existing_organization_cannot_create_another(): void
    {
        $user = User::factory()->create();
        
        // User already has an organization
        $organization = Organization::factory()->create(['owner_id' => $user->id]);
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->post('/setup', [
            'name' => 'Second Organization',
            'description' => 'Should not be created',
        ]);

        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('error');

        $this->assertDatabaseMissing('organizations', [
            'name' => 'Second Organization',
        ]);
    }

    public function test_user_with_organization_is_redirected_from_setup(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $user->id]);
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user)->get('/setup');

        $response->assertRedirect('/dashboard');
    }

    public function test_organization_creation_requires_name(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/setup', [
            'description' => 'Description only',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_organization_description_is_optional(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/setup', [
            'name' => 'Test Organization',
        ]);

        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseHas('organizations', [
            'name' => 'Test Organization',
            'description' => null,
        ]);
    }

    public function test_organization_creation_fails_for_guests(): void
    {
        $response = $this->post('/setup', [
            'name' => 'Test Organization',
        ]);

        $response->assertRedirect('/login');
    }
}
