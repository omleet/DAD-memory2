import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useGameStore = defineStore('gameStore', () => {
  const success = ref(null);
  const error = ref(null);

  // Submit Game Data
  const submitGame = async (gameData) => {
    success.value = null;
    error.value = null;
  
    try {
      const response = await axios.post('/game/store', gameData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      success.value = 'Game stored successfully!';
      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || 'Failed to store game data. Please try again.';
      console.error('Error details:', err.response || err.message);
    }
  };

  return {
    success,
    error,
    submitGame,
  };
});
