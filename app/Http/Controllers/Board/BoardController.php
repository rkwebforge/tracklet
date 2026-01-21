<?php

namespace App\Http\Controllers\Board;

use App\Http\Controllers\Controller;
use Domain\Board\Models\Board;
use Domain\Board\Contracts\BoardServiceInterface;
use Domain\Board\DTOs\UpdateBoardDTO;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    public function __construct(
        private BoardServiceInterface $boardService
    ) {}

    /**
     * Display the board with its tasks.
     */
    public function show(Board $board)
    {
        $this->authorize('view', $board->project);

        $boardWithTasks = $this->boardService->getBoardWithTasks($board);

        return Inertia::render('Boards/Show', [
            'board' => $boardWithTasks->toArray(),
            'project' => $board->project,
        ]);
    }

    /**
     * Show board settings.
     */
    public function settings(Board $board)
    {
        $this->authorize('update', $board->project);

        return Inertia::render('Boards/Settings', [
            'board' => $board,
            'project' => $board->project,
        ]);
    }

    /**
     * Update the board.
     */
    public function update(Request $request, Board $board)
    {
        $this->authorize('update', $board->project);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $dto = UpdateBoardDTO::fromArray($validated);
        $this->boardService->update($board, $dto);

        return back()->with('success', 'Board updated successfully.');
    }
}
