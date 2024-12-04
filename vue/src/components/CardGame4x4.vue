<template>
  <div>
    <CardGame v-if="isAuthenticated" :gridSize="16" />

    <div v-else class="text-center mt-6">
      <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
      
      <p class="text-red-600 text-xl font-semibold">⚠️ You need to be logged in to play this mode.</p>
      <p class="text-gray-700 mt-2">Please log in to unlock this game.</p>
      <button @click="redirectToLogin"
        class="bg-blue-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors mt-4">
        Log In
      </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CardGame from './CardGame.vue'

const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated

const router = useRouter()

const redirectToLogin = () => {
  router.push('/loginform')
}
</script>
