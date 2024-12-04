<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Leaderboard</h2>

      <div v-if="isLoading" class="text-center mb-8">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else>
        <!-- Top 10 com mais jogos jogados -->
        <div class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Top 10 Users with Most Games Played</h3>

          <div class="space-y-4">
            <div v-for="(player, index) in mostgames" :key="index"
              class="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-center w-full">
                <!-- Ícones de classificação para os 3 primeiros lugares -->
                <span v-if="index === 0" class="text-yellow-500 text-2xl mr-2">🥇</span>
                <span v-if="index === 1" class="text-gray-500 text-2xl mr-2">🥈</span>
                <span v-if="index === 2" class="text-amber-600 text-2xl mr-2">🥉</span>

                <!-- Nome do jogador -->
                <p class="flex-1 text-lg font-semibold text-gray-900">{{ player.nickname }}</p>

                <!-- Barra de progresso -->
                <div class="relative w-2/3 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div :style="{ width: `${player.games_played_efficiency}%` }" :class="{
                    'bg-yellow-500': index === 0,
                    'bg-gray-400': index === 1,
                    'bg-orange-600': index === 2,
                    'bg-blue-500': index > 2
                  }" class="absolute top-0 left-0 h-full rounded-full"></div>
                </div>
              </div>

              <!-- Número total de jogos jogados -->
              <p class="ml-4 text-lg font-semibold text-gray-700">{{ player.games_played }}</p>
            </div>
          </div>
        </div>

        <!-- Top 10 com mais jogos ganhos -->
        <div class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Top 10 Users with Most Games Won</h3>

          <div class="space-y-4">
            <div v-for="(player, index) in mostgamesWon" :key="index"
              class="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-center w-full">
                <!-- Ícones de classificação para os 3 primeiros lugares -->
                <span v-if="index === 0" class="text-yellow-500 text-2xl mr-2">🥇</span>
                <span v-if="index === 1" class="text-gray-500 text-2xl mr-2">🥈</span>
                <span v-if="index === 2" class="text-amber-600 text-2xl mr-2">🥉</span>

                <!-- Nome do jogador -->
                <p class="flex-1 text-lg font-semibold text-gray-900">{{ player.nickname }}</p>

                <!-- Barra de progresso -->
                <div class="relative w-2/3 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div :style="{ width: `${player.games_won_efficiency}%` }" :class="{
                    'bg-yellow-500': index === 0,
                    'bg-gray-400': index === 1,
                    'bg-orange-600': index === 2,
                    'bg-blue-500': index > 2
                  }" class="absolute top-0 left-0 h-full rounded-full"></div>
                </div>
              </div>

              <!-- Número total de jogos ganhos -->
              <p class="ml-4 text-lg font-semibold text-gray-700">{{ player.games_won }}</p>
            </div>
          </div>
        </div>

        <!-- Top 10 Players with Most Wins and Fewest Moves -->
        <div class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Top 10 Efficient Players (Most Wins with
            Fewest Moves)</h3>

          <div class="space-y-4">
            <div v-for="(player, index) in mostEfficientPlayers" :key="index"
              class="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-center w-full">
                <!-- Ícones de classificação para os 3 primeiros lugares -->
                <span v-if="index === 0" class="text-yellow-500 text-2xl mr-2">🥇</span>
                <span v-if="index === 1" class="text-gray-500 text-2xl mr-2">🥈</span>
                <span v-if="index === 2" class="text-amber-600 text-2xl mr-2">🥉</span>

                <!-- Nome do jogador -->
                <p class="flex-1 text-lg font-semibold text-gray-900">{{ player.nickname }}</p>

                <!-- Barra de progresso de eficiência -->
                <div class="relative w-2/3 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div :style="{ width: `${player.efficiency_efficiency}%` }" :class="player.rankColor"
                    class="absolute top-0 left-0 h-full rounded-full"></div>
                </div>
              </div>

              <!-- Número total de pares descobertos -->
              <p class="ml-4 text-lg font-semibold text-gray-700">{{ player.total_pairs_discovered }}</p>
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

const mostgames = ref([]);
const mostgamesWon = ref([]);
const mostEfficientPlayers = ref([]);
const isLoading = ref(true);

const calculateEfficiency2 = (players, category) => {
  // Para eficiência, valores maiores são melhores, então vamos calcular baseado no maior valor.
  const maxValue = Math.max(...players.map(player => player[category])); // Encontrar o maior valor
  players.forEach(player => {
    player[`${category}_efficiency`] = ((player[category] / maxValue) * 100); // Calcular a eficiência para valores maiores
  });

  // Ordenar os jogadores por eficiência (maior valor de vitórias é melhor, então ordenamos de forma decrescente)
  players.sort((a, b) => b.efficiency_efficiency - a.efficiency_efficiency); // Ordem decrescente (maior valor primeiro)

  // Atribuir cores para 1º, 2º e 3º lugares
  players.forEach((player, index) => {
    if (index === 0) {
      player.rankColor = 'bg-yellow-500';  // 1º lugar: dourado
    } else if (index === 1) {
      player.rankColor = 'bg-gray-400';  // 2º lugar: prata
    } else if (index === 2) {
      player.rankColor = 'bg-orange-600'; // 3º lugar: bronze
    } else {
      player.rankColor = 'bg-blue-500';  // Para os demais jogadores: azul
    }
  });
};


// Função para calcular a eficiência
const calculateEfficiency = (players, category) => {
  // Para eficiência, valores menores são melhores, então vamos calcular baseado no menor valor.
  const minValue = Math.min(...players.map(player => player[category])); // Encontrar o menor valor
  players.forEach(player => {
    player[`${category}_efficiency`] = ((minValue / player[category]) * 100); // Calcular a eficiência para valores menores
  });

  // Se a categoria for "total_pairs_discovered" (que você mencionou como exemplo de eficiência),
  // podemos calcular também a eficiência para valores menores sendo melhores.
  if (category === 'total_pairs_discovered') {
    players.forEach(player => {
      player.efficiency_efficiency = ((minValue / player[category]) * 100); // Calcular a eficiência para valores menores
    });
  }

  // Ordenar os jogadores por eficiência (menor valor de jogadas é melhor, então ordenamos de forma crescente)
  players.sort((a, b) => b.efficiency_efficiency - a.efficiency_efficiency); // Ordem crescente (menor valor primeiro)

  // Atribuir cores para 1º, 2º e 3º lugares
  players.forEach((player, index) => {
    if (index === 0) {
      player.rankColor = 'bg-yellow-500';  // 1º lugar: dourado
    } else if (index === 1) {
      player.rankColor = 'bg-gray-400';  // 2º lugar: prata
    } else if (index === 2) {
      player.rankColor = 'bg-orange-600'; // 3º lugar: bronze
    } else {
      player.rankColor = 'bg-blue-500';  // Para os demais jogadores: azul
    }
  });
};


const fetchLeaderboard = async () => {
  try {
    // Jogadores com mais jogos jogados
    const response = await axios.get("/leaderboard-multiplayer-mostgames");
    const data = response.data;
    mostgames.value = data;
    calculateEfficiency2(mostgames.value, 'games_played');

    // Jogadores com mais vitórias
    const responseWon = await axios.get("/leaderboard-multiplayer-mostgames-won");
    const dataWon = responseWon.data;
    mostgamesWon.value = dataWon;
    calculateEfficiency2(mostgamesWon.value, 'games_won');

    // Jogadores mais eficientes (mais vitórias e menos pares descobertos)
    const responseEfficient = await axios.get("/leaderboard-multiplayer-efficient-players");
    const dataEfficient = responseEfficient.data;
    mostEfficientPlayers.value = dataEfficient;

    // Calcular as eficiências
    calculateEfficiency(mostEfficientPlayers.value, 'total_pairs_discovered');
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchLeaderboard);
</script>
