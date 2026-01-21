<?php

namespace Domain\Board\Services;

use Domain\Board\Contracts\BoardServiceInterface;
use Domain\Board\Models\Board;
use Domain\Board\DTOs\UpdateBoardDTO;
use Domain\Board\DTOs\BoardWithTasksDTO;
use Domain\Project\Models\Project;

class BoardService implements BoardServiceInterface
{
    /**
     * Default status columns configuration.
     */
    private const STATUS_COLUMNS = [
        ['id' => 'backlog', 'name' => 'Backlog', 'color' => '#94a3b8'],
        ['id' => 'todo', 'name' => 'To Do', 'color' => '#3b82f6'],
        ['id' => 'in_progress', 'name' => 'In Progress', 'color' => '#f59e0b'],
        ['id' => 'in_review', 'name' => 'In Review', 'color' => '#8b5cf6'],
        ['id' => 'done', 'name' => 'Done', 'color' => '#10b981'],
    ];

    /**
     * Create a default board for a project.
     */
    public function createDefaultBoard(Project $project): Board
    {
        return Board::create([
            'name' => 'Main Board',
            'project_id' => $project->id,
            'type' => 'kanban',
        ]);
    }

    /**
     * Update a board.
     */
    public function update(Board $board, UpdateBoardDTO $dto): Board
    {
        $board->update($dto->toArray());

        return $board->fresh();
    }

    /**
     * Get board with organized tasks by status.
     */
    public function getBoardWithTasks(Board $board): BoardWithTasksDTO
    {
        if (!$board->relationLoaded('tasks')) {
            $board->load(['tasks.assignee', 'tasks.reporter']);
        }

        return BoardWithTasksDTO::fromBoard($board, $this->getStatusColumns());
    }

    /**
     * Get or create the main board for a project.
     */
    public function getOrCreateMainBoard(Project $project): Board
    {
        $board = Board::where('project_id', $project->id)->first();

        if (!$board) {
            $board = $this->createDefaultBoard($project);
        }

        return $board;
    }

    /**
     * Get all status columns configuration.
     */
    public function getStatusColumns(): array
    {
        return self::STATUS_COLUMNS;
    }
}
