<?php

namespace Domain\Task\Contracts;

use Domain\Task\Models\Task;
use Domain\Task\Models\TaskComment;
use Domain\Task\DTOs\CreateCommentDTO;
use App\Models\User;
use Illuminate\Support\Collection;

interface CommentServiceInterface
{
    /**
     * Add a comment to a task.
     */
    public function create(Task $task, CreateCommentDTO $dto, User $user): TaskComment;

    /**
     * Delete a comment.
     */
    public function delete(TaskComment $comment): bool;

    /**
     * Get all comments for a task.
     */
    public function getCommentsForTask(Task $task): Collection;
}
