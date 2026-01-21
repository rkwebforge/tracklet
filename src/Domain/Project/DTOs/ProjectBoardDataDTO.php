<?php

namespace Domain\Project\DTOs;

use Domain\Project\Models\Project;
use Illuminate\Support\Collection;

readonly class ProjectBoardDataDTO
{
    public function __construct(
        public Project $project,
        public array $boardData,
        public Collection $members,
    ) {}

    public function toArray(): array
    {
        return [
            'project' => $this->project,
            'board' => $this->boardData,
            'users' => $this->members,
        ];
    }
}
