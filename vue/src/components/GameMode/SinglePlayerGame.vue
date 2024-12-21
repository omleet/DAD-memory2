<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <!-- Back button -->
    <button @click="router.push('/')"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>

    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Singleplayer Game</h2>
      <div class="text-center mb-8">
        <p class="text-lg text-gray-700 font-medium">
          Welcome to the Singleplayer mode! Challenge yourself to beat your own memory records and improve your skills.
        </p>
      </div>

      <div class="text-center">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Game Modes</h3>
          <div class="space-x-4">
            <RouterLink class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
              to="/cardgame">
              Game 4x3
            </RouterLink>
            <button @click="handleGameModeClick('cardgame4x4')"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
              Game 4x4
            </button>
            <button @click="handleGameModeClick('cardgame6x6')"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
              Game 6x6
            </button>
          </div>
        </div>
      </div>
    </div>

    <AlertMessage v-if="spGameStore.showAlert" :message="spGameStore.alertMessage" :duration="10000" />

    <!-- Coin deduction modal -->
    <div v-if="spGameStore.showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg mb-4">This game costs 1 BrainCoin. Do you want to continue?</p>
        <div class="flex justify-between">
          <button @click="cancelGame" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button @click="confirmUseBrainCoin"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Use 1 BrainCoin
          </button>
        </div>
      </div>
    </div>

    <!-- Not enough coins modal -->
    <div v-if="spGameStore.showNotEnoughCoinsModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p class="text-lg mb-4">You don't have enough BrainCoins to start this game. Do you want to buy more?</p>
        <div class="flex justify-between">
          <button @click="cancelGame" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button @click="router.push('/purchasebraincoins')"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Buy BrainCoins
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { onMounted , onBeforeUnmount} from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSpGameStore } from '@/stores/spgame';
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';

const router = useRouter();
const authStore = useAuthStore();
const spGameStore = useSpGameStore();

onMounted(() => {
  spGameStore.resetState(); // Reset modal states when the page is loaded
});

onBeforeUnmount(() => {
  spGameStore.resetState(); // Reset state when the component is unmounted
});

const handleGameModeClick = (route) => {
  const isAuthenticated = !!authStore.user;
  const userBalance = authStore.balance;
  spGameStore.handleGameModeClick(route, isAuthenticated, userBalance);
};


const confirmUseBrainCoin = async () => {
  const newBalance = await spGameStore.useBrainCoin();
  if (newBalance !== null) {
    authStore.updateBalance(newBalance);
    const targetRoute = spGameStore.targetRoute || 'singleplayer'; // Use fallback if targetRoute is undefined
    router.push({name:targetRoute});
    console.log(targetRoute);
    router.push({name:spGameStore.targetRoute});
    spGameStore.showModal = false;
  }
};



const cancelGame = () => {
  spGameStore.cancelGame();
};
</script>
