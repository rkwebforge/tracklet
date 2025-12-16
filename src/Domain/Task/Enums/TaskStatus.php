<?php

namespace Domain\Task\Enums;

enum TaskStatus: string
{
    case BACKLOG = 'backlog';
    case TODO = 'todo';
    case IN_PROGRESS = 'in_progress';
    case IN_REVIEW = 'in_review';
    case DONE = 'done';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match($this) {
            self::BACKLOG => 'Backlog',
            self::TODO => 'To Do',
            self::IN_PROGRESS => 'In Progress',
            self::IN_REVIEW => 'In Review',
            self::DONE => 'Done',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::BACKLOG => 'gray',
            self::TODO => 'blue',
            self::IN_PROGRESS => 'yellow',
            self::IN_REVIEW => 'purple',
            self::DONE => 'green',
        };
    }
}
