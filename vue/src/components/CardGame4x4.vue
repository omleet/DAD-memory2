<template>
  <div>
    <CardGame v-if="authStore.user" :gridSize="16" />

    
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import CardGame from './CardGame.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

if (!authStore.user) {
    router.push('/')  // Redireciona para a página home se o usuário não estiver autenticado
}
</script>
