<?php

namespace Domain\Organization\Enums;

enum MemberRole: string
{
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case MEMBER = 'member';

    /**
     * Get all role values.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get human-readable label.
     */
    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::MANAGER => 'Manager',
            self::MEMBER => 'Member',
        };
    }

    /**
     * Check if role has admin privileges.
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role can manage projects.
     */
    public function canManageProjects(): bool
    {
        return in_array($this, [self::ADMIN, self::MANAGER]);
    }
}
