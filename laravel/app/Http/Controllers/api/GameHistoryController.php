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
            // Fetch games created by the authenticated user with board and winner's user data
            $games = Game::with(['board', 'winner'])  // Eager load board and winner's user
                ->where('created_user_id', Auth::id()) // Use your column name for created user
                ->orderBy('ended_at', 'desc') // Order by the game end time
                ->paginate(10); // Pagination, can be adjusted

            // Map through games to format board size and winner's nickname
            $games->getCollection()->transform(function ($game) {
                // Format the board size
                $game->board_size = $game->board ? "{$game->board->board_cols}x{$game->board->board_rows}" : null;

                // Add the winner's nickname
                $game->winner_nickname = $game->winner ? $game->winner->nickname : null;

                return $game;
            });

            return response()->json($games, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch game history.'], 500);
        }
    }
}
