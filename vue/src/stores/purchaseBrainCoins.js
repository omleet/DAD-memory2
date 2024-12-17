import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
import { ref } from 'vue';

export const usePurchaseBrainCoinsStore = defineStore('purchaseBrainCoins', () => {
  const paymentType = ref('MBWAY'); // Default value to avoid empty state issues
  const reference = ref('');
  const value = ref(1); // Default to avoid null issues
  const errorMessage = ref('');
  const successMessage = ref('');

  
  // Purchase Brain Coins
  const purchaseBrainCoins = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    const authStore = useAuthStore(); 
    const userType = authStore.userType;  // Access userType from the store instance

    // Check if the user is an admin (type 'A')
    if (userType === 'A') {
      errorMessage.value = 'Administrators cannot purchase coins.';
      console.log(userType); // This should now log correctly
      return;
    }

    if (!validateInput()) return;

    try {
      const response = await axios.post('/purchasebraincoins', {
        type: paymentType.value,
        reference: reference.value,
        value: value.value,
      });

      if (response.status === 200) {
        successMessage.value = response.data.message;
        const authStore = useAuthStore();
        authStore.updateBalance(response.data.brain_coins_balance);

        // Reset input fields after success
        paymentType.value = 'MBWAY';
        reference.value = '';
        value.value = 1;
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'An error occurred.';
    }
  };

  // Validate input
  const validateInput = () => {
    if (!value.value || value.value <= 0 || value.value > 99) {
      errorMessage.value = 'Value must be between 1 and 99.';
      return false;
    }

    if (!validateReference()) {
      return false;
    }

    return true;
  };

  // Validate reference
  const validateReference = () => {
    if (paymentType.value === 'MBWAY' && !/^9\d{8}$/.test(reference.value)) {
      errorMessage.value = 'Invalid MBWAY reference.';
      return false;
    }
    if (paymentType.value === 'PAYPAL' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(reference.value)) {
      errorMessage.value = 'Invalid PayPal email.';
      return false;
    }
    if (paymentType.value === 'IBAN' && !/^[A-Za-z]{2}\d{23}$/.test(reference.value)) {
      errorMessage.value = 'Invalid IBAN reference.';
      return false;
    }
    if (paymentType.value === 'MB' && !/^\d{5}-\d{9}$/.test(reference.value)) {
      errorMessage.value = 'Invalid MB reference.';
      return false;
    }
    if (paymentType.value === 'VISA' && !/^4\d{15}$/.test(reference.value)) {
      errorMessage.value = 'Invalid VISA reference.';
      return false;
    }

    return true;
  };

  return {
    paymentType,
    reference,
    value,
    errorMessage,
    successMessage,
    purchaseBrainCoins,
    validateInput,
    validateReference,
  };
});
