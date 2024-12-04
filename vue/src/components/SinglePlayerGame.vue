<template>
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
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
              <RouterLink 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block" 
                to="/cardgame">
                Game 4x3 
              </RouterLink>
  
              <!-- Botão para o modo de jogo 4x4 -->
              <button 
                @click="handleGameModeClick('/cardgame4x4')" 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
                Game 4x4
              </button>
  
              <!-- Botão para o modo de jogo 6x6 -->
              <button 
                @click="handleGameModeClick('/cardgame6x6')" 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
                Game 6x6
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Exibe o alerta -->
      <AlertMessage 
        v-if="showAlert" 
        :message="alertMessage" 
        :duration="10000" 
      />
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
    if (authStore.isAuthenticated) {
      router.push(route)
    } else {
      showAlert.value = true
      alertMessage.value = 'Alert! Please log in / Register to proceed.'
    }
    setTimeout(() => {
      showAlert.value = false;
    }, 4000); 
  }
  </script>
  