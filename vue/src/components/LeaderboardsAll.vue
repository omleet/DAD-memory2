<template>
    <div class="bg-gray-100 p-6 rounded-lg">
      <!-- Container principal -->
      <div class="max-w-4xl mx-auto py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Leaderboards</h2>
        
  
        <!-- Texto explicativo abaixo do título -->
        <p class="text-gray-600 text-lg mb-12 text-center">
            Discover the top players who have mastered the game, completing it in record time and with the fewest moves!
        </p>
        
        <!-- Container para Leaderboard by Time -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Leaderboard by Time -->
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Leaderboard by Time</h3>
            <p class="text-gray-600 mb-4">
              Check the fastest players to complete the game.
            </p>
            <RouterLink 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block" 
              to="/publicleaderboardsbytime">
              View Leaderboard
            </RouterLink>
          </div>
  
          <!-- Leaderboard by Moves -->
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Leaderboard by Moves</h3>
            <p class="text-gray-600 mb-4">
              See who has completed the game in the fewest moves.
            </p>
            <RouterLink 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block" 
              to="/publicleaderboardsbymoves">
              View Leaderboard
            </RouterLink>
          </div>
          
          <!-- Multiplayer -->
          <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Multiplayer</h3>
            <p class="text-gray-600 mb-4">Leaderboards for our best Multiplayer players.</p>
            <RouterLink 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 inline-block" 
              to="/publicleaderboardsmultiplayer">
              View Leaderboard
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  </style>
  