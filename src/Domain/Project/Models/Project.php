<?php

namespace Domain\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'key',
        'description',
        'organization_id',
        'owner_id',
        'status',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    /**
     * Get the organization this project belongs to.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(\Domain\Organization\Models\Organization::class);
    }

    /**
     * Get the owner of the project.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the members of the project.
     */
    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    /**
     * Get the boards for this project.
     */
    public function boards(): HasMany
    {
        return $this->hasMany(\Domain\Board\Models\Board::class);
    }

    /**
     * Get the tasks for this project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\Task::class);
    }

    /**
     * Check if user is a member of this project.
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Get user's role in this project.
     */
    public function getMemberRole(User $user): ?string
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->value('role');
    }
}
