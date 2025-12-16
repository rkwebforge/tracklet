<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Welcome page
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Authentication Routes are handled by Laravel Fortify
// See app/Providers/FortifyServiceProvider.php

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Organizations
    Route::prefix('organizations')->name('organizations.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Organization\OrganizationController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Organization\OrganizationController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Organization\OrganizationController::class, 'store'])->name('store');
        Route::get('/{organization}', [\App\Http\Controllers\Organization\OrganizationController::class, 'show'])->name('show');
        Route::get('/{organization}/edit', [\App\Http\Controllers\Organization\OrganizationController::class, 'edit'])->name('edit');
        Route::put('/{organization}', [\App\Http\Controllers\Organization\OrganizationController::class, 'update'])->name('update');
        Route::delete('/{organization}', [\App\Http\Controllers\Organization\OrganizationController::class, 'destroy'])->name('destroy');
        
        // Members
        Route::get('/{organization}/members', [\App\Http\Controllers\Organization\MemberController::class, 'index'])->name('members.index');
        Route::post('/{organization}/members', [\App\Http\Controllers\Organization\MemberController::class, 'store'])->name('members.store');
        Route::delete('/{organization}/members/{user}', [\App\Http\Controllers\Organization\MemberController::class, 'destroy'])->name('members.destroy');
    });

    // Projects
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Project\ProjectController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Project\ProjectController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Project\ProjectController::class, 'store'])->name('store');
        Route::get('/{project}', [\App\Http\Controllers\Project\ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [\App\Http\Controllers\Project\ProjectController::class, 'edit'])->name('edit');
        Route::put('/{project}', [\App\Http\Controllers\Project\ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [\App\Http\Controllers\Project\ProjectController::class, 'destroy'])->name('destroy');
    });

    // Boards
    Route::prefix('boards')->name('boards.')->group(function () {
        Route::get('/{board}', [\App\Http\Controllers\Board\BoardController::class, 'show'])->name('show');
        Route::get('/{board}/settings', [\App\Http\Controllers\Board\BoardController::class, 'settings'])->name('settings');
        Route::put('/{board}', [\App\Http\Controllers\Board\BoardController::class, 'update'])->name('update');
    });

    // Tasks
    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::post('/', [\App\Http\Controllers\Task\TaskController::class, 'store'])->name('store');
        Route::get('/{task}', [\App\Http\Controllers\Task\TaskController::class, 'show'])->name('show');
        Route::put('/{task}', [\App\Http\Controllers\Task\TaskController::class, 'update'])->name('update');
        Route::delete('/{task}', [\App\Http\Controllers\Task\TaskController::class, 'destroy'])->name('destroy');
        Route::post('/{task}/move', [\App\Http\Controllers\Task\TaskController::class, 'move'])->name('move');
        
        // Comments
        Route::post('/{task}/comments', [\App\Http\Controllers\Task\CommentController::class, 'store'])->name('comments.store');
        Route::delete('/comments/{comment}', [\App\Http\Controllers\Task\CommentController::class, 'destroy'])->name('comments.destroy');
    });
});
