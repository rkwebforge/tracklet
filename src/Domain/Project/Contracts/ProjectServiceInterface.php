<?php

namespace Domain\Project\Contracts;

use Domain\Project\Models\Project;
use Domain\Project\DTOs\CreateProjectDTO;
use Domain\Project\DTOs\UpdateProjectDTO;
use Domain\Project\DTOs\ProjectBoardDataDTO;
use App\Models\User;
use Illuminate\Support\Collection;

interface ProjectServiceInterface
{
    /**
     * Get all projects accessible to a user.
     */
    public function getProjectsForUser(User $user): Collection;

    /**
     * Create a new project with default board.
     */
    public function create(CreateProjectDTO $dto, User $owner): Project;

    /**
     * Update a project.
     */
    public function update(Project $project, UpdateProjectDTO $dto): Project;

    /**
     * Delete a project.
     */
    public function delete(Project $project): bool;

    /**
     * Get project with board data for display.
     */
    public function getProjectWithBoardData(Project $project): ProjectBoardDataDTO;

    /**
     * Get organizations user can create projects in.
     */
    public function getOrganizationsForProjectCreation(User $user): Collection;
}
