<?php

namespace App\Policies;

use App\Models\User;
use Domain\Task\Models\Task;

class TaskPolicy
{
    /**
     * Determine if the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $task->project->hasMember($user) 
            || $task->project->organization->hasMember($user);
    }

    /**
     * Determine if the user can create tasks.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        return $task->isAssignedTo($user) 
            || $task->isReportedBy($user)
            || $task->project->getMemberRole($user) === 'manager'
            || $task->project->owner_id === $user->id;
    }

    /**
     * Determine if the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        return $task->isReportedBy($user)
            || $task->project->getMemberRole($user) === 'manager'
            || $task->project->owner_id === $user->id;
    }

    /**
     * Determine if the user can assign the task.
     */
    public function assign(User $user, Task $task): bool
    {
        return $task->project->hasMember($user);
    }

    /**
     * Determine if the user can comment on the task.
     */
    public function comment(User $user, Task $task): bool
    {
        return $task->project->hasMember($user) 
            || $task->project->organization->hasMember($user);
    }
}
