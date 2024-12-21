<template>
    <div v-if="authStore.isAdministrator()" class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <!-- Botão de Voltar -->
        <button @click="router.push({ name: 'home'});"
            class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
            </svg>
        </button>

        <!-- Container Principal -->
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Admin Statistics</h2>

            <!-- Spinner de Carregamento -->
            <div v-if="isLoading" class="flex justify-center items-center h-32">

            </div>

            <!-- Estatísticas Gerais com Sombreamento -->
            <div v-else class="space-y-2 m-4 bg-white p-6 rounded-lg shadow-md">
                <p class="text-slate-700 dark:text-slate-300 m-4 text-center font-bold">
                    The following data is only supllied to admin users.
                </p><br>

                <!-- Informações Estatísticas -->
                <div class="flex justify-between items-center">
                    <span class="font-semibold dark:text-slate-100">Total Earnings:</span>
                    <span class="text-green-600 ">{{ stats.total_revenue }}€</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold dark:text-slate-100">User with the most money spent (€):</span>
                    <span class="text-blue-600 ">
                        {{ stats.user_most_money_spent.user.nickname + " - (" + stats.user_most_money_spent.total_euros_spent + "€)" }}
                    </span>



                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold dark:text-slate-100">Average spent on a purchase:</span>
                    <span class="text-yellow-600 ">{{ parseFloat(stats.average_euros_per_transaction).toFixed(2)
                        }}€</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-semibold dark:text-slate-100">Blocked Users on the platform:</span>
                    <span class="text-red-600 ">{{ stats.total_blocks }}</span>
                </div><br>


                <!-- Gráfico -->
                <div class="mt-6">
                    <RevenueByYear v-if="stats.revenue_per_year" :stats="stats.revenue_per_year" />
                </div><br>

                <div class="mt-6">
                    <RevenueByMonth v-if="stats.revenue_per_month" :stats="stats.revenue_per_month" />
                </div><br>

                <div class="mt-6">
                    <TransactionsPerMonth v-if="stats.transactions_per_month" :stats="stats.transactions_per_month" />
                </div><br>

            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import RevenueByYear from './RevenueByYear.vue'
import RevenueByMonth from './RevenueByMonth.vue'
import TransactionsPerMonth from './TransactionsPerMonth.vue'

// Configuração do roteamento
const router = useRouter()


// Controle de estado
const errorStore = useErrorStore()
const stats = ref(null)
const isLoading = ref(true)

const authStore = useAuthStore()

if (!authStore.isAdministrator()) {
    router.push({ name: 'home'});
}

// Requisição de dados
axios
    .get(axios.defaults.baseURL + '/statistics/admin')
    .then((response) => {
        stats.value = response.data
        //console.log(stats.value.user_most_money_spent) //ver os dados que estavam a passar
        isLoading.value = false
    })
    .catch(() => {
        errorStore.setErrorMessages('Error occurred while trying to provide the admin statistics.')

    })

</script>