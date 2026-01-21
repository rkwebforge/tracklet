<?php

namespace Domain\Organization\Exceptions;

use Exception;

class MemberNotFoundException extends Exception
{
    public function __construct(string $message = 'User is not a member of this organization.')
    {
        parent::__construct($message);
    }
}
