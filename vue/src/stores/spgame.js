import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useSpGameStore = defineStore('spgame', () => {
  const showModal = ref(false);
  const showNotEnoughCoinsModal = ref(false);
  const alertMessage = ref('');
  const showAlert = ref(false);
  const targetRoute = ref('');
  const canProceedToGame = ref(false);

  

  const handleGameModeClick = (route, isAuthenticated, userBalance) => {
    if (!isAuthenticated) {
      
      // User is not authenticated
      alertMessage.value = 'Alert! Please log in/Register to proceed.';
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 4000);
      return false;
    }
    targetRoute.value = route;
    

    if (userBalance < 1) {
      showNotEnoughCoinsModal.value = true;
    } else {
      showModal.value = true;
    }
    return true;
  };

  const useBrainCoin = async () => {
    try {
      const response = await axios.post('/deductbraincoins');
      if (response.status === 200) {
        canProceedToGame.value = true;
        return response.data.brain_coins_balance; // Return the updated balance
      }
    } catch (error) {
      alertMessage.value =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert.value = true;
      setTimeout(() => (showAlert.value = false), 4000);
      return null;
    }
  };

  const resetState = () => {
    showModal.value = false;
    showNotEnoughCoinsModal.value = false;
    alertMessage.value = '';
    showAlert.value = false;
    canProceedToGame.value = false;
  };
  

  const cancelGame = () => {
    showModal.value = false;
    showNotEnoughCoinsModal.value = false;
  };

  

  return {
    showModal,
    showNotEnoughCoinsModal,
    alertMessage,
    showAlert,
    targetRoute,
    canProceedToGame,
    handleGameModeClick,
    useBrainCoin,
    cancelGame,
    resetState,
  };
});
