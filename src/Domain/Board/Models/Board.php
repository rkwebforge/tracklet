<?php

namespace Domain\Board\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'project_id',
        'type',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    /**
     * Get the project this board belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(\Domain\Project\Models\Project::class);
    }

    /**
     * Get the columns for this board.
     */
    public function columns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    /**
     * Get the tasks for this board.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\Task::class);
    }
}
