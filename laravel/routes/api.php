<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaderBoardsController;


Route::get('/users/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/login', [AuthController::class, "login"]);

Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);;
Route::middleware(['auth:sanctum'])->get('/user-profile', [AuthController::class, 'userProfile']);

Route::get('/leaderboard-by-board', [LeaderBoardsController::class, 'leaderboardByBoard']);
Route::get('/leaderboard-by-moves', [LeaderBoardsController::class, 'leaderboardByMoves']);
Route::get('/leaderboard-multiplayer-mostgames', [LeaderBoardsController::class, 'mostgames']);
Route::get('/leaderboard-multiplayer-mostgames-won', [LeaderBoardsController::class, 'mostgamesWon']);
Route::get('/leaderboard-multiplayer-efficient-players', [LeaderBoardsController::class, 'mostEfficientPlayers']);
