<?php

namespace Domain\Project\DTOs;

readonly class UpdateProjectDTO
{
    public function __construct(
        public string $name,
        public string $status,
        public ?string $description = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            status: $data['status'],
            description: $data['description'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'status' => $this->status,
            'description' => $this->description,
        ];
    }
}
