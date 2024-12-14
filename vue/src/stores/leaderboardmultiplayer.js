import { ref, onMounted } from "vue";
import axios from "axios";

export const useLeaderboardMultiplayer = () => {
    const mostgames = ref([]);
    const mostgamesWon = ref([]);
    const mostEfficientPlayers = ref([]);
    const isLoading = ref(true);

    const calculateEfficiency2 = (players, category) => {
        const maxValue = Math.max(...players.map(player => player[category]));
        players.forEach(player => {
            player[`${category}_efficiency`] = (player[category] / maxValue) * 100;
        });

        players.sort((a, b) => b.efficiency_efficiency - a.efficiency_efficiency);

        players.forEach((player, index) => {
            if (index === 0) {
                player.rankColor = 'bg-yellow-500';
            } else if (index === 1) {
                player.rankColor = 'bg-gray-400';
            } else if (index === 2) {
                player.rankColor = 'bg-orange-600';
            } else {
                player.rankColor = 'bg-blue-500';
            }
        });
    };

    const calculateEfficiency = (players, category) => {
        const minValue = Math.min(...players.map(player => player[category]));
        players.forEach(player => {
            player[`${category}_efficiency`] = (minValue / player[category]) * 100;
        });

        if (category === 'total_pairs_discovered') {
            players.forEach(player => {
                player.efficiency_efficiency = (minValue / player[category]) * 100;
            });
        }

        players.sort((a, b) => b.efficiency_efficiency - a.efficiency_efficiency);

        players.forEach((player, index) => {
            if (index === 0) {
                player.rankColor = 'bg-yellow-500';
            } else if (index === 1) {
                player.rankColor = 'bg-gray-400';
            } else if (index === 2) {
                player.rankColor = 'bg-orange-600';
            } else {
                player.rankColor = 'bg-blue-500';
            }
        });
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("/leaderboard-multiplayer-mostgames");
            const data = response.data;
            mostgames.value = data;
            calculateEfficiency2(mostgames.value, 'games_played');

            const responseWon = await axios.get("/leaderboard-multiplayer-mostgames-won");
            const dataWon = responseWon.data;
            mostgamesWon.value = dataWon;
            calculateEfficiency2(mostgamesWon.value, 'games_won');

            const responseEfficient = await axios.get("/leaderboard-multiplayer-efficient-players");
            const dataEfficient = responseEfficient.data;
            mostEfficientPlayers.value = dataEfficient;

            calculateEfficiency(mostEfficientPlayers.value, 'total_pairs_discovered');
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(fetchLeaderboard);

    return {
        mostgames,
        mostgamesWon,
        mostEfficientPlayers,
        isLoading
    };
};
