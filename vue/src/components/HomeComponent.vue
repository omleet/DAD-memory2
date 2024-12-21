<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <!-- Container principal -->
    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Memory Game</h2> <!-- Aumentei o espaçamento aqui -->

      <!-- Mensagem de boas-vindas -->
      <div class="text-center mb-8">
        <p class="text-lg text-gray-700 font-medium">
          NOT Welcome to the Memory Game! Test your memory skills and challenge yourself to beat your best score. Ready to play?
        </p>
      </div>

      <!-- Container para Singleplayer e Multiplayer -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Container para Singleplayer -->
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Singleplayer</h3>
          <p class="text-gray-600 mb-4">
            Play the memory game alone and challenge yourself to beat your own records.
          </p>
          <RouterLink
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block"
            to="/singleplayer"
          >
            Play Singleplayer
          </RouterLink>
        </div>

        <!-- Container para Multiplayer -->
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Multiplayer</h3>
          <p class="text-gray-600 mb-4">Play against other players and see who has the best memory!</p>

          <!-- Botão Play Multiplayer com alerta -->
          <button
            v-if="!isAuthenticated"
            @click="showAlert"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block mt-4"
          >
            Play Multiplayer
          </button>

          <!-- Botão Play Multiplayer normal -->
          <RouterLink
            v-else
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block mt-4"
            to="/multiplayer"
          >
            Play Multiplayer
          </RouterLink>
        </div>
      </div>

      <!-- Container para Leaderboards -->
      <div class="mt-12">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Leaderboards</h3>
          <p class="text-gray-600 mb-6">See who's at the top of the charts and challenge your friends!</p>
          <RouterLink
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block"
            to="/leaderboardsall"
          >
            View Leaderboards
          </RouterLink>
        </div>
      </div>

      <!-- Statistics -->
      <div class="mt-12">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Statistics</h3>
          <p class="text-gray-600 mb-6">Analyze the general gameplay data!</p>
          <RouterLink
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            to="/generalstatistics"
          >
            View General Statistics
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Componente de alerta -->
    <AlertMessage v-if="alertVisible" message="Alert! Please Log in/Register to proceed." />
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import AlertMessage from '@/components/ui/alerts/AlertMessage.vue'
  
  const authStore = useAuthStore()
  const isAuthenticated = authStore.user
  const alertVisible = ref(false)
  
  // Função para mostrar o alerta
  function showAlert() {
    alertVisible.value = true
    setTimeout(() => {
      alertVisible.value = false
    }, 4000) // Esconde o alerta após 4 segundos
  }
  </script>
  
  <style scoped>
  /* Estilos adicionais, se necessário */
  </style>
  