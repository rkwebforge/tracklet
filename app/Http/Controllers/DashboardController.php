<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Domain\Organization\Models\Organization;
use Domain\Project\Models\Project;
use Domain\Task\Models\Task;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     * Redirect to setup if user has no organization.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Eager load relationships to reduce queries
        $user->load(['ownedOrganizations', 'organizationMemberships.organization']);

        // Check if user has any organization (using loaded relationships)
        $hasOrganization = $user->ownedOrganizations->isNotEmpty() 
            || $user->organizationMemberships->isNotEmpty();

        // Redirect to setup if no organization
        if (!$hasOrganization) {
            return redirect()->route('setup');
        }

        // Get user's organizations efficiently
        $organizations = $user->ownedOrganizations
            ->merge($user->organizationMemberships->pluck('organization'))
            ->unique('id')
            ->values();

        // Get organization IDs for querying projects
        $organizationIds = $organizations->pluck('id');

        // Get recent projects with optimized query
        $recentProjects = Project::whereIn('organization_id', $organizationIds)
            ->with(['organization', 'owner'])
            ->latest()
            ->limit(5)
            ->get();

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
