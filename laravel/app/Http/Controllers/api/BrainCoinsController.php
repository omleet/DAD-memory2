<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;
use App\Models\User;

class BrainCoinsController extends Controller
{
    /**
     * Handle the purchase of brain coins for a user.
     */
    public function purchaseBrainCoins(Request $request)
    {
        // Validate the input (ensure type, reference, and value are correct)
        $validated = $request->validate([
            'type' => 'required|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'reference' => 'required|string',
            'value' => 'required|integer|min:1|max:99',
        ]);

        // Perform reference validation according to the payment type
        $validationErrors = $this->validateReference($validated['type'], $validated['reference']);
        if ($validationErrors) {
            return response()->json(['message' => $validationErrors], 422);
        }

        // Retrieve the authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Process the purchase and update the user's coins
        $success = $this->processPurchase($user, $validated);
        if ($success) {
            return response()->json([
                'message' => 'Brain coins purchased successfully!',
                'brain_coins_balance' => $user->brain_coins_balance,
            ]);
        }

        return response()->json(['message' => 'Payment failed. Please try again.'], 422);
    }

    /**
     * Handle Brain Coin deduction.
     */
    public function deductBrainCoin(Request $request)
    {
        // Retrieve the authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Deduct a coin from the user's balance
        $success = $this->processDeduction($user);
        if ($success) {
            return response()->json([
                'message' => 'Brain Coin deducted successfully!',
                'brain_coins_balance' => $user->brain_coins_balance,
            ]);
        }

        return response()->json(['message' => 'Not enough Brain Coins.'], 422);
    }

    /**
     * Process Brain Coin purchase and update the balance.
     */
    private function processPurchase(User $user, $validated)
    {
        // Prepare the payload for the external API request
        $payload = [
            'type' => $validated['type'],
            'reference' => $validated['reference'],
            'value' => $validated['value'],
        ];

        // Make the API request to the external payment service
        $response = Http::post('https://dad-202425-payments-api.vercel.app/api/debit', $payload);

        if ($response->status() == 201) {
            $brainCoinsToAdd = $validated['value'] * 10; // Conversion rate: 1€ = 10 Brain Coins
            $user->brain_coins_balance += $brainCoinsToAdd;
            $user->save();

            // Create a transaction record for this purchase
            Transaction::create([
                'user_id' => $user->id,
                'brain_coins' => $brainCoinsToAdd,
                'euros' => $validated['value'],
                'type' => 'P', // P for purchase
                'transaction_datetime' => now(),
                'payment_type' => $validated['type'],
                'payment_reference' => $validated['reference'],
            ]);

            return true; // Successfully processed
        }

        return false; // Payment failed
    }

    /**
     * Process Brain Coin deduction.
     */
    private function processDeduction(User $user)
    {
        // Check if the user has enough Brain Coins
        if ($user->brain_coins_balance < 1) {
            return false; // Not enough coins to deduct
        }

        // Deduct 1 Brain Coin from the user's balance
        $user->brain_coins_balance -= 1;
        $user->save();

        // Create a transaction record for this deduction
        Transaction::create([
            'user_id' => $user->id,
            'brain_coins' => -1, // Negative to represent a deduction
            'euros' => null, // No euros involved
            'type' => 'I', // I for internal transaction (e.g., for games)
            'transaction_datetime' => now(),
            'payment_type' => null, // Not applicable for internal spending
            'payment_reference' => null, // Placeholder
        ]);

        return true; // Successfully deducted
    }

    /**
     * Reference validation based on payment type.
     */
    protected function validateReference($type, $reference)
    {
        // Validation logic based on payment type
        if ($type === 'MBWAY' && !preg_match('/^9\d{8}$/', $reference)) {
            return 'Invalid MBWAY reference.';
        }
        if ($type === 'PAYPAL' && !filter_var($reference, FILTER_VALIDATE_EMAIL)) {
            return 'Invalid PayPal reference.';
        }
        if ($type === 'IBAN' && !preg_match('/^[A-Za-z]{2}\d{23}$/', $reference)) {
            return 'Invalid IBAN reference.';
        }
        if ($type === 'MB' && !preg_match('/^\d{5}-\d{9}$/', $reference)) {
            return 'Invalid MB reference.';
        }
        if ($type === 'VISA' && !preg_match('/^4\d{15}$/', $reference)) {
            return 'Invalid VISA reference.';
        }

        return null; // Valid reference
    }
}

