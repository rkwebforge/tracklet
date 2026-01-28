<?php

namespace Domain\Organization\DTOs;

readonly class CreateInvitationDTO
{
    public function __construct(
        public string $role,
        public ?int $expiresInDays = null,
        public ?int $maxUses = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            role: $data['role'],
            expiresInDays: $data['expires_in_days'] ?? null,
            maxUses: $data['max_uses'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'role' => $this->role,
            'expires_in_days' => $this->expiresInDays,
            'max_uses' => $this->maxUses,
        ];
    }
}
