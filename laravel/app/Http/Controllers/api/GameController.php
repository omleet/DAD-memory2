<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    /**
     * Store a finished single-player game.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeGame(Request $request)
    {
        // Validate incoming data
        $validatedData = $request->validate([
            'winner_user_id' => 'nullable|exists:users,id',
            'type' => 'required|in:S,M',
            'status' => 'required|in:E', // Only allow 'Ended' for now
            'began_at' => 'required|date',
            'ended_at' => 'required|date|after_or_equal:began_at',
            'total_time' => 'required|numeric|min:0',
            'board_id' => 'required|integer',
            'total_turns_winner' => 'nullable|integer|min:0',
            'custom' => 'nullable|json',
        ]);

        try {
            // Create the game entry
            $game = Game::create([
                'created_user_id' => Auth::id(), // Set to the authenticated user
                'winner_user_id' => $validatedData['winner_user_id'],
                'type' => $validatedData['type'],
                'status' => $validatedData['status'],
                'began_at' => $validatedData['began_at'],
                'ended_at' => $validatedData['ended_at'],
                'total_time' => $validatedData['total_time'],
                'board_id' => $validatedData['board_id'],
                'total_turns_winner' => $validatedData['total_turns_winner'],
                'custom' => $validatedData['custom'] ?? null,
            ]);

            return response()->json([
                'message' => 'Game stored successfully.',
                'game' => $game,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to store game data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
