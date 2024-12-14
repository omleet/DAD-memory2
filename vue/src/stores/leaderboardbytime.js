// stores/leaderboardByTime.js
import { ref } from "vue";
import axios from "axios";

// Estado reativo
const leaderboards = ref({});
const isLoading = ref(true);

// Função para calcular a porcentagem do tempo para o gráfico de barras
const calculateTimePercentage = (totalTime, maxTime) => {
  return (totalTime / maxTime) * 100;
};

// Função para buscar os dados do leaderboard
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

// Exportar os reativos e funções
export { leaderboards, isLoading, fetchLeaderboards };
