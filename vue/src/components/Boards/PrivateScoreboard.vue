<template>
  <div class="bg-gray-50 p-8 rounded-lg shadow-lg">
    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">Personal Scoreboard</h2>

      <!-- Singleplayer Stats -->
      <div class="mb-10">
        <h3 class="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide">Singleplayer Stats</h3>
        
        <!-- Table for Singleplayer Stats -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-800">
                <th class="px-6 py-3 text-left text-lg font-semibold">Board</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Shortest Time</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Fewest Moves</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Total Games</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="personalScoreStore.board3x4" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 3x4</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board3x4.singleplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.singleplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.singleplayer.totalGames || '-' }}</td>
              </tr>
              <tr v-if="personalScoreStore.board4x4" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 4x4</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board4x4.singleplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.singleplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.singleplayer.totalGames || '-' }}</td>
              </tr>
              <tr v-if="personalScoreStore.board6x6" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 6x6</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board6x6.singleplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.singleplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.singleplayer.totalGames || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Multiplayer Stats -->
      <div class="mt-10">
        <h3 class="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide">Multiplayer Stats</h3>

        <!-- Table for Multiplayer Stats -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-800">
                <th class="px-6 py-3 text-left text-lg font-semibold">Board</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Shortest Time</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Fewest Moves</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Total Games Played</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Total Games Won</th>
                <th class="px-6 py-3 text-center text-lg font-semibold">Total Games Lost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="personalScoreStore.board3x4" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 3x4</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board3x4.multiplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.multiplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.multiplayer.totalGames || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.multiplayer.totalWins || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board3x4.multiplayer.totalLosses || '-' }}</td>
              </tr>
              <tr v-if="personalScoreStore.board4x4" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 4x4</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board4x4.multiplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.multiplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.multiplayer.totalGames || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.multiplayer.totalWins || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board4x4.multiplayer.totalLosses || '-' }}</td>
              </tr>
              <tr v-if="personalScoreStore.board6x6" class="border-t">
                <td class="px-6 py-3 text-gray-700 font-semibold">Board 6x6</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.formatTime(personalScoreStore.board6x6.multiplayer.shortestTime) }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.multiplayer.fewestMoves || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.multiplayer.totalGames || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.multiplayer.totalWins || '-' }}</td>
                <td class="px-6 py-3 text-center">{{ personalScoreStore.board6x6.multiplayer.totalLosses || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePersonalScoreStore } from '@/stores/personalScore';

const personalScoreStore = usePersonalScoreStore();

onMounted(() => {
  personalScoreStore.fetchBoardScores();
});
</script>
