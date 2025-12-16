<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Domain\Organization\Models\Organization;
use Domain\Organization\Enums\MemberRole;
use Domain\Project\Models\Project;
use Domain\Board\Models\Board;
use Domain\Task\Models\Task;
use Domain\Task\Enums\TaskStatus;
use Domain\Task\Enums\TaskPriority;
use Domain\Task\Enums\TaskType;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo data.
     */
    public function run(): void
    {
        // Create demo users
        $admin = User::create([
            'name' => 'John Doe',
            'email' => 'admin@tracklet.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $manager = User::create([
            'name' => 'Jane Smith',
            'email' => 'manager@tracklet.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $developer = User::create([
            'name' => 'Bob Wilson',
            'email' => 'dev@tracklet.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create organizations
        $org1 = Organization::create([
            'name' => 'Acme Corporation',
            'slug' => 'acme-corp',
            'description' => 'Leading technology solutions provider',
            'owner_id' => $admin->id,
        ]);

        $org2 = Organization::create([
            'name' => 'TechStart Inc',
            'slug' => 'techstart',
            'description' => 'Innovative startup building the future',
            'owner_id' => $manager->id,
        ]);

        // Add organization members
        DB::table('organization_members')->insert([
            ['organization_id' => $org1->id, 'user_id' => $admin->id, 'role' => MemberRole::ADMIN->value, 'created_at' => now(), 'updated_at' => now()],
            ['organization_id' => $org1->id, 'user_id' => $manager->id, 'role' => MemberRole::MANAGER->value, 'created_at' => now(), 'updated_at' => now()],
            ['organization_id' => $org1->id, 'user_id' => $developer->id, 'role' => MemberRole::MEMBER->value, 'created_at' => now(), 'updated_at' => now()],
            ['organization_id' => $org2->id, 'user_id' => $manager->id, 'role' => MemberRole::ADMIN->value, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create projects
        $project1 = Project::create([
            'name' => 'Website Redesign',
            'key' => 'WEB',
            'description' => 'Complete overhaul of company website with modern UI/UX',
            'organization_id' => $org1->id,
            'owner_id' => $admin->id,
            'status' => 'active',
        ]);

        $project2 = Project::create([
            'name' => 'Mobile App Development',
            'key' => 'MOB',
            'description' => 'Native iOS and Android application for customer engagement',
            'organization_id' => $org1->id,
            'owner_id' => $manager->id,
            'status' => 'active',
        ]);

        $project3 = Project::create([
            'name' => 'API Integration',
            'key' => 'API',
            'description' => 'Integration with third-party payment and analytics APIs',
            'organization_id' => $org2->id,
            'owner_id' => $manager->id,
            'status' => 'active',
        ]);

        // Create boards for each project
        $board1 = Board::create([
            'name' => 'Main Board',
            'project_id' => $project1->id,
            'type' => 'kanban',
        ]);

        $board2 = Board::create([
            'name' => 'Sprint Board',
            'project_id' => $project2->id,
            'type' => 'kanban',
        ]);

        $board3 = Board::create([
            'name' => 'Planning Board',
            'project_id' => $project3->id,
            'type' => 'kanban',
        ]);

        // Create tasks for projects
        Task::create([
            'title' => 'Design homepage mockups',
            'description' => 'Create initial design concepts for the new homepage',
            'board_id' => $board1->id,
            'project_id' => $project1->id,
            'reporter_id' => $admin->id,
            'assignee_id' => $developer->id,
            'type' => TaskType::TASK,
            'status' => TaskStatus::IN_PROGRESS,
            'priority' => TaskPriority::HIGH,
            'position' => 0,
        ]);

        Task::create([
            'title' => 'Implement responsive navigation',
            'description' => 'Build mobile-responsive navigation menu',
            'board_id' => $board1->id,
            'project_id' => $project1->id,
            'reporter_id' => $manager->id,
            'assignee_id' => $developer->id,
            'type' => TaskType::TASK,
            'status' => TaskStatus::TODO,
            'priority' => TaskPriority::MEDIUM,
            'position' => 1,
        ]);

        Task::create([
            'title' => 'Fix login redirect bug',
            'description' => 'Users are not redirected properly after login',
            'board_id' => $board2->id,
            'project_id' => $project2->id,
            'reporter_id' => $manager->id,
            'assignee_id' => $developer->id,
            'type' => TaskType::BUG,
            'status' => TaskStatus::IN_PROGRESS,
            'priority' => TaskPriority::HIGH,
            'position' => 0,
        ]);

        Task::create([
            'title' => 'Add push notification support',
            'description' => 'Implement Firebase Cloud Messaging for push notifications',
            'board_id' => $board2->id,
            'project_id' => $project2->id,
            'reporter_id' => $admin->id,
            'type' => TaskType::STORY,
            'status' => TaskStatus::TODO,
            'priority' => TaskPriority::MEDIUM,
            'position' => 1,
        ]);

        Task::create([
            'title' => 'Research payment gateway options',
            'description' => 'Compare Stripe, PayPal, and Square integrations',
            'board_id' => $board3->id,
            'project_id' => $project3->id,
            'reporter_id' => $manager->id,
            'type' => TaskType::TASK,
            'status' => TaskStatus::TODO,
            'priority' => TaskPriority::LOW,
            'position' => 0,
        ]);

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('  Admin: admin@tracklet.com / password');
        $this->command->info('  Manager: manager@tracklet.com / password');
        $this->command->info('  Developer: dev@tracklet.com / password');
    }
}
