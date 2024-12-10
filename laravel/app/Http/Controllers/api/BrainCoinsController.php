<?php
namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class BrainCoinsController extends Controller
{
    /**
     * Handle the purchase of brain coins for a user.
     */
    public function purchaseBrainCoins(Request $request)
    {
        // Validate the input (ensure amount is numeric and positive)
        $request->validate([
            'amount' => 'required|numeric|min:1', // Amount of money to spend (in euros)
        ]);

        // Calculate brain coins (1€ = 10 Brain Coins, as an example)
        $euros = $request->input('amount');
        $brainCoinsToAdd = $euros * 10;  // Conversion rate: 1€ = 10 Brain Coins

        // Get the currently authenticated user
        $user = Auth::user();

        // Add the brain coins to the user's balance
        $user->brain_coins_balance += $brainCoinsToAdd;

        // Create a transaction record for this purchase
        Transaction::create([
            'user_id' => $user->id,
            'brain_coins' => $brainCoinsToAdd,
            'type' => 'B', // Type 'B' for BrainCoins purchase
            'transaction_datetime' => now(),
        ]);

        // Return a success response with the updated balance
        return response()->json([
            'message' => 'Brain coins purchased successfully!',
            'new_balance' => $user->brain_coins_balance,
        ]);
    }
}
