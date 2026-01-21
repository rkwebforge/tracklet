<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Organization Domain
use Domain\Organization\Contracts\OrganizationServiceInterface;
use Domain\Organization\Contracts\MemberServiceInterface;
use Domain\Organization\Contracts\InvitationServiceInterface;
use Domain\Organization\Services\OrganizationService;
use Domain\Organization\Services\MemberService;
use Domain\Organization\Services\InvitationService;

// Project Domain
use Domain\Project\Contracts\ProjectServiceInterface;
use Domain\Project\Services\ProjectService;

// Board Domain
use Domain\Board\Contracts\BoardServiceInterface;
use Domain\Board\Services\BoardService;

// Task Domain
use Domain\Task\Contracts\TaskServiceInterface;
use Domain\Task\Contracts\CommentServiceInterface;
use Domain\Task\Services\TaskService;
use Domain\Task\Services\CommentService;

class DomainServiceProvider extends ServiceProvider
{
    /**
     * All service bindings.
     */
    public array $bindings = [
        // Organization Domain
        OrganizationServiceInterface::class => OrganizationService::class,
        MemberServiceInterface::class => MemberService::class,
        InvitationServiceInterface::class => InvitationService::class,

        // Board Domain (must be before Project since Project depends on it)
        BoardServiceInterface::class => BoardService::class,

        // Project Domain
        ProjectServiceInterface::class => ProjectService::class,

        // Task Domain
        TaskServiceInterface::class => TaskService::class,
        CommentServiceInterface::class => CommentService::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register all service bindings
        foreach ($this->bindings as $abstract => $concrete) {
            $this->app->bind($abstract, $concrete);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
