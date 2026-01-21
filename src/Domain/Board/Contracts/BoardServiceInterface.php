<?php

namespace Domain\Board\Contracts;

use Domain\Board\Models\Board;
use Domain\Board\DTOs\UpdateBoardDTO;
use Domain\Board\DTOs\BoardWithTasksDTO;
use Domain\Project\Models\Project;

interface BoardServiceInterface
{
    /**
     * Create a default board for a project.
     */
    public function createDefaultBoard(Project $project): Board;

    /**
     * Update a board.
     */
    public function update(Board $board, UpdateBoardDTO $dto): Board;

    /**
     * Get board with organized tasks by status.
     */
    public function getBoardWithTasks(Board $board): BoardWithTasksDTO;

    /**
     * Get or create the main board for a project.
     */
    public function getOrCreateMainBoard(Project $project): Board;

    /**
     * Get all status columns configuration.
     */
    public function getStatusColumns(): array;
}
