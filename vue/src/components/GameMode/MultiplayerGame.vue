<template>
    <div  class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <!-- Botão com a seta para voltar -->
        <button @click="router.push('/')"
            class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
            </svg>
        </button>
        <div class="max-w-2xl mx-auto py-8">
            <!-- Título Multiplayer -->
            <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Multiplayer Game</h2>

            <!-- Texto explicativo para o modo Multiplayer -->
            <div class="text-center mb-8">
                <p class="text-lg text-gray-700 font-medium">
                    Welcome to the Multiplayer mode! Compete against other players and see who has the best memory!
                </p>
            </div>

            <!-- Container para os Modos de Jogo -->
            <div class="text-center">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h3 class="text-xl font-semibold text-gray-900 mb-6">Game Modes</h3>

                    <div class="space-x-4">
                        <!-- Botões para os modos de jogo -->
                        <RouterLink
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                            to="/unavailablepage">
                            Game 4x3
                        </RouterLink>
                        <RouterLink
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                            to="/unavailablepage">
                            Game 4x4
                        </RouterLink>
                        <RouterLink
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                            to="/unavailablepage">
                            Game 6x6
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>
