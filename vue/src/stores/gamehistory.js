import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useGameHistoryStore = defineStore('gameHistory', () => {
  const games = ref({});
  const loading = ref(true);
  const error = ref(null);
  const currentPage = ref(1);

  // Fetch Games
  const fetchGames = async (page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`/gamehistory?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      games.value = response.data; // Assign the paginated data
      currentPage.value = page;
    } catch (err) {
      error.value = 'Failed to fetch game history. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  // Format Date
  const formatDate = (datetime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(datetime).toLocaleDateString(undefined, options);
  };

  // Format Total Time
  const formatTotalTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(2);
    return `${minutes}m ${seconds}s`;
  };

  return {
    games,
    loading,
    error,
    currentPage,
    fetchGames,
    formatDate,
    formatTotalTime,
  };
});
