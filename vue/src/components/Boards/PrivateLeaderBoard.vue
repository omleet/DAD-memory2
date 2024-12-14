<template>
  <div class="bg-gray-100 p-6 rounded-lg relative">
      <button @click="router.push('/profile')"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
      <!-- Container principal -->
      <div class="max-w-4xl mx-auto py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">Private Scoreboard</h2>

        <p class="text-gray-600 text-lg mb-12 text-center">
            Jogadas feitas : 99
        </p>
      </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>

</style>