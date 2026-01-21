<?php

namespace Domain\Board\DTOs;

readonly class UpdateBoardDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $description = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'description' => $this->description,
        ], fn($value) => $value !== null);
    }
}
