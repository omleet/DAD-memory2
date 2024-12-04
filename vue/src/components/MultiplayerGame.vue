<template>
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
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
                            to="#">
                            Game 4x3 
                        </RouterLink>
                        <RouterLink 
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block" 
                            to="#">
                            Game 4x4
                        </RouterLink>
                        <RouterLink 
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block" 
                            to="#">
                            Game 6x6
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Aqui você pode adicionar seu código Vue.js, se necessário.
</script>
