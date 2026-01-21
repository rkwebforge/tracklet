<?php

namespace Domain\Task\DTOs;

readonly class MoveTaskDTO
{
    public function __construct(
        public string $status,
        public int $position,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            status: $data['status'],
            position: $data['position'],
        );
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'position' => $this->position,
        ];
    }
}
