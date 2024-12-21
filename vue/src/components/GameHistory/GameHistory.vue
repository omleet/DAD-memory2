<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <!-- Back button -->
    <button @click="router.push({ name: 'home'});"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>

    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Your Game History</h2>

      <!-- Loading State -->
      <div v-if="gameHistoryStore.loading" class="text-center mb-8">
        <p class="text-gray-600">Loading game history...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="gameHistoryStore.error" class="text-center mb-8">
        <p class="text-red-600">{{ gameHistoryStore.error }}</p>
      </div>

      <!-- Games Table -->
      <div>
        <div class="overflow-x-auto">
          <table v-if="gameHistoryStore.games.data?.length > 0" class="min-w-full bg-white border-collapse border border-gray-200">
            <thead>
              <tr class="text-left text-sm font-semibold text-gray-800 border-b bg-gray-100">
                <th class="px-4 py-2 border-r">Date</th>
                <th class="px-4 py-2 border-r">Game Type</th>
                <th class="px-4 py-2 border-r">Status</th>
                <th class="px-4 py-2 border-r">Total Time</th>
                <th class="px-4 py-2 border-r">Turns</th>
                <th class="px-4 py-2 border-r">Winner</th>
                <th class="px-4 py-2">Board Size</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in gameHistoryStore.games.data" :key="game.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 border-r">{{ gameHistoryStore.formatDate(game.began_at) }}</td>
                <td class="px-4 py-2 border-r">{{ game.type === 'S' ? 'Single Player' : 'Multiplayer' }}</td>
                <td class="px-4 py-2 border-r">{{ gameHistoryStore.getStatusText(game.status) }}</td>
                <td class="px-4 py-2 border-r">{{ gameHistoryStore.formatTotalTime(game.total_time) }}</td>
                <td class="px-4 py-2 border-r">{{ game.total_turns_winner ? game.total_turns_winner : '-' }}</td>
                <td class="px-4 py-2 border-r">{{ game.winner_nickname || '-' }}</td>
                <td class="px-4 py-2">{{ game.board_size || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- No Games Found -->
          <div v-else class="text-center text-gray-600">
            <p>No game history found.</p>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="gameHistoryStore.games.total > gameHistoryStore.games.per_page"
        class="flex justify-between items-center mt-4">
        <button @click="changePage(gameHistoryStore.currentPage - 1)"
          :disabled="gameHistoryStore.currentPage === 1 || gameHistoryStore.loading"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500">
          Previous
        </button>

        <span v-if="gameHistoryStore.loading" class="ml-4 text-gray-600">Loading...</span>

        <button @click="changePage(gameHistoryStore.currentPage + 1)"
          :disabled="gameHistoryStore.currentPage === gameHistoryStore.games.last_page || gameHistoryStore.loading"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameHistoryStore } from '@/stores/gamehistory';
import { useRouter } from 'vue-router';

// Create an instance of the router and store
const router = useRouter();
const gameHistoryStore = useGameHistoryStore();

// Fetch game history on mount
gameHistoryStore.fetchGames();

// Define the changePage function
const changePage = (page) => {
  gameHistoryStore.fetchGames(page);
};
</script>

<style scoped>
/* Additional styles for table columns and rows */
</style>
