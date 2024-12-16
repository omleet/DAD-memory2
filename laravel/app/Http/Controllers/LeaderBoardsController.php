<?php

namespace App\Http\Controllers;

use App\Models\MultiplayerGame;
use App\Models\Games;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class LeaderBoardsController extends Controller
{
    public function leaderboardByBoard()
    {
        $leaderboards = [];

        $boards = [
            1 => '3x4',
            2 => '4x4',
            3 => '6x6'
        ];

        foreach ($boards as $boardId => $boardName) {
            $leaderboards[$boardName] = DB::table('games')
                ->join('users', 'games.created_user_id', '=', 'users.id')
                ->select('users.nickname', 'games.total_time', 'games.board_id')
                ->where('games.board_id', $boardId)
                ->whereNotNull('games.total_time')
                ->orderBy('games.total_time', 'asc')
                ->limit(10)
                ->get();
        }

        return response()->json($leaderboards);
    }

    public function leaderboardByMoves()
    {
        $leaderboards = [];

        // Definir os tipos de tabuleiros
        $boards = [
            1 => '3x4',
            2 => '4x4',
            3 => '6x6'
        ];

        // Loop para cada tipo de tabuleiro
        foreach ($boards as $boardId => $boardName) {
            $leaderboards[$boardName] = DB::table('games')
                ->join('users', 'games.created_user_id', '=', 'users.id')
                ->select('users.nickname', 'games.total_turns_winner', 'games.board_id')
                ->where('games.board_id', $boardId)
                ->whereNotNull('games.total_turns_winner') // Certificar que o número de jogadas não é nulo
                ->orderBy('games.total_turns_winner', 'asc') // Ordenar pelo menor número de jogadas
                ->limit(10) // Limitar os 10 melhores jogadores
                ->get();
        }

        return response()->json($leaderboards);
    }


    public function mostgames()
    {
        // Realiza a consulta com JOIN na tabela 'users' para pegar o 'nickname'
        $mostgames = DB::table('multiplayer_games_played')
            ->select('users.nickname', DB::raw('COUNT(*) as games_played'))
            ->join('users', 'multiplayer_games_played.user_id', '=', 'users.id') // Realiza a junção correta
            ->groupBy('users.nickname') // Agrupa pelo 'nickname'
            ->orderByDesc('games_played') // Ordena pela quantidade de jogos jogados
            ->take(10) // Limita aos 10 primeiros jogadores
            ->get();

        return response()->json($mostgames);
    }

    public function mostgamesWon()
    {
        // Realiza a consulta com JOIN na tabela 'users' para pegar o 'nickname' e somar as vitórias
        $mostgamesWon = DB::table('multiplayer_games_played')
            ->select('users.nickname', DB::raw('SUM(player_won) as games_won')) // Soma os valores de 'player_won' (1 para vitória)
            ->join('users', 'multiplayer_games_played.user_id', '=', 'users.id') // Junção com a tabela 'users'
            ->groupBy('users.nickname') // Agrupa pelo 'nickname'
            ->orderByDesc('games_won') // Ordena pela quantidade de vitórias
            ->take(10) // Limita aos 10 primeiros jogadores
            ->get();

        return response()->json($mostgamesWon);
    }

    public function mostEfficientPlayers()
    {
        $mostEfficientPlayers = DB::table('multiplayer_games_played')
            ->select('users.nickname', DB::raw('SUM(player_won) as games_won'), DB::raw('SUM(pairs_discovered) as total_pairs_discovered'))
            ->join('users', 'multiplayer_games_played.user_id', '=', 'users.id')
            ->where('player_won', 1) // Filtra para apenas considerar jogos ganhos
            ->groupBy('users.nickname')
            ->orderBy('total_pairs_discovered') // Ordena pelo menor número de pares descobertos
            ->take(10) // Limita aos 10 primeiros
            ->get();

        return response()->json($mostEfficientPlayers);
    }

   
}
