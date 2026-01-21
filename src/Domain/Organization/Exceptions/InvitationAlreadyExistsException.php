<?php

namespace Domain\Organization\Exceptions;

use Exception;

class InvitationAlreadyExistsException extends Exception
{
    public function __construct(string $message = 'An invitation has already been sent to this email.')
    {
        parent::__construct($message);
    }
}
