<?php

namespace Tests\Feature\Organization;

use Tests\TestCase;
use App\Models\User;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrganizationAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_organization(): void
    {
        $owner = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($owner)->put("/organizations/{$organization->id}", [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);

        $response->assertSessionDoesntHaveErrors();
        
        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_admin_can_update_organization(): void
    {
        $owner = User::factory()->create();
        $admin = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $admin->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->put("/organizations/{$organization->id}", [
            'name' => 'Updated by Admin',
            'description' => 'Description',
        ]);

        $response->assertSessionDoesntHaveErrors();
        
        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
            'name' => 'Updated by Admin',
        ]);
    }

    public function test_member_cannot_update_organization(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($member)->put("/organizations/{$organization->id}", [
            'name' => 'Should Not Update',
        ]);

        $response->assertForbidden();
        
        $this->assertDatabaseMissing('organizations', [
            'name' => 'Should Not Update',
        ]);
    }

    public function test_only_owner_can_delete_organization(): void
    {
        $owner = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($owner)->delete("/organizations/{$organization->id}");

        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseMissing('organizations', [
            'id' => $organization->id,
        ]);
    }

    public function test_admin_cannot_delete_organization(): void
    {
        $owner = User::factory()->create();
        $admin = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $admin->id,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->delete("/organizations/{$organization->id}");

        $response->assertForbidden();
        
        $this->assertDatabaseHas('organizations', [
            'id' => $organization->id,
        ]);
    }

    public function test_non_member_cannot_view_organization(): void
    {
        $owner = User::factory()->create();
        $outsider = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($outsider)->get("/organizations/{$organization->id}");

        $response->assertForbidden();
    }

    public function test_member_can_view_organization(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $member->id,
            'role' => 'member',
        ]);

        $response = $this->actingAs($member)->get("/organizations/{$organization->id}");

        $response->assertStatus(200);
    }
}
