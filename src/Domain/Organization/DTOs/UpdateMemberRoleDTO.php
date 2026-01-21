<?php

namespace Domain\Organization\DTOs;

readonly class UpdateMemberRoleDTO
{
    public function __construct(
        public string $role,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            role: $data['role'],
        );
    }

    public function toArray(): array
    {
        return [
            'role' => $this->role,
        ];
    }
}
