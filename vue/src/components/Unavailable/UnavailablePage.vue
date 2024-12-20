<template>
    <div class="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col items-center justify-center relative rounded-lg">
      <!-- Botão de Voltar -->
      <button
        @click="router.push('/')"
        class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center shadow-lg transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
          <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
        </svg>
        <span class="ml-2">Back</span>
      </button>
  
      <!-- Container Principal -->
      <div class="text-center max-w-4xl px-6 py-12 bg-white rounded-lg shadow-xl">
        <h2 class="text-4xl font-extrabold text-gray-900 mb-6">
          Oops! This Page Is Not Ready Yet!
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          We're working hard to make this page available for you. Please check back later or explore other parts of our website.
        </p>
        <button
          @click="router.push('/')"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition">
          Return to Home
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  </script>
  
  <style scoped>
  /* Personalize o estilo, se necessário */
  </style>
  