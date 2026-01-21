<?php

namespace Domain\Task\DTOs;

readonly class CreateCommentDTO
{
    public function __construct(
        public string $content,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            content: $data['content'],
        );
    }

    public function toArray(): array
    {
        return [
            'content' => $this->content,
        ];
    }
}
