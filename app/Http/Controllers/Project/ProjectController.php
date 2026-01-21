<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Domain\Project\Models\Project;
use Domain\Project\Contracts\ProjectServiceInterface;
use Domain\Project\DTOs\CreateProjectDTO;
use Domain\Project\DTOs\UpdateProjectDTO;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectServiceInterface $projectService
    ) {}

    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = $this->projectService->getProjectsForUser(auth()->user());

        return Inertia::render('Project/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $this->authorize('create', Project::class);

        $organizations = $this->projectService->getOrganizationsForProjectCreation(auth()->user());

        return Inertia::render('Project/Create', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:10|unique:projects,key',
            'description' => 'nullable|string',
            'organization_id' => 'required|exists:organizations,id',
        ]);

        $dto = CreateProjectDTO::fromArray($validated);
        $project = $this->projectService->create($dto, auth()->user());

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Show the project details.
     */
    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $projectData = $this->projectService->getProjectWithBoardData($project);

        return Inertia::render('Project/Show', [
            'project' => $projectData->project,
            'board' => $projectData->boardData,
            'users' => $projectData->members,
            'can' => [
                'update' => auth()->user()->can('update', $project),
                'delete' => auth()->user()->can('delete', $project),
                'manageMembers' => auth()->user()->can('manageMembers', $project),
                'createTask' => auth()->user()->can('create', \Domain\Task\Models\Task::class),
            ],
        ]);
    }

    /**
     * Show the form for editing the project.
     */
    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load('organization');

        return Inertia::render('Project/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,archived',
        ]);

        $dto = UpdateProjectDTO::fromArray($validated);
        $this->projectService->update($project, $dto);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->delete($project);

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
