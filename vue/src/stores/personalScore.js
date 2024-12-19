import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePersonalScoreStore = defineStore('personalScore', () => {
  // Store the score data for each board size
  const board3x4 = ref(null);
  const board4x4 = ref(null);
  const board6x6 = ref(null);

  // Fetch data from the server
  const fetchBoardScores = async () => {
    try {
      const response = await axios.get('/personal-score'); // Endpoint to fetch the scores
      const scores = response.data;

      // Populate the store with the scores for each board size
      board3x4.value = scores['3x4'];
      board4x4.value = scores['4x4'];
      board6x6.value = scores['6x6'];
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  };

  return {
    board3x4,
    board4x4,
    board6x6,
    fetchBoardScores,
  };
});
