<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiplayerGame extends Model
{
    use HasFactory;

    protected $table = 'multiplayer_games_played';
    protected $fillable = ['user_id', 'game_id', 'player_won', 'pairs_discovered', 'custom'];
}
