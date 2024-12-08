<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MultiplayerGame extends Model
{
    use HasFactory;

    protected $table = 'multiplayer_games_played';
    protected $fillable = ['user_id', 'game_id', 'player_won', 'pairs_discovered', 'custom'];

    public $timestamps = false;

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game() : BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
