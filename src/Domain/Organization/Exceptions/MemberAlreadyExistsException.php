<?php

namespace Domain\Organization\Exceptions;

use Exception;

class MemberAlreadyExistsException extends Exception
{
    public function __construct(string $message = 'User is already a member of this organization.')
    {
        parent::__construct($message);
    }
}
