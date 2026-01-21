<?php

namespace Domain\Organization\Exceptions;

use Exception;

class CannotModifyOwnerException extends Exception
{
    public function __construct(string $message = 'Cannot modify the organization owner.')
    {
        parent::__construct($message);
    }
}
