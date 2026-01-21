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
use Domain\Task\Contracts\TaskServiceInterface;
use Domain\Task\DTOs\CreateTaskDTO;
use Domain\Task\DTOs\UpdateTaskDTO;
use Domain\Task\DTOs\MoveTaskDTO;
use Domain\Project\Models\Project;

class TaskController extends Controller
{
    public function __construct(
        private TaskServiceInterface $taskService
    ) {}

    /**
     * Display the specified task.
     */
    public function show(Task $task): Response
    {
        $this->authorize('view', $task);

        $task = $this->taskService->getWithDetails($task);

        return Inertia::render('Task/Show', [
            'task' => $task,
            'can' => [
                'update' => auth()->user()->can('update', $task),
                'delete' => auth()->user()->can('delete', $task),
                'comment' => auth()->user()->can('comment', $task),
                'assign' => auth()->user()->can('assign', $task),
            ],
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Task::class);

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

        // Verify user has access to the project
        $project = Project::findOrFail($validated['project_id']);
        $this->authorize('view', $project);

        $dto = CreateTaskDTO::fromArray($validated);
        $this->taskService->create($dto, auth()->user());

        return redirect()->back()
            ->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', TaskType::values()),
            'priority' => 'required|in:' . implode(',', TaskPriority::values()),
            'status' => 'required|in:' . implode(',', TaskStatus::values()),
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        $dto = UpdateTaskDTO::fromArray($validated);
        $this->taskService->update($task, $dto);

        return redirect()->back()
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Move task to different status/position.
     */
    public function move(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', TaskStatus::values()),
            'position' => 'required|integer|min:0',
        ]);

        $dto = MoveTaskDTO::fromArray($validated);
        $this->taskService->move($task, $dto);

        return redirect()->back()
            ->with('success', 'Task moved successfully.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $this->taskService->delete($task);

        return redirect()->back()
            ->with('success', 'Task deleted successfully.');
    }
}
