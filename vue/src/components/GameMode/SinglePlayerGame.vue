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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue'

const authStore = useAuthStore()
const router = useRouter()
const showAlert = ref(false)
const alertMessage = ref('')



const handleGameModeClick = (route) => {
  if (authStore.user) {
    router.push(route); // Redireciona para a rota
  } else {
    showAlert.value = true;
    alertMessage.value = 'Alert! Please log in/Register to proceed.';
  }
  setTimeout(() => {
    showAlert.value = false;
  }, 4000);
};


</script>