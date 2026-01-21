<?php

namespace Domain\Organization\DTOs;

readonly class CreateOrganizationDTO
{
    public function __construct(
        public string $name,
        public string $slug,
        public ?string $description = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            slug: $data['slug'],
            description: $data['description'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
        ];
    }
}
