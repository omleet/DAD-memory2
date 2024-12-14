// stores/leaderboardByMoves.js
import { ref } from "vue";
import axios from "axios";

// Estado reativo
const leaderboards = ref({});
const isLoading = ref(true);

// Função para calcular a porcentagem de jogadas
const calculateTurnsPercentage = (totalTurns, minTurns) => {
  return (totalTurns / minTurns) * 100;
};

// Função para buscar os dados do leaderboard por jogadas
const fetchLeaderboards = async () => {
  try {
    const response = await axios.get("/leaderboard-by-moves"); // Endpoint para leaderboard por jogadas
    leaderboards.value = response.data;

    // Determinar o menor número de jogadas (minTurns) para usar como base para a porcentagem
    Object.keys(leaderboards.value).forEach(boardType => {
      const players = leaderboards.value[boardType];
      const minTurns = Math.min(...players.map(player => player.total_turns_winner));

      // Adicionar a porcentagem de jogadas para cada jogador
      players.forEach(player => {
        player.total_turns_percentage = calculateTurnsPercentage(player.total_turns_winner, minTurns);
      });
    });
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
  } finally {
    isLoading.value = false;
  }
};

// Exportar os estados e funções
export { leaderboards, isLoading, fetchLeaderboards };
