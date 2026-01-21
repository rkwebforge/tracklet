<?php

namespace Domain\Organization\DTOs;

readonly class AddMemberDTO
{
    public function __construct(
        public string $email,
        public string $role,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            role: $data['role'],
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'role' => $this->role,
        ];
    }
}
