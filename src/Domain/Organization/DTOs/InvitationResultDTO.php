<?php

namespace Domain\Organization\DTOs;

use App\Models\OrganizationInvitation;

readonly class InvitationResultDTO
{
    public function __construct(
        public OrganizationInvitation $invitation,
        public string $invitationUrl,
        public bool $success,
        public ?string $error = null,
    ) {}

    public static function success(OrganizationInvitation $invitation, string $url): self
    {
        return new self(
            invitation: $invitation,
            invitationUrl: $url,
            success: true,
        );
    }

    public static function failure(string $error): self
    {
        return new self(
            invitation: new OrganizationInvitation(),
            invitationUrl: '',
            success: false,
            error: $error,
        );
    }
}
