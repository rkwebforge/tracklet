<?php

namespace Domain\Task\Models;

use Domain\Task\Enums\TaskPriority;
use Domain\Task\Enums\TaskStatus;
use Domain\Task\Enums\TaskType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'board_id',
        'board_column_id',
        'assignee_id',
        'reporter_id',
        'type',
        'status',
        'priority',
        'estimate',
        'position',
        'due_date',
    ];

    protected $casts = [
        'type' => TaskType::class,
        'status' => TaskStatus::class,
        'priority' => TaskPriority::class,
        'due_date' => 'datetime',
        'estimate' => 'integer',
        'position' => 'integer',
    ];

    /**
     * Get the project this task belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(\Domain\Project\Models\Project::class);
    }

    /**
     * Get the board this task belongs to.
     */
    public function board(): BelongsTo
    {
        return $this->belongsTo(\Domain\Board\Models\Board::class);
    }

    /**
     * Get the board column this task is in.
     */
    public function boardColumn(): BelongsTo
    {
        return $this->belongsTo(\Domain\Board\Models\BoardColumn::class);
    }

    /**
     * Get the user assigned to this task.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    /**
     * Get the user who reported this task.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get all comments for this task.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    /**
     * Get all attachments for this task.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    /**
     * Check if task is assigned to a specific user.
     */
    public function isAssignedTo(User $user): bool
    {
        return $this->assignee_id === $user->id;
    }

    /**
     * Check if task was reported by a specific user.
     */
    public function isReportedBy(User $user): bool
    {
        return $this->reporter_id === $user->id;
    }
}
