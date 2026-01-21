<?php

namespace Domain\Task\Services;

use Domain\Task\Contracts\CommentServiceInterface;
use Domain\Task\Models\Task;
use Domain\Task\Models\TaskComment;
use Domain\Task\DTOs\CreateCommentDTO;
use App\Models\User;
use Illuminate\Support\Collection;

class CommentService implements CommentServiceInterface
{
    /**
     * Add a comment to a task.
     */
    public function create(Task $task, CreateCommentDTO $dto, User $user): TaskComment
    {
        return $task->comments()->create([
            'content' => $dto->content,
            'user_id' => $user->id,
        ]);
    }

    /**
     * Delete a comment.
     */
    public function delete(TaskComment $comment): bool
    {
        return $comment->delete();
    }

    /**
     * Get all comments for a task.
     */
    public function getCommentsForTask(Task $task): Collection
    {
        return $task->comments()->with('user')->orderBy('created_at', 'desc')->get();
    }
}
