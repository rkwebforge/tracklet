<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Domain\Task\Models\Task;
use Domain\Task\Enums\TaskType;
use Domain\Task\Enums\TaskStatus;
use Domain\Task\Enums\TaskPriority;
use Domain\Project\Models\Project;
use Domain\Board\Models\Board;
use App\Models\User;

class TaskController extends Controller
{
    /**
     * Display the specified task.
     */
    public function show(int $id): Response
    {
        $task = Task::with(['project', 'board', 'assignee', 'reporter'])
            ->findOrFail($id);

        return Inertia::render('Task/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', TaskType::values()),
            'priority' => 'required|in:' . implode(',', TaskPriority::values()),
            'status' => 'required|in:' . implode(',', TaskStatus::values()),
            'project_id' => 'required|exists:projects,id',
            'board_id' => 'required|exists:boards,id',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        // Get the max position for tasks in this status
        $maxPosition = Task::where('board_id', $validated['board_id'])
            ->where('status', $validated['status'])
            ->max('position') ?? -1;

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'project_id' => $validated['project_id'],
            'board_id' => $validated['board_id'],
            'assignee_id' => $validated['assignee_id'],
            'reporter_id' => auth()->id(),
            'position' => $maxPosition + 1,
        ]);

        return redirect()->back()
            ->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', TaskType::values()),
            'priority' => 'required|in:' . implode(',', TaskPriority::values()),
            'status' => 'required|in:' . implode(',', TaskStatus::values()),
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        $task->update($validated);

        return redirect()->back()
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Move task to different status/position.
     */
    public function move(Request $request, int $id): RedirectResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', TaskStatus::values()),
            'position' => 'required|integer|min:0',
        ]);

        $task->update([
            'status' => $validated['status'],
            'position' => $validated['position'],
        ]);

        return redirect()->back()
            ->with('success', 'Task moved successfully.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(int $id): RedirectResponse
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return redirect()->back()
            ->with('success', 'Task deleted successfully.');
    }
}
