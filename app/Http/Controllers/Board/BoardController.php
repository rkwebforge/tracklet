<?php

namespace App\Http\Controllers\Board;

use App\Http\Controllers\Controller;
use Domain\Board\Models\Board;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoardController extends Controller
{
    /**
     * Display the board with its tasks.
     */
    public function show(Board $board)
    {
        $this->authorize('view', $board->project);

        $board->load([
            'tasks' => function ($query) {
                $query->with(['assignee', 'reporter'])
                    ->orderBy('position');
            }
        ]);

        return Inertia::render('Boards/Show', [
            'board' => $board,
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

        $board->update($validated);

        return back()->with('success', 'Board updated successfully.');
    }
}
