<?php

namespace Domain\Task\DTOs;

readonly class CreateTaskDTO
{
    public function __construct(
        public string $title,
        public string $type,
        public string $priority,
        public string $status,
        public int $projectId,
        public int $boardId,
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
            projectId: $data['project_id'],
            boardId: $data['board_id'],
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
            'project_id' => $this->projectId,
            'board_id' => $this->boardId,
            'description' => $this->description,
            'assignee_id' => $this->assigneeId,
        ];
    }
}
