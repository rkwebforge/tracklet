<?php

namespace Domain\Task\DTOs;

readonly class UpdateTaskDTO
{
    public function __construct(
        public string $title,
        public string $type,
        public string $priority,
        public string $status,
        public ?string $description = null,
        public ?int $assigneeId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'],
            type: $data['type'],
            priority: $data['priority'],
            status: $data['status'],
            description: $data['description'] ?? null,
            assigneeId: $data['assignee_id'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'type' => $this->type,
            'priority' => $this->priority,
            'status' => $this->status,
            'description' => $this->description,
            'assignee_id' => $this->assigneeId,
        ];
    }
}
