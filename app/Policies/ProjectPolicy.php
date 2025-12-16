<?php

namespace App\Policies;

use App\Models\User;
use Domain\Project\Models\Project;

class ProjectPolicy
{
    /**
     * Determine if the user can view the project.
     */
    public function view(User $user, Project $project): bool
    {
        return $project->hasMember($user) 
            || $project->owner_id === $user->id
            || $project->organization->hasMember($user);
    }

    /**
     * Determine if the user can create projects.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        $role = $project->getMemberRole($user);
        
        return $project->owner_id === $user->id 
            || $role === 'manager'
            || $project->organization->hasAdmin($user);
    }

    /**
     * Determine if the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        return $project->owner_id === $user->id 
            || $project->organization->hasAdmin($user);
    }

    /**
     * Determine if the user can manage project members.
     */
    public function manageMembers(User $user, Project $project): bool
    {
        $role = $project->getMemberRole($user);
        
        return $project->owner_id === $user->id 
            || $role === 'manager'
            || $project->organization->hasAdmin($user);
    }
}
