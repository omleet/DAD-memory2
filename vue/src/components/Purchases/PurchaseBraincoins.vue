<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold mb-6 text-center">Purchase Brain Coins</h2>
    <form @submit.prevent="purchaseBrainCoins" class="space-y-6">
      <!-- Payment Method Dropdown -->
      <div>
        <label for="paymentType" class="block text-lg font-medium text-gray-700">Payment Method</label>
        <select v-model="paymentType" id="paymentType" class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PAYPAL</option>
          <option value="IBAN">IBAN</option>
          <option value="MB">MB</option>
          <option value="VISA">VISA</option>
        </select>
      </div>

      <!-- Reference Input -->
      <div>
        <label for="reference" class="block text-lg font-medium text-gray-700">Reference</label>
        <input v-model="reference" type="text" id="reference" required 
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Amount Input -->
      <div>
        <label for="value" class="block text-lg font-medium text-gray-700">Amount</label>
        <input v-model="value" type="number" id="value" required min="1" max="99" 
          class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Submit Button -->
      <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
        Purchase Brain Coins
      </button>
    </form>

    <!-- Error or Success Message -->
    <p v-show="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
    <p v-show="successMessage" class="mt-4 text-green-500 text-center">{{ successMessage }}</p>
  </div>
</template>

<script>

import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      paymentType: '',   // Ensure these are initialized
      reference: '',     // Same for reference
      value: null,       // Set value as null initially
      errorMessage: '',  // Initialize error message
      successMessage: '' // Initialize success message
    };
  },
  methods: {
    async purchaseBrainCoins() {
      try {
        // Reset messages before submitting
        this.errorMessage = '';
        this.successMessage = ''; // Reset success message

        // Validate data on frontend (you can also send this to the backend)
        if (!this.validateInput()) {
          return;
        }

        // Send request to the backend API
        const response = await axios.post('/purchasebraincoins', {
          type: this.paymentType,
          reference: this.reference,
          value: this.value
        });

        // Handle success response and show success message
        if (response.status === 200) {
          this.successMessage = response.data.message;
          console.log('Brain coins purchased successfully:', response.data);

          // Update the balance in the Pinia store (this should come from the response)
          const authStore = useAuthStore();
          authStore.updateBalance(response.data.brain_coins_balance); // Assuming the response contains the new balance

          // Optionally clear form or reset values
          this.paymentType = '';
          this.reference = '';
          this.value = null;
        }
      } catch (error) {
        // Handle error response
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'An error occurred.';
        } else {
          this.errorMessage = 'Unexpected error occurred.';
        }

        // Reset success message in case of failure
        this.successMessage = '';
      }
    },

    // Validate the form input
    validateInput() {
      if (this.value <= 0 || this.value > 99) {
        this.errorMessage = "Value must be between 1 and 99.";
        return false;
      }

      // Further validation for reference based on payment type
      if (!this.validateReference()) {
        return false;
      }

      return true;
    },

    // Validate the reference input based on the payment type
    validateReference() {
      if (this.paymentType === 'MBWAY' && !/^9\d{8}$/.test(this.reference)) {
        this.errorMessage = 'Invalid MBWAY reference.';
        return false;
      }

      if (this.paymentType === 'PAYPAL' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(this.reference)) {
        this.errorMessage = 'Invalid PayPal email.';
        return false;
      }

      if (this.paymentType === 'IBAN' && !/^[A-Za-z]{2}\d{23}$/.test(this.reference)) {
        this.errorMessage = 'Invalid IBAN reference.';
        return false;
      }

      if (this.paymentType === 'MB' && !/^\d{5}-\d{9}$/.test(this.reference)) {
        this.errorMessage = 'Invalid MB reference.';
        return false;
      }

      if (this.paymentType === 'VISA' && !/^4\d{15}$/.test(this.reference)) {
        this.errorMessage = 'Invalid VISA reference.';
        return false;
      }

      return true;
    }
  }
};
</script>
