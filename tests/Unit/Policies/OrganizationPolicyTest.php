<?php

namespace Tests\Unit\Policies;

use Tests\TestCase;
use App\Models\User;
use App\Policies\OrganizationPolicy;
use Domain\Organization\Models\Organization;
use Domain\Organization\Models\OrganizationMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrganizationPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected OrganizationPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new OrganizationPolicy();
    }

    public function test_any_user_can_view_any_organizations(): void
    {
        $user = User::factory()->create();

        $result = $this->policy->viewAny($user);

        $this->assertTrue($result);
    }

    public function test_owner_can_view_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $user->id]);

        $result = $this->policy->view($user, $organization);

        $this->assertTrue($result);
    }

    public function test_member_can_view_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'member',
        ]);

        $result = $this->policy->view($user, $organization);

        $this->assertTrue($result);
    }

    public function test_non_member_cannot_view_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();

        $result = $this->policy->view($user, $organization);

        $this->assertFalse($result);
    }

    public function test_any_user_can_create_organizations(): void
    {
        $user = User::factory()->create();

        $result = $this->policy->create($user);

        $this->assertTrue($result);
    }

    public function test_owner_can_update_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $user->id]);

        $result = $this->policy->update($user, $organization);

        $this->assertTrue($result);
    }

    public function test_admin_can_update_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);

        $result = $this->policy->update($user, $organization);

        $this->assertTrue($result);
    }

    public function test_manager_cannot_update_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'manager',
        ]);

        $result = $this->policy->update($user, $organization);

        $this->assertFalse($result);
    }

    public function test_member_cannot_update_organization(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'member',
        ]);

        $result = $this->policy->update($user, $organization);

        $this->assertFalse($result);
    }

    public function test_only_owner_can_delete_organization(): void
    {
        $owner = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $owner->id]);

        $result = $this->policy->delete($owner, $organization);

        $this->assertTrue($result);
    }

    public function test_admin_cannot_delete_organization(): void
    {
        $admin = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $admin->id,
            'role' => 'admin',
        ]);

        $result = $this->policy->delete($admin, $organization);

        $this->assertFalse($result);
    }

    public function test_owner_can_manage_members(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['owner_id' => $user->id]);

        $result = $this->policy->manageMembers($user, $organization);

        $this->assertTrue($result);
    }

    public function test_admin_can_manage_members(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);

        $result = $this->policy->manageMembers($user, $organization);

        $this->assertTrue($result);
    }

    public function test_manager_cannot_manage_members(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create();
        
        OrganizationMember::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => 'manager',
        ]);

        $result = $this->policy->manageMembers($user, $organization);

        $this->assertFalse($result);
    }
}
