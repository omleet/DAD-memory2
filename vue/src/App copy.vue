<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="custom-background flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-gray-100 border-b border-black w-full shadow-sm">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-24 w-full">
          <!-- Logo com link para Home -->
          <RouterLink to="/" class="flex-shrink-0 mr-20">
            <img src="/logo1.png" alt="Logo"
              class="w-16 h-auto object-contain transition-transform duration-200 ease-in-out transform hover:scale-[1.30]" />
          </RouterLink>

          <!-- Navegação principal -->
          <div class="flex items-center space-x-5 hidden sm:flex">
            <RouterLink to="/"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Home
            </RouterLink>

            <!-- Dropdown "Play" com hover -->
            <div class="relative group">
              <button
                class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors flex items-center"
                type="button">
                Play
              </button>
              <!-- Dropdown menu -->
              <div
                class="absolute left-0 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-0 group-hover:block">
                <ul class="py-2 text-sm text-gray-700">
                  <li>
                    <RouterLink to="/singleplayer"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Singleplayer
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink 
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button @click="handleGameModeClick('/multiplayer', $event)">Multiplayer</button>
                    </RouterLink>
                  </li>

                </ul>
              </div>
            </div>

            <!-- Outros links -->
            <RouterLink to="/websocket"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors">
              WebSockets
            </RouterLink>
            <RouterLink to="/laraveltester"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors">
              LaravelTester
            </RouterLink>
          </div>

          <!-- Exibir usuário logado ou botão Login/Register -->
          <div class="ml-auto flex items-center space-x-3">
            <!-- Quando logado -->
            <div v-if="storeAuth.isAuthenticated" class="flex items-center space-x-3 relative group">
              <!-- Coins -->
              <div class="flex items-center text-gray-900 font-medium space-x-2">
                <span class="material-icons text-yellow-500">monetization_on</span>
                <span class="text-green-500 text-bold">{{ storeAuth.user.brain_coins_balance ?? 0 }}</span>
              </div>
              <!-- Nome do usuário -->
              <span class="text-gray-900 font-medium">{{ storeAuth.user.name }}</span>
              <!-- Imagem do perfil com hover para o menu -->
              <div class="relative group">
                <img :src="storeAuth.userPhotoUrl" alt="User Image" class="w-10 h-10 rounded-full cursor-pointer"
                  @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false" />
                <!-- Menu Dropdown -->
                <div v-show="isDropdownOpen"
                  class="absolute right-0 mt-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-10"
                  @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
                  <ul class="py-2 text-sm text-gray-700">
                    <li>
                      <a href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Personal Scores
                      </a>
                    </li>
                  </ul>
                  <div class="py-2">
                    <button @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quando não logado -->
            <RouterLink v-else to="/loginform"
              class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-600 active:bg-blue-700 mr-35"
              active-class="bg-blue-700">
              Login/Register
            </RouterLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-black text-center py-4">
      <p class="text-black text-sm">© 2024 Project DAD - Memory Game. All Rights Reserved.</p>
    </footer>
    <AlertMessage v-if="showAlert" :message="alertMessage" :duration="10000" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from './stores/auth';
import { RouterLink, useRouter } from 'vue-router'
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue'


const storeAuth = useAuthStore();
const authStore = useAuthStore()
const router = useRouter()
const showAlert = ref(false)
const isDropdownOpen = ref(false);
const alertMessage = ref('')

const logout = () => {
  storeAuth.logout();
  window.location.href = '/'; // Redireciona para a página inicial
};


const handleGameModeClick = async (route, event) => {
  event.preventDefault();  // Previne a navegação ao clicar

  // Verifica se o utilizador está autenticado
  if (authStore.isAuthenticated) {
    // Se o utilizador estiver autenticado, navega para a página Multiplayer
    await router.push(route);
  } else {
    // Caso contrário, exibe um alerta e não permite navegação
    showAlert.value = true;
    alertMessage.value = 'Alert! Please log in / Register to proceed.';
    
    // Esconde o alerta após 4 segundos
    setTimeout(() => {
      showAlert.value = false;
    }, 4000);
  }
}


</script>
