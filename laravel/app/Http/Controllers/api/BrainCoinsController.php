<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class BrainCoinsController extends Controller
{
    /**
     * Handle the purchase of brain coins for a user.
     */
    public function purchaseBrainCoins(Request $request)
    {
        // Validate the input dynamically
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'reference' => ['required', 'string'],
            'value' => 'required|integer|min:1|max:99',
        ]);

        // Add conditional validation for the 'reference' field
        $validator->sometimes('reference', $this->getReferenceValidationRule($request->type), function ($input) {
            return isset($input->type);
        });

        // Check validation
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Retrieve the authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Process the purchase
        if ($this->processPurchase($user, $validated)) {
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
    public function deductBrainCoin()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($this->processDeduction($user)) {
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
        $response = Http::post('https://dad-202425-payments-api.vercel.app/api/debit', [
            'type' => $validated['type'],
            'reference' => $validated['reference'],
            'value' => $validated['value'],
        ]);

        if ($response->status() === 201) {
            $brainCoinsToAdd = $validated['value'] * 10; // Conversion rate: 1€ = 10 Brain Coins
            $user->brain_coins_balance += $brainCoinsToAdd;
            $user->save();

            // Record the transaction
            Transaction::create([
                'user_id' => $user->id,
                'brain_coins' => $brainCoinsToAdd,
                'euros' => $validated['value'],
                'type' => 'P', // 'P' for purchase
                'transaction_datetime' => now(),
                'payment_type' => $validated['type'],
                'payment_reference' => $validated['reference'],
            ]);

            return true;
        }

        return false;
    }

    /**
     * Process Brain Coin deduction.
     */
    private function processDeduction(User $user)
    {
        if ($user->brain_coins_balance < 1) {
            return false;
        }

        $user->brain_coins_balance -= 1;
        $user->save();

        Transaction::create([
            'user_id' => $user->id,
            'brain_coins' => -1, // Deduction is negative
            'euros' => null, // No euros involved
            'type' => 'I', // 'I' for internal transaction
            'transaction_datetime' => now(),
            'payment_type' => null,
            'payment_reference' => null,
        ]);

        return true;
    }

    /**
     * Generate a custom validation rule for payment reference based on the type.
     */
    private function getReferenceValidationRule($type)
    {
        switch ($type) {
            case 'MBWAY':
                return 'regex:/^9\d{8}$/';
            case 'PAYPAL':
                return 'email';
            case 'IBAN':
                return 'regex:/^[A-Za-z]{2}\d{23}$/';
            case 'MB':
                return 'regex:/^\d{5}-\d{9}$/';
            case 'VISA':
                return 'regex:/^4\d{15}$/';
            default:
                return 'string'; // Fallback rule
        }
    }
}
