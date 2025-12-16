<?php

namespace Domain\Task\Enums;

enum TaskType: string
{
    case STORY = 'story';
    case TASK = 'task';
    case BUG = 'bug';
    case EPIC = 'epic';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match($this) {
            self::STORY => 'User Story',
            self::TASK => 'Task',
            self::BUG => 'Bug',
            self::EPIC => 'Epic',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::STORY => '📖',
            self::TASK => '✓',
            self::BUG => '🐛',
            self::EPIC => '🎯',
        };
    }
}
