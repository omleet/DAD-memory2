<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <!-- Botão com a seta para voltar -->
    <button @click="router.push('/')"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
    <div class="max-w-2xl mx-auto py-8">
      <!-- Título Singleplayer -->
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Singleplayer Game</h2>

      <!-- Texto explicativo para o modo Singleplayer -->
      <div class="text-center mb-8">
        <p class="text-lg text-gray-700 font-medium">
          Welcome to the Singleplayer mode! Challenge yourself to beat your own memory records and improve your skills.
        </p>
      </div>

      <!-- Container para os Modos de Jogo -->
      <div class="text-center">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Game Modes</h3>

          <div class="space-x-4">
            <!-- Botão para o modo de jogo 4x3 -->
            <RouterLink class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
              to="/cardgame">
              Game 4x3
            </RouterLink>

            <!-- Botão para o modo de jogo 4x4 -->
            <button @click="handleGameModeClick('/cardgame4x4')"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
              Game 4x4
            </button>

            <!-- Botão para o modo de jogo 6x6 -->
            <button @click="handleGameModeClick('/cardgame6x6')"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
              Game 6x6
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Exibe o alerta -->
    <AlertMessage v-if="showAlert" :message="alertMessage" :duration="10000" />

    <!-- Modal for confirming Brain Coin deduction -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg mb-4">This game costs 1 BrainCoin. Do you want to continue?</p>
        <div class="flex justify-between">
          <!-- Cancel button -->
          <button @click="cancelGame"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <!-- Confirm button to use BrainCoin -->
          <button @click="checkBrainCoins"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Use 1 BrainCoin
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for insufficient BrainCoins -->
    <div v-if="showNotEnoughCoinsModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg mb-4">You don't have enough BrainCoins to start this game. Do you want to buy more?</p>
        <div class="flex justify-between">
          <!-- Cancel button -->
          <button @click="cancelGame"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <!-- Buy more button -->
          <button @click="redirectToPurchase"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Buy BrainCoins
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';

const authStore = useAuthStore();
const router = useRouter();
const showAlert = ref(false);
const alertMessage = ref('');
const showModal = ref(false);  // Modal for confirming BrainCoin deduction
const showNotEnoughCoinsModal = ref(false);  // Modal for insufficient BrainCoins
let targetRoute = '';

const handleGameModeClick = async (route) => {
  if (!authStore.user) {
    // Show login alert if user isn't authenticated
    showAlert.value = true;
    alertMessage.value = 'Alert! Please log in/Register to proceed.';
    setTimeout(() => (showAlert.value = false), 4000);
    return;
  }

  // Store the route to go to later
  targetRoute = route;

  // Show the confirmation modal
  showModal.value = true;
};

// This function will be called when the user clicks "Use 1 BrainCoin"
const checkBrainCoins = async () => {
  if (authStore.user.brain_coins_balance < 1) {
    // If the user doesn't have enough BrainCoins, show the "Not Enough Coins" modal
    showModal.value = false;  // Hide the first modal
    showNotEnoughCoinsModal.value = true;  // Show the second modal
  } else {
    // Proceed with the game deduction if enough coins
    useBrainCoinAndPlayGame();
  }
};

// This function will be called when the user confirms to use BrainCoin
const useBrainCoinAndPlayGame = async () => {
  try {
    // Deduct a Brain Coin before proceeding to the game
    const response = await axios.post('/deductbraincoins');

    if (response.status === 200) {
      // Update the user's balance in the store
      authStore.updateBalance(response.data.brain_coins_balance);

      // Redirect to the selected game mode
      router.push(targetRoute);

      // Hide the modal after successful deduction
      showModal.value = false;
    }
  } catch (error) {
    // Handle insufficient coins or other errors
    showAlert.value = true;
    alertMessage.value =
      error.response?.data?.message || 'An error occurred. Please try again.';
    setTimeout(() => (showAlert.value = false), 4000);
  }
};

// This function will be called when the user cancels
const cancelGame = () => {
  // Simply hide the modal without proceeding
  showModal.value = false;
  showNotEnoughCoinsModal.value = false;
};

// This function will redirect the user to the purchase page for BrainCoins
const redirectToPurchase = () => {
  router.push('/purchasebraincoins');
};
</script>