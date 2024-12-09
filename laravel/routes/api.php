<?php

use App\Http\Controllers\api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaderBoardsController;
use App\Http\Controllers\api\UserController;


//Auth API
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/users/me', [UserController::class, 'userProfile']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::post('/auth/validatepassword', [AuthController::class, 'validatepassword']);

});
Route::post('/auth/login', [AuthController::class, "login"]);



//Public Leaderboards
Route::get('/leaderboard-by-board', [LeaderBoardsController::class, 'leaderboardByBoard']);
Route::get('/leaderboard-by-moves', [LeaderBoardsController::class, 'leaderboardByMoves']);
Route::get('/leaderboard-multiplayer-mostgames', [LeaderBoardsController::class, 'mostgames']);
Route::get('/leaderboard-multiplayer-mostgames-won', [LeaderBoardsController::class, 'mostgamesWon']);
Route::get('/leaderboard-multiplayer-efficient-players', [LeaderBoardsController::class, 'mostEfficientPlayers']);



//Users
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'delete']);
Route::post('/users', [UserController::class, 'register']);