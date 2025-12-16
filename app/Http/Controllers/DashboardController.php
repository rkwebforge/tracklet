<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Domain\Organization\Models\Organization;
use Domain\Project\Models\Project;
use Domain\Task\Models\Task;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get user's organizations
        $organizations = Organization::whereHas('members', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        // Get recent projects
        $recentProjects = Project::whereHas('organization.members', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['organization', 'owner'])->latest()->limit(5)->get();

        // Get tasks assigned to user
        $recentTasks = Task::where('assignee_id', $user->id)
            ->with(['project', 'assignee', 'reporter'])
            ->whereIn('status', ['todo', 'in_progress'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'organizations' => $organizations,
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
        ]);
    }
}
