<?php
namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Game;  // Assuming you have a Game model
use Illuminate\Support\Facades\Auth;

class GameHistoryController extends Controller
{
    /**
     * Retrieve authenticated user's game history.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function showGameHistory()
    {
        try {
            // Fetch games created by the authenticated user
            $games = Game::where('created_user_id', Auth::id()) // Use your column name for created user
                ->orderBy('ended_at', 'desc') // Order by the game start time
                ->paginate(10); // Pagination, can be adjusted

            return response()->json($games, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch game history.'], 500);
        }
    }
}
