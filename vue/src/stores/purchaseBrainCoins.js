import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const usePurchaseBrainCoinsStore = defineStore('purchaseBrainCoins', {
  state: () => ({
    paymentType: 'MBWAY', // Default value to avoid empty state issues
    reference: '',
    value: 1, // Default to avoid null issues
    errorMessage: '',
    successMessage: '',
  }),

  actions: {
    async purchaseBrainCoins() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.validateInput()) return;

      try {
        const response = await axios.post('/purchasebraincoins', {
          type: this.paymentType,
          reference: this.reference,
          value: this.value,
        });

        if (response.status === 200) {
          this.successMessage = response.data.message;
          const authStore = useAuthStore();
          authStore.updateBalance(response.data.brain_coins_balance);

          // Reset input fields after success
          this.paymentType = 'MBWAY';
          this.reference = '';
          this.value = 1;
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred.';
      }
    },

    validateInput() {
      if (!this.value || this.value <= 0 || this.value > 99) {
        this.errorMessage = 'Value must be between 1 and 99.';
        return false;
      }

      if (!this.validateReference()) {
        return false;
      }

      return true;
    },

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
});
