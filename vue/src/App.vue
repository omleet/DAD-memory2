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
          <!-- aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -->

          <button @click="toggleSidebar"
            class="hamburger-menu sm:hidden text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-full p-3 shadow-lg transition duration-200 ease-in-out">
            <span class="material-icons text-2xl">menu</span>
          </button>
          <div class="esconder-menu flex items-center space-x-5 hidden sm:flex">
            <RouterLink to="/"
              class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold border-blue-600">
              Home
            </RouterLink>


            <!-- Dropdown "Play" com hover -->
            <div class="relative group">
              <button
                class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
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
              class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold border-blue-600">
              WebSockets
            </RouterLink>

            <RouterLink to="/leaderboardsall"
              class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold border-blue-600">
              Leaderboards
            </RouterLink>
            <RouterLink v-if="storeAuth.user" to="/gamehistory"
              class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold border-blue-600">
              Game History
            </RouterLink>
            <RouterLink v-if="storeAuth.user" to="/transactions"
              class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
              active-class="text-blue-600 font-semibold border-blue-600">
              Transactions
            </RouterLink>


            <div class="relative group">
              <button
                class="text-gray-900 hover:text-blue-600 hover:bg-gray-300 px-3 py-2 rounded-full border border-gray-500 text-lg font-medium transition-colors"
                type="button">

                Statistics
              </button>
              <!-- Dropdown menu -->
              <div
                class="absolute left-0 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-0 group-hover:block">
                <ul class="py-2 text-sm text-gray-700">
                  <li>
                    <RouterLink to="/generalstatistics"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      General Statistics
                    </RouterLink>
                  </li>
                  <li v-if="storeAuth.user">
                    <RouterLink to="/mystatistics"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">

                      My Statistics
                    </RouterLink>
                  </li>
                  <li v-if="storeAuth.isAdministrator()">
                    <RouterLink to="/adminstatistics"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">

                      Admin Statistics
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>

            <RouterLink v-if="storeAuth.user" to="/purchasebraincoins"
              class="pulse-green text-white border border-green-600 px-6 py-2 rounded-full text-lg font-medium transition-colors">
              Get BrainCoins
            </RouterLink>



            <RouterLink v-if="storeAuth.isAdministrator()" to="admintab"
              class="animated-bg text-white border border-transparent px-6 py-2 rounded-full text-lg font-medium transition-colors">
              Admin
            </RouterLink>
          </div>

          <!-- aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -->

          <!-- Exibir usuário logado ou botão Login/Register -->
          <div class="ml-auto flex items-center space-x-3">
            <!-- Quando logado -->
            <div v-if="storeAuth.user" class="flex items-center space-x-3 relative group">
              <!-- Coins -->
              <div
                class="flex items-center text-gray-900 font-medium space-x-2 rounded-full border border-gray-500 text-white px-4 py-2">
                <span class="material-icons text-yellow-600">attach_money</span>
                <span class="text-green-500 font-bold">{{ storeAuth.balance ?? 0 }}</span>
              </div>


              <!-- Nome do usuário -->
              <span class="text-black font-medium">{{ storeAuth.userFirstLastName }}</span>

              <!-- Imagem do perfil com hover para o menu -->
              <div class="relative group">
                <RouterLink to="#" @click="toggleDropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
                  <img class="w-14 h-14 rounded-full" :src="storeAuth.userPhotoUrl || avatarNoneAssetURL"
                    alt="Profile picture" />
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
                      <RouterLink to="/personal-score"
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

    <transition name="fade">
      <div v-if="isSidebarOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" @click="toggleSidebar">
        <div class="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 rounded-r-lg overflow-y-auto ">
          <div class="flex flex-col p-6 mt-24 space-y-4 ">
            <!-- Close button -->
            <button @click="!toggleSidebar"
              class="text-gray-900 mb-4 rounded border border-gray-300 px-4 py-2 bg-red-100 hover:bg-red-200 transition-colors">
              Close ✖
            </button>

            <!-- Replicate main menu links inside the sidebar -->
            <RouterLink to="/"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Home</RouterLink>

            <!-- Dropdown Play Menu -->
            <div>
              <button @click.stop="toggleDropdownnn" type="button"
                class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Play</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <ul v-show="isDropdownVisibleee" class="py-2 space-y-2">
                <li>
                  <RouterLink to="/singleplayer"
                    class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                    Singleplayer</RouterLink>
                </li>
                <li>
                  <RouterLink to="/multiplayer" class="block">
                    <button @click="handleGameModeClick('/multiplayer', $event)"
                      class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                      Multiplayer
                    </button>
                  </RouterLink>
                </li>
              </ul>
            </div>

            <!-- Other links -->
            <RouterLink to="/websocket"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              WebSockets</RouterLink>
            <RouterLink to="/leaderboardsall"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Leaderboards</RouterLink>

            <!-- Links for authenticated users -->
            <RouterLink v-if="storeAuth.user" to="/gamehistory"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Game
              History</RouterLink>
            <RouterLink v-if="storeAuth.user" to="/transactions"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Transactions</RouterLink>

            <!-- Dropdown Statistics Menu -->
            <div>
              <button @click.stop="toggleDropdownn" type="button"
                class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Statistics</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <ul v-show="isDropdownVisiblee" class="py-2 space-y-2">
                <li>
                  <RouterLink to="/generalstatistics"
                    class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                    General Statistics</RouterLink>
                </li>
                <li v-if="storeAuth.user">
                  <RouterLink to="/mystatistics"
                    class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                    My Statistics</RouterLink>
                </li>
                <li v-if="storeAuth.isAdministrator()">
                  <RouterLink to="/adminstatistics"
                    class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
                    Admin Statistics</RouterLink>
                </li>
              </ul>
            </div>

            <!-- User-specific links -->
            <RouterLink v-if="storeAuth.user" to="/purchasebraincoins"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Get BrainCoins</RouterLink>

            <!-- Admin links -->
            <RouterLink v-if="storeAuth.isAdministrator()" to="admintab"
              class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white">
              Admin</RouterLink>
          </div>
        </div>
      </div>
    </transition>





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



///////////////////////////////////
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isDropdownVisiblee = ref(false);

function toggleDropdownn() {
  isDropdownVisiblee.value = !isDropdownVisiblee.value;
}

const isDropdownVisibleee = ref(false);

function toggleDropdownnn() {
  isDropdownVisibleee.value = !isDropdownVisibleee.value;
}
///////////////////////////////////


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



const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
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

<style scoped>
@media (max-width: 1504px) and (max-height: 956px) {
  .hamburger-menu {
    display: block !important;
  }

  .esconder-menu {
    display: none !important;
  }
}

@media (min-width: 1505px) {
  .hamburger-menu {
    display: none !important;
  }
}

.fixed.top-0.left-0.w-64.h-full.bg-white.shadow-lg.z-50.rounded-r-lg.overflow-y-auto {
  max-height: 100vh;
  background-color: #f3f4f6;
  /* Limite a altura da sidebar a 80% da altura da tela */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

@keyframes rgbBackground {
  0% {
    background-color: rgb(255, 0, 0);
  }

  /* Vermelho */
  14% {
    background-color: rgb(255, 165, 0);
  }

  /* Laranja */
  28% {
    background-color: rgb(255, 255, 0);
  }

  /* Amarelo */
  42% {
    background-color: rgb(0, 255, 0);
  }

  /* Verde */
  57% {
    background-color: rgb(0, 0, 255);
  }

  /* Azul */
  71% {
    background-color: rgb(75, 0, 130);
  }

  /* Índigo */
  85% {
    background-color: rgb(238, 130, 238);
  }

  /* Violeta */
  100% {
    background-color: rgb(255, 0, 0);
  }

  /* Volta ao Vermelho */
}

.animated-bg {
  animation: rgbBackground 16s infinite linear;
  /* Animação contínua */
  color: white;
  /* Garante contraste do texto */
  border: 1px solid transparent;
  /* Bordas opcionalmente transparentes */
  padding: 0.5rem 1rem;
  /* Ajusta o padding */
  border-radius: 9999px;
  /* Cantos arredondados */
  transition: transform 0.5s;
  /* Transição para hover */
}

.animated-bg:hover {
  transform: scale(1.1);
  /* Ampliação no hover */
}

@keyframes pulseGreen {
  0% {
    background-color: rgb(34, 197, 94);
    /* Verde Escuro */
  }

  50% {
    background-color: rgb(40, 255, 118);
    /* Verde Claro */
  }

  100% {
    background-color: rgb(34, 197, 94);
    /* Verde Escuro */
  }
}

.pulse-green {
  animation: pulseGreen 2s infinite ease-in-out;
  /* Animação de pulso */
  color: white;
  /* Texto branco */
  border: 1px solid rgb(34, 197, 94);
  /* Borda verde */
  padding: 0.5rem 1rem;
  /* Padding ajustado */
  border-radius: 9999px;
  /* Cantos arredondados */
  transition: transform 0.2s;
  /* Efeito suave de transição */
}

.pulse-green:hover {
  transform: scale(1.1);
  /* Aumenta de tamanho no hover */
}
</style>
