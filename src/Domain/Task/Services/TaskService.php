<?php

namespace Domain\Task\Services;

use Domain\Task\Contracts\TaskServiceInterface;
use Domain\Task\Models\Task;
use Domain\Task\DTOs\CreateTaskDTO;
use Domain\Task\DTOs\UpdateTaskDTO;
use Domain\Task\DTOs\MoveTaskDTO;
use App\Models\User;

class TaskService implements TaskServiceInterface
{
    /**
     * Create a new task.
     */
    public function create(CreateTaskDTO $dto, User $reporter): Task
    {
        $maxPosition = $this->getNextPosition($dto->boardId, $dto->status);

        return Task::create([
            'title' => $dto->title,
            'description' => $dto->description,
            'type' => $dto->type,
            'priority' => $dto->priority,
            'status' => $dto->status,
            'project_id' => $dto->projectId,
            'board_id' => $dto->boardId,
            'assignee_id' => $dto->assigneeId,
            'reporter_id' => $reporter->id,
            'position' => $maxPosition,
        ]);
    }

    /**
     * Update a task.
     */
    public function update(Task $task, UpdateTaskDTO $dto): Task
    {
        $task->update($dto->toArray());

        return $task->fresh();
    }

    /**
     * Move a task to a different status/position.
     */
    public function move(Task $task, MoveTaskDTO $dto): Task
    {
        $maxPosition = Task::where('board_id', $task->board_id)
            ->where('status', $dto->status)
            ->max('position') ?? -1;

        $task->update([
            'status' => $dto->status,
            'position' => min($dto->position, $maxPosition + 1),
        ]);

        return $task->fresh();
    }

    /**
     * Delete a task.
     */
    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Get task with all related data.
     */
    public function getWithDetails(Task $task): Task
    {
        return $task->load(['project', 'board', 'assignee', 'reporter', 'comments.user']);
    }

    /**
     * Calculate next position for a task in a status column.
     */
    public function getNextPosition(int $boardId, string $status): int
    {
        $maxPosition = Task::where('board_id', $boardId)
            ->where('status', $status)
            ->max('position') ?? -1;

        return $maxPosition + 1;
    }
}
