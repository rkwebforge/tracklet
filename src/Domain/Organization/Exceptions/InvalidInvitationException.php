<?php

namespace Domain\Organization\Exceptions;

use Exception;

class InvalidInvitationException extends Exception
{
    public function __construct(string $message = 'This invitation is no longer valid.')
    {
        parent::__construct($message);
    }
}
