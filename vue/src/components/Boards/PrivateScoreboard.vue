
<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Personal ScoreBoard </h2>

      <!-- Board 3x4 -->
      <div v-if="personalScoreStore.board3x4" class="mb-6">
        <h3 class="text-xl font-semibold">Board 3x4</h3>
        <ul class="list-disc pl-5">
          <li>Shortest time: {{ personalScoreStore.board3x4.shortestTime }}s</li>
          <li>Fewest moves: {{ personalScoreStore.board3x4.fewestMoves }}</li>
          <li>Total games won: {{ personalScoreStore.board3x4.totalWins }}</li>
          <li>Total games lost: {{ personalScoreStore.board3x4.totalLosses }}</li>
          <li>Fewest moves in a game: {{ personalScoreStore.board3x4.fewestMovesInGame }}</li>
        </ul>
      </div>

      <!-- Board 4x4 -->
      <div v-if="personalScoreStore.board4x4" class="mb-6">
        <h3 class="text-xl font-semibold">Board 4x4</h3>
        <ul class="list-disc pl-5">
          <li>Shortest time: {{ personalScoreStore.board4x4.shortestTime }}s</li>
          <li>Fewest moves: {{ personalScoreStore.board4x4.fewestMoves }}</li>
          <li>Total games won: {{ personalScoreStore.board4x4.totalWins }}</li>
          <li>Total games lost: {{ personalScoreStore.board4x4.totalLosses }}</li>
          <li>Fewest moves in a game: {{ personalScoreStore.board4x4.fewestMovesInGame }}</li>
        </ul>
      </div>

      <!-- Board 6x6 -->
      <div v-if="personalScoreStore.board6x6" class="mb-6">
        <h3 class="text-xl font-semibold">Board 6x6</h3>
        <ul class="list-disc pl-5">
          <li>Shortest time: {{ personalScoreStore.board6x6.shortestTime }}s</li>
          <li>Fewest moves: {{ personalScoreStore.board6x6.fewestMoves }}</li>
          <li>Total games won: {{ personalScoreStore.board6x6.totalWins }}</li>
          <li>Total games lost: {{ personalScoreStore.board6x6.totalLosses }}</li>
          <li>Fewest moves in a game: {{ personalScoreStore.board6x6.fewestMovesInGame }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>




<script setup>
import { onMounted } from 'vue';
import { usePersonalScoreStore } from '@/stores/personalScore'; // Pinia store
//import { useRouter } from 'vue-router';

//const router = useRouter();
const personalScoreStore = usePersonalScoreStore();

onMounted(() => {
  // Fetch the score data for all boards when the component is mounted
  personalScoreStore.fetchBoardScores();
});

</script>