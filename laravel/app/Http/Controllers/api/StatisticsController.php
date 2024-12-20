<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Game;
use App\Models\Board;
use App\Models\Transaction;
use App\Models\MultiplayerGame;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function GeneralStatistics()
    {
        // Parâmetro comum para status 'E' (finalizado)
        $status = 'E';

        // Contagem total de jogos
        $gamesRegistered = Game::count();

        // Contagem de jogos jogados (finalizados)
        $gamesPlayed = Game::where('status', $status)->count();

        // Contagem de jogos singleplayer jogados
        $singleplayerGamesPlayed = Game::where('type', 'S')->where('status', $status)->count();

        // Contagem de jogos multiplayer jogados
        $multiplayerGamesPlayed = Game::where('type', 'M')->where('status', $status)->count();

        // Contagem de usuários
        $users = User::count();

        // Contagem de quadros (boards)
        $boards = Board::count();

        // Contagem de transações
        $transactions = Transaction::count();

        // Jogos por semana (finalizados)
        $gamesPerWeek = DB::table('games')
            ->selectRaw("YEAR(created_at) as year, WEEK(created_at) as week, COUNT(*) as total_games")
            ->where('status', $status)
            ->groupByRaw("YEAR(created_at), WEEK(created_at)")
            ->orderByRaw("YEAR(created_at) ASC, WEEK(created_at) ASC")
            ->get();

        $gamesPerMonth = DB::table('games')
            ->selectRaw("YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total_games")
            ->where('status', $status)
            ->groupByRaw("YEAR(created_at), MONTH(created_at)")
            ->orderByRaw("YEAR(created_at) ASC, MONTH(created_at) ASC")
            ->get();

        // Preparar os dados para resposta
        $stats = [
            'games_registered' => $gamesRegistered,
            'games_played' => $gamesPlayed,
            'singleplayer_games_played' => $singleplayerGamesPlayed,
            'multiplayer_games_played' => $multiplayerGamesPlayed,
            'users' => $users,
            'boards' => $boards,
            'transactions' => $transactions,
            'games_per_week' => $gamesPerWeek,
            'games_per_month' => $gamesPerMonth,
        ];

        return response()->json($stats);
    }

    public function myStatistics(Request $request)
    {
        $userId = $request->user()->id;

        // Obter transações do usuário de uma vez
        $transactionsQuery = Transaction::where('user_id', $userId);

        // Estatísticas gerais
        $stats = [
            'singleplayer_games_played' => Game::where('type', 'S')
                ->where('status', 'E')
                ->where('created_user_id', $userId)
                ->count(),

            // Usar um Join para multiplayer games ao invés de pluck e count
            'multiplayer_games_played' => MultiplayerGame::where('user_id', $userId)
                ->count(),

            'transactions' => $transactionsQuery->count(),

            'coins_balance' => $request->user()->brain_coins_balance,

            'total_spent' => $transactionsQuery->where('type', 'P')->sum('euros'),

            // Consultas para wins e losses por mês combinadas em uma única query
            'wins_losses_per_month' => DB::table('games')
                ->selectRaw("YEAR(created_at) as year, MONTH(created_at) as month, 
                         SUM(CASE WHEN winner_user_id = ? THEN 1 ELSE 0 END) as total_wins, 
                         SUM(CASE WHEN winner_user_id != ? AND type = 'M' THEN 1 ELSE 0 END) as total_losses", [$userId, $userId])
                ->where('status', 'E') // Apenas jogos finalizados
                ->whereIn('id', MultiplayerGame::where('user_id', $userId)->pluck('game_id'))
                ->groupByRaw("YEAR(created_at), MONTH(created_at)")
                ->orderByRaw("YEAR(created_at) ASC, MONTH(created_at) ASC")
                ->get(),

            // Consultas para wins e losses por semana
            'wins_losses_per_week' => DB::table('games')
                ->selectRaw("YEAR(created_at) as year, WEEK(created_at) as week, 
                     SUM(CASE WHEN winner_user_id = ? THEN 1 ELSE 0 END) as total_wins, 
                     SUM(CASE WHEN winner_user_id != ? AND type = 'M' THEN 1 ELSE 0 END) as total_losses", [$userId, $userId])
                ->where('status', 'E') // Apenas jogos finalizados
                ->whereIn('id', MultiplayerGame::where('user_id', $userId)->pluck('game_id'))
                ->groupByRaw("YEAR(created_at), WEEK(created_at)")
                ->orderByRaw("YEAR(created_at) ASC, WEEK(created_at) ASC")
                ->get(),


        ];

        return response()->json($stats);
    }

    public function adminStatistics(Request $request)
    {
        // Usando join para calcular o total de euros gastos por usuário e trazer o usuário com a transação
        $userSpentMost = DB::table('transactions')
            ->select('user_id', DB::raw('SUM(euros) as total_euros_spent'))
            ->where('type', 'P') // Purchases
            ->groupBy('user_id')
            ->orderByDesc('total_euros_spent')
            ->first();

        // Calculando as estatísticas de uma vez, com algumas subconsultas agrupadas
        $totalRevenue = Transaction::where('type', 'P')->sum('euros');
        $revenueByMonth = DB::table('transactions')
            ->selectRaw("YEAR(transaction_datetime) as year, MONTH(transaction_datetime) as month, SUM(euros) as total_revenue")
            ->where('type', 'P')
            ->groupByRaw("YEAR(transaction_datetime), MONTH(transaction_datetime)")
            ->orderByRaw("YEAR(transaction_datetime) ASC, MONTH(transaction_datetime) ASC")
            ->get();

        $revenueByYear = DB::table('transactions')
            ->selectRaw("YEAR(transaction_datetime) as year, SUM(euros) as total_revenue")
            ->where('type', 'P') // Considerando apenas transações de tipo 'P' (Purchases)
            ->groupByRaw("YEAR(transaction_datetime)") // Agrupando apenas pelo ano
            ->orderByRaw("YEAR(transaction_datetime) ASC") // Ordenando por ano
            ->get();

        $transactionsPerMonth = DB::table('transactions')
            ->selectRaw("YEAR(transaction_datetime) as year, MONTH(transaction_datetime) as month, COUNT(*) as total_transactions")
            ->groupByRaw("YEAR(transaction_datetime), MONTH(transaction_datetime)")
            ->orderByRaw("YEAR(transaction_datetime) ASC, MONTH(transaction_datetime) ASC")
            ->get();

        // Carregar usuário que mais gastou com o relacionamento "user" e total de euros gastos
        //$userMostMoneySpent = User::where('id', $userSpentMost->user_id)->first();
        $userMostMoneySpent = DB::table('users')->select('nickname')->where('id', $userSpentMost->user_id)->first();

        // Preparando a resposta
        $stats = [
            'total_revenue' => $totalRevenue,
            'user_most_money_spent' => [
                'user' => $userMostMoneySpent,
                'total_euros_spent' => $userSpentMost->total_euros_spent
            ],
            'revenue_per_month' => $revenueByMonth,
            'revenue_per_year' => $revenueByYear,
            'total_blocks' => User::where('blocked', 1)->count(),
            'transactions_per_month' => $transactionsPerMonth,
            'average_euros_per_transaction' => Transaction::where('type', 'P')->avg('euros'),
        ];

        return response()->json($stats);
    }
}
