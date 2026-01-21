<?php

namespace Domain\Task\Contracts;

use Domain\Task\Models\Task;
use Domain\Task\DTOs\CreateTaskDTO;
use Domain\Task\DTOs\UpdateTaskDTO;
use Domain\Task\DTOs\MoveTaskDTO;
use App\Models\User;

interface TaskServiceInterface
{
    /**
     * Create a new task.
     */
    public function create(CreateTaskDTO $dto, User $reporter): Task;

    /**
     * Update a task.
     */
    public function update(Task $task, UpdateTaskDTO $dto): Task;

    /**
     * Move a task to a different status/position.
     */
    public function move(Task $task, MoveTaskDTO $dto): Task;

    /**
     * Delete a task.
     */
    public function delete(Task $task): bool;

    /**
     * Get task with all related data.
     */
    public function getWithDetails(Task $task): Task;

    /**
     * Calculate next position for a task in a status column.
     */
    public function getNextPosition(int $boardId, string $status): int;
}
