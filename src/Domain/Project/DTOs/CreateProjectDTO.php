<?php

namespace Domain\Project\DTOs;

readonly class CreateProjectDTO
{
    public function __construct(
        public string $name,
        public string $key,
        public int $organizationId,
        public ?string $description = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            key: strtoupper($data['key']),
            organizationId: $data['organization_id'],
            description: $data['description'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'key' => $this->key,
            'organization_id' => $this->organizationId,
            'description' => $this->description,
        ];
    }
}
