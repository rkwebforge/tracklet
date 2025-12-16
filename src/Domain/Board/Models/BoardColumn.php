<?php

namespace Domain\Board\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoardColumn extends Model
{
    protected $fillable = [
        'board_id',
        'name',
        'color',
        'position',
        'wip_limit',
    ];

    protected $casts = [
        'position' => 'integer',
        'wip_limit' => 'integer',
    ];

    /**
     * Get the board this column belongs to.
     */
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * Get the tasks in this column.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(\Domain\Task\Models\Task::class)->orderBy('position');
    }

    /**
     * Check if column has reached WIP limit.
     */
    public function isAtWipLimit(): bool
    {
        if (!$this->wip_limit) {
            return false;
        }

        return $this->tasks()->count() >= $this->wip_limit;
    }
}
