<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg relative">
    <h2 class="text-2xl font-semibold mb-6 text-center">Purchase Brain Coins</h2>
    <form @submit.prevent="handlePurchase" class="space-y-6">
      <div>
        <label for="paymentType" class="block text-lg font-medium text-gray-700">Payment Method</label>
        <select v-model="purchaseStore.paymentType" id="paymentType" class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md">
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PAYPAL</option>
          <option value="IBAN">IBAN</option>
          <option value="MB">MB</option>
          <option value="VISA">VISA</option>
        </select>
      </div>
      <div>
        <label for="reference" class="block text-lg font-medium text-gray-700">Reference</label>
        <input v-model="purchaseStore.reference" type="text" id="reference" class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      </div>
      <div>
        <label for="value" class="block text-lg font-medium text-gray-700">Amount</label>
        <input v-model="purchaseStore.value" type="number" id="value" class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      </div>
      <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
        Purchase Brain Coins
      </button>
    </form>
    <p v-if="purchaseStore.errorMessage" class="mt-4 text-red-500 text-center">{{ purchaseStore.errorMessage }}</p>
    <p v-if="purchaseStore.successMessage" class="mt-4 text-green-500 text-center">{{ purchaseStore.successMessage }}</p>
  </div>
</template>

<script setup>
import { usePurchaseBrainCoinsStore } from '@/stores/purchaseBrainCoins';

const purchaseStore = usePurchaseBrainCoinsStore();

// Function to handle the purchaseaaa
const handlePurchase = () => {
  purchaseStore.purchaseBrainCoins();
};
</script>
