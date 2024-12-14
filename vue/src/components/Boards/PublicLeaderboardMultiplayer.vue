<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <button @click="router.back"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
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
import { useLeaderboardMultiplayer } from '@/stores/leaderboardmultiplayer';
import { useRouter } from 'vue-router';

const router = useRouter();
const { mostgames, mostgamesWon, mostEfficientPlayers, isLoading } = useLeaderboardMultiplayer();
</script>
