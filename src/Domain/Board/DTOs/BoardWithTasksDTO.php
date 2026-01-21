<?php

namespace Domain\Board\DTOs;

use Domain\Board\Models\Board;
use Illuminate\Support\Collection;

readonly class BoardWithTasksDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public Collection $columns,
    ) {}

    public static function fromBoard(Board $board, array $statusColumns): self
    {
        $columns = collect($statusColumns)->map(function ($status) use ($board) {
            $tasks = $board->tasks->where('status', $status['id'])->values();
            return array_merge($status, ['tasks' => $tasks]);
        });

        return new self(
            id: $board->id,
            name: $board->name,
            columns: $columns,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'columns' => $this->columns,
        ];
    }
}
