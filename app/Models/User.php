<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get organizations owned by this user.
     */
    public function ownedOrganizations(): HasMany
    {
        return $this->hasMany(\Domain\Organization\Models\Organization::class, 'owner_id');
    }

    /**
     * Get organization memberships.
     */
    public function organizationMemberships(): HasMany
    {
        return $this->hasMany(\Domain\Organization\Models\OrganizationMember::class);
    }

    /**
     * Get projects owned by this user.
     */
    public function ownedProjects(): HasMany
    {
        return $this->hasMany(\Domain\Project\Models\Project::class, 'owner_id');
    }

    /**
     * Get project memberships.
     */
    public function projectMemberships(): HasMany
    {
        return $this->hasMany(\Domain\Project\Models\ProjectMember::class);
    }

    /**
     * Get tasks assigned to this user.
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\Task::class, 'assignee_id');
    }

    /**
     * Get tasks reported by this user.
     */
    public function reportedTasks(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\Task::class, 'reporter_id');
    }

    /**
     * Get task comments by this user.
     */
    public function taskComments(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\TaskComment::class);
    }
}
