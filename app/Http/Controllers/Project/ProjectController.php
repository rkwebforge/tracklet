<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Domain\Project\Models\Project;
use Domain\Board\Models\Board;
use Domain\Organization\Models\Organization;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::whereHas('organization.members', function($query) {
            $query->where('user_id', auth()->id());
        })->with(['organization', 'owner'])->get();

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the project details.
     */
    public function show(int $id): Response
    {
        $project = Project::with(['organization', 'owner', 'boards'])
            ->findOrFail($id);
        
        $board = Board::where('project_id', $id)
            ->with(['tasks.assignee', 'tasks.reporter'])
            ->first();

        // Create a default board if none exists
        if (!$board) {
            $board = Board::create([
                'name' => 'Main Board',
                'project_id' => $project->id,
                'type' => 'kanban',
            ]);
        }

        // Transform board data to include columns organized by status
        $statuses = [
            ['id' => 'backlog', 'name' => 'Backlog', 'color' => '#94a3b8'],
            ['id' => 'todo', 'name' => 'To Do', 'color' => '#3b82f6'],
            ['id' => 'in_progress', 'name' => 'In Progress', 'color' => '#f59e0b'],
            ['id' => 'in_review', 'name' => 'In Review', 'color' => '#8b5cf6'],
            ['id' => 'done', 'name' => 'Done', 'color' => '#10b981'],
        ];

        $columns = collect($statuses)->map(function ($status) use ($board) {
            $tasks = $board->tasks->where('status', $status['id'])->values();
            return array_merge($status, ['tasks' => $tasks]);
        });

        $boardData = [
            'id' => $board->id,
            'name' => $board->name,
            'columns' => $columns,
        ];

        // Get organization members for assignee dropdown
        $members = $project->organization->members()->with('user')->get()->pluck('user');

        return Inertia::render('Project/Show', [
            'project' => $project,
            'board' => $boardData,
            'users' => $members,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $organizations = Organization::whereHas('members', function($query) {
            $query->where('user_id', auth()->id());
        })->get();

        return Inertia::render('Project/Create', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:10|unique:projects,key',
            'description' => 'nullable|string',
            'organization_id' => 'required|exists:organizations,id',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'key' => strtoupper($validated['key']),
            'description' => $validated['description'],
            'organization_id' => $validated['organization_id'],
            'owner_id' => auth()->id(),
            'status' => 'active',
        ]);

        // Create default board for the project
        Board::create([
            'name' => 'Main Board',
            'project_id' => $project->id,
            'type' => 'kanban',
        ]);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Show the form for editing the project.
     */
    public function edit(int $id): Response
    {
        $project = Project::with('organization')->findOrFail($id);

        return Inertia::render('Project/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,archived',
        ]);

        $project->update($validated);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(int $id): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
