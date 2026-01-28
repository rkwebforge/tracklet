<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class OrganizationInvitation extends Model
{
    protected $fillable = [
        'organization_id',
        'invited_by',
        'token',
        'role',
        'max_uses',
        'uses_count',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'max_uses' => 'integer',
        'uses_count' => 'integer',
    ];

    /**
     * Generate a unique invitation token
     */
    public static function generateToken(): string
    {
        return Str::random(32);
    }

    /**
     * Check if invitation is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if invitation has reached max uses
     */
    public function isMaxUsesReached(): bool
    {
        return $this->max_uses && $this->uses_count >= $this->max_uses;
    }

    /**
     * Check if invitation is valid (not expired and not max uses reached)
     */
    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->isMaxUsesReached();
    }

    /**
     * Get the organization that the invitation belongs to
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user who sent the invitation
     */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}
