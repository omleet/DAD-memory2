<template>
  <Toaster />
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
                    <RouterLink class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      
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
           
            <RouterLink to="/leaderboardsall"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors">
              Leaderboards
            </RouterLink>

            <RouterLink v-if="storeAuth.user" to="#"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition-colors">
              Transactions
            </RouterLink>

            <RouterLink v-if="storeAuth.user" to="/purchasebraincoins"
            class="text-yellow-500 hover:bg-green-600 border border-green-500 px-6 py-2 rounded-full text-lg font-medium transition-colors">
              BUY BRAINCOINS
            </RouterLink>
          </div>

          <!-- Exibir usuário logado ou botão Login/Register -->
          <div class="ml-auto flex items-center space-x-3">
            <!-- Quando logado -->
            <div v-if="storeAuth.user" class="flex items-center space-x-3 relative group">
              <!-- Coins -->
              <div class="flex items-center text-gray-900 font-medium space-x-2">
                <span class="material-icons text-yellow-600">attach_money</span>
                <span class="text-green-500 text-bold">{{ storeAuth.balance ?? 0 }}</span>
              </div>

              <!-- Nome do usuário -->
              <span class="text-black font-medium">{{ storeAuth.userFirstLastName }}</span>

              <!-- Imagem do perfil com hover para o menu -->
              <div class="relative group">
                <RouterLink to="/profile">
                  <img class="w-14 h-14 rounded-full" :src="storeAuth.userPhotoUrl || avatarNoneAssetURL"
                    alt="Profile picture" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false" />
                </RouterLink>

                <!-- Menu Dropdown -->
                <div v-if="isDropdownOpen"
                  class="absolute right-0 mt-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-10"
                  @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
                  <ul class="py-2 text-sm text-gray-700">
                    <li>
                      <RouterLink to="/profile"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Profile
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Personal Scores
                      </RouterLink>
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
import Toaster from '@/components/ui/toast/Toaster.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';
import avatarNoneAssetURL from '@/assets/avatar-none.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const storeAuth = useAuthStore();
const showAlert = ref(false);
const isDropdownOpen = ref(false);
const alertMessage = ref('');



// Função de logout
const logout = () => {
  storeAuth.logout();
  alertMessage.value = 'You have successfully logged out.';  // Mensagem de sucesso
  showAlert.value = true;  // Exibe a mensagem
  setTimeout(() => {
    showAlert.value = false;  // Esconde a mensagem após 4 segundos
  }, 4000);
};

const handleGameModeClick = async (route, event) => {
  event.preventDefault();  // Previne a navegação ao clicar

  // Verifica se o utilizador está autenticado
  if (storeAuth.user) {
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
