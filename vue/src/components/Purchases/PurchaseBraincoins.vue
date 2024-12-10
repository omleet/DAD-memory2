<template>
    <div class="purchase-container">
      <div class="balance-info">
        <h2 class="text-lg font-semibold">Current Brain Coins: {{ balance }}</h2>
        <p class="text-sm text-gray-500">1 EUR = 10 Brain Coins</p>
      </div>
  
      <div class="purchase-options">
        <label for="amount" class="block text-lg font-semibold">Amount to Purchase (in EUR)</label>
        <input
          v-model="amountInEuros"
          type="number"
          id="amount"
          class="border p-2 rounded-md w-full"
          min="1"
          :max="maxAmountInEuros"
          placeholder="Enter amount in EUR"
          required
        />
  
        <button
          @click="handlePurchase"
          class="mt-4 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
          :disabled="isProcessing || !amountInEuros || amountInEuros < 1"
        >
          {{ isProcessing ? 'Processing...' : 'Buy Brain Coins' }}
        </button>
      </div>
  
      <div v-if="showAlert" class="alert mt-4">
        <p :class="alertClass">{{ alertMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  //import { useRouter } from 'vue-router';
  
  const storeAuth = useAuthStore();
  //const router = useRouter();
  
  // States
  const amountInEuros = ref(1); // default amount in EUR to purchase
  const balance = ref(storeAuth.balance || 0);
  const isProcessing = ref(false);
  const showAlert = ref(false);
  const alertMessage = ref('');
  const alertClass = ref('text-green-500');
  
  // Maximum purchase amount in EUR (you can adjust this based on your needs)
  const maxAmountInEuros = 1000; // You can set a limit for the max number of coins that can be purchased
  
  // Handle purchase function
  const handlePurchase = async () => {
    if (isProcessing.value || !amountInEuros.value || amountInEuros.value < 1) return;
  
    isProcessing.value = true;
  
    const coinsToPurchase = amountInEuros.value * 10; // 1 EUR = 10 Brain Coins
    const transactionData = {
      userId: storeAuth.user.id,
      brainCoins: coinsToPurchase,
      type: 'purchase', // This can be used to identify the type of transaction
      amountInEuros: amountInEuros.value,
    };
  
    try {
      // Assuming you have an API to process the purchase
      const response = await fetch('/api/purchase-brain-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storeAuth.token}`,
        },
        body: JSON.stringify(transactionData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update user balance after successful purchase
        storeAuth.updateBalance(storeAuth.balance + coinsToPurchase);
        alertMessage.value = `Successfully purchased ${coinsToPurchase} Brain Coins!`;
        alertClass.value = 'text-green-500'; // success
      } else {
        alertMessage.value = `Failed to process the purchase: ${data.message}`;
        alertClass.value = 'text-red-500'; // error
      }
    } catch (error) {
      alertMessage.value = 'Error processing the transaction. Please try again later.';
      alertClass.value = 'text-red-500'; // error
    } finally {
      isProcessing.value = false;
      showAlert.value = true;
  
      setTimeout(() => {
        showAlert.value = false; // Hide the alert after a few seconds
      }, 4000);
    }
  };
  </script>
  
  <style scoped>
  .purchase-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .alert {
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .alert.success {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
  }
  
  .alert.error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
  }
  </style>
  