<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Leaderboards by Time</h2>

      <div v-if="isLoading" class="text-center mb-8">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else>
        <!-- Itera por cada tipo de board -->
        <div v-for="(players, boardType) in leaderboards" :key="boardType" class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Board {{ boardType }}</h3>

          <div class="space-y-4">
            <div
              v-for="(player, index) in players"
              :key="index"
              class="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div class="flex items-center w-full">
                <!-- Ícones de classificação para os 3 primeiros lugares -->
                <span v-if="index === 0" class="text-yellow-500 text-2xl mr-2">🥇</span>
                <span v-if="index === 1" class="text-gray-500 text-2xl mr-2">🥈</span>
                <span v-if="index === 2" class="text-amber-600 text-2xl mr-2">🥉</span>

                <!-- Nome do jogador -->
                <p class="flex-1 text-lg font-semibold text-gray-900">{{ player.nickname }}</p>

                <!-- Barra de tempo com cores distintas para o 1º, 2º e 3º lugares -->
                <div class="relative w-1/2 bg-gray-200 h-4 rounded-full">
                  <div
                    :style="{ width: `${player.total_time_percentage}%` }"
                    :class="{
                      'bg-yellow-500': index === 0, // Ouro para o 1º lugar
                      'bg-gray-400': index === 1, // Prata para o 2º lugar
                      'bg-orange-600': index === 2, // Bronze para o 3º lugar
                      'bg-blue-500': index > 2 // Azul para os outros jogadores
                    }"
                    class="absolute top-0 left-0 h-full rounded-full"
                  ></div>
                </div>
              </div>

              <!-- Tempo total -->
              <p class="ml-4 text-lg font-semibold text-gray-700">{{ player.total_time }}</p> <!-- Corrigido para 'seconds' -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const leaderboards = ref({});
const isLoading = ref(true);

// Função para calcular a porcentagem do tempo para o gráfico de barras
const calculateTimePercentage = (totalTime, maxTime) => {
  return (totalTime / maxTime) * 100;
};

const fetchLeaderboards = async () => {
  try {
    const response = await axios.get("/leaderboard-by-board");
    leaderboards.value = response.data;

    // Determinar o maior tempo para usar como base para calcular a porcentagem
    Object.keys(leaderboards.value).forEach(boardType => {
      const players = leaderboards.value[boardType];
      const maxTime = Math.max(...players.map(player => player.total_time));
      
      // Adicionar a porcentagem de tempo para cada jogador
      players.forEach(player => {
        player.total_time_percentage = calculateTimePercentage(player.total_time, maxTime);
      });
    });
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchLeaderboards);
</script>

<style scoped>
/* Estilos adicionais */
</style>
