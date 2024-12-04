<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Games extends Model
{
    protected $fillable = ['created_user_id', 'total_time', 'board_id', 'type', 'status', 'began_at', 'ended_at', 'custom', 'total_turns_winner'];
}
