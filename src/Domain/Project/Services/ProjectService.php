<?php

namespace Domain\Project\Services;

use Domain\Project\Contracts\ProjectServiceInterface;
use Domain\Project\Models\Project;
use Domain\Project\DTOs\CreateProjectDTO;
use Domain\Project\DTOs\UpdateProjectDTO;
use Domain\Project\DTOs\ProjectBoardDataDTO;
use Domain\Board\Contracts\BoardServiceInterface;
use Domain\Organization\Models\Organization;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProjectService implements ProjectServiceInterface
{
    public function __construct(
        private BoardServiceInterface $boardService
    ) {}

    /**
     * Get all projects accessible to a user.
     */
    public function getProjectsForUser(User $user): Collection
    {
        return Project::whereHas('organization.members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['organization', 'owner'])
            ->get();
    }

    /**
     * Create a new project with default board.
     */
    public function create(CreateProjectDTO $dto, User $owner): Project
    {
        return DB::transaction(function () use ($dto, $owner) {
            $project = Project::create([
                'name' => $dto->name,
                'key' => $dto->key,
                'description' => $dto->description,
                'organization_id' => $dto->organizationId,
                'owner_id' => $owner->id,
                'status' => 'active',
            ]);

            // Create default board for the project
            $this->boardService->createDefaultBoard($project);

            return $project;
        });
    }

    /**
     * Update a project.
     */
    public function update(Project $project, UpdateProjectDTO $dto): Project
    {
        $project->update($dto->toArray());

        return $project->fresh();
    }

    /**
     * Delete a project.
     */
    public function delete(Project $project): bool
    {
        return $project->delete();
    }

    /**
     * Get project with board data for display.
     */
    public function getProjectWithBoardData(Project $project): ProjectBoardDataDTO
    {
        $project->load(['organization', 'owner', 'boards']);

        // Get or create the main board
        $board = $this->boardService->getOrCreateMainBoard($project);
        $board->load(['tasks.assignee', 'tasks.reporter']);

        // Get board data with organized columns
        $boardWithTasks = $this->boardService->getBoardWithTasks($board);

        // Get organization members for assignee dropdown
        $members = $project->organization->members()->with('user')->get()->pluck('user');

        return new ProjectBoardDataDTO(
            project: $project,
            boardData: $boardWithTasks->toArray(),
            members: $members,
        );
    }

    /**
     * Get organizations user can create projects in.
     */
    public function getOrganizationsForProjectCreation(User $user): Collection
    {
        return Organization::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();
    }
}
