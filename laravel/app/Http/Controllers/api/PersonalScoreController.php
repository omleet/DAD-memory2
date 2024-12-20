<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Board;
use Illuminate\Support\Facades\Auth;

class PersonalScoreController extends Controller
{
    /**
     * Get the score statistics for different board sizes
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getScoreboard()
    {
        try {
            // Retrieve the score statistics for each board size
            $board3x4 = $this->getBoardStats(3, 4);
            $board4x4 = $this->getBoardStats(4, 4);
            $board6x6 = $this->getBoardStats(6, 6);

            // Return the results as JSON
            return response()->json([
                '3x4' => $board3x4,
                '4x4' => $board4x4,
                '6x6' => $board6x6,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch score data.'], 500);
        }
    }

    /**
     * Get the score statistics for a given board size
     *
     * @param int $cols
     * @param int $rows
     * @return array
     */
    private function getBoardStats($cols, $rows)
    {
        // Find the board by its dimensions
        $board = Board::where('board_cols', $cols)
                      ->where('board_rows', $rows)
                      ->first();

        if (!$board) {
            return [
                'singleplayer' => [
                    'shortestTime' => '-',
                    'fewestMoves' => '-',
                    'totalGames' => 0,
                ],
                'multiplayer' => [
                    'shortestTime' => '-',
                    'fewestMoves' => '-',
                    'totalWins' => 0,
                    'totalLosses' => 0,
                    'totalGames' => 0,
                ],
            ];
        }

        // Retrieve games associated with this board for the authenticated user
        $games = Game::where('board_id', $board->id)
            ->where('created_user_id', Auth::id())
            ->where('status', 'E') // Ensure game is ended
            ->get();

        // Singleplayer games (Type 'S')
        $singleplayerGames = $games->where('type', 'S');
        $singleplayerStats = [
            'shortestTime' => $singleplayerGames->isEmpty() ? '-' : $singleplayerGames->min('total_time'),
            'fewestMoves' => $singleplayerGames->isEmpty() ? '-' : $singleplayerGames->min('total_turns_winner'),
            'totalGames' => $singleplayerGames->count(),
        ];

        // Multiplayer games (Type 'M')
        $multiplayerGames = $games->where('type', 'M');
        $totalWins = $multiplayerGames->where('winner_user_id', Auth::id())->count();
        $totalLosses = $multiplayerGames->count() - $totalWins;
        $multiplayerStats = [
            'shortestTime' => $multiplayerGames->isEmpty() ? '-' : $multiplayerGames->min('total_time'),
            'fewestMoves' => $multiplayerGames->isEmpty() ? '-' : $multiplayerGames->min('total_turns_winner'),
            'totalWins' => $totalWins,
            'totalLosses' => $totalLosses,
            'totalGames' => $multiplayerGames->count(),
        ];

        return [
            'singleplayer' => $singleplayerStats,
            'multiplayer' => $multiplayerStats,
        ];
    }
}
