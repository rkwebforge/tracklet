<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Domain\Task\Models\Task;
use Domain\Task\Models\TaskComment;
use Domain\Task\Contracts\CommentServiceInterface;
use Domain\Task\DTOs\CreateCommentDTO;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(
        private CommentServiceInterface $commentService
    ) {}

    /**
     * Add a comment to a task.
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $dto = CreateCommentDTO::fromArray($validated);
        $this->commentService->create($task, $dto, $request->user());

        return back()->with('success', 'Comment added successfully.');
    }

    /**
     * Delete a comment.
     */
    public function destroy(TaskComment $comment)
    {
        $this->authorize('delete', $comment);

        $this->commentService->delete($comment);

        return back()->with('success', 'Comment deleted successfully.');
    }
}
