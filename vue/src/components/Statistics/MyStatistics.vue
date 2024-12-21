<template>
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <!-- Botão de Voltar -->
        <button @click="router.push({ name: 'home'});"
            class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
            </svg>
        </button>

        <!-- Container Principal -->
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Personal Statistics</h2>

            <!-- Spinner de Carregamento -->
            <div v-if="isLoading" class="flex justify-center items-center h-32">

            </div>

            <!-- Estatísticas Gerais com Sombreamento -->
            <div v-else class="space-y-2 m-4 bg-white p-6 rounded-lg shadow-md">
                <p class="text-slate-700 dark:text-slate-300 m-4 text-center font-bold">
                    The following data applies to you.
                </p><br>

                <!-- Informações Estatísticas -->
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Games Played:</span>
                    <span class="text-green-600">{{ stats.singleplayer_games_played + stats.multiplayer_games_played }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Singleplayer Games Played:</span>
                    <span class="text-blue-600">{{ stats.singleplayer_games_played }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Multiplayer Games Played:</span>
                    <span class="text-blue-600">{{ stats.multiplayer_games_played }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Transactions made:</span>
                    <span class="text-yellow-600">{{ stats.transactions }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Money Spent (€):</span>
                    <span class="text-red-600">{{ stats.total_spent }}€</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-700">Current Brain Coins:</span>
                    <span class="text-green-600 font-bold">{{ stats.coins_balance }}</span>
                </div><br>

                <!-- Gráfico -->
                <div class="mt-6">
                     <WinLossesPerMonth v-if="stats.wins_losses_per_month" :stats="stats.wins_losses_per_month" />   
                </div><br>
                <div class="mt-6">
                     <WinLossesPerWeek v-if="stats.wins_losses_per_week" :stats="stats.wins_losses_per_week" />   
                </div><br>

            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import WinLossesPerMonth from './WinLossesPerMonth.vue'
import WinLossesPerWeek from './WinLossesPerWeek.vue'


// Configuração do roteamento
const router = useRouter()

// Controle de estado
const errorStore = useErrorStore()
const stats = ref(null)
const isLoading = ref(true)

// Requisição de dados
axios
    .get(axios.defaults.baseURL + '/statistics/my')
    .then((response) => {
        stats.value = response.data
        //  console.log(stats.value.wins_losses_per_week) //ver os dados que estavam a passar
        isLoading.value = false
    })
    .catch(() => {
        errorStore.setErrorMessages('Error occurred while trying to provide your statistics.')
    })
    
</script>