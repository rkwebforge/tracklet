<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Domain\Task\Models\Task;
use Domain\Task\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Add a comment to a task.
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $task->comments()->create([
            'content' => $validated['content'],
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    /**
     * Delete a comment.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }
}
