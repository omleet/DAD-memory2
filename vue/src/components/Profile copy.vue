<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import avatarNone from '@/assets/avatar-none.png'; // Caminho da imagem padrão

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(true); // Controle de carregamento
const user = authStore.user;


onMounted(async () => {
  if (!authStore.isAuthenticated) {
    // Inicialize o store de autenticação e carregue os dados do usuário
    await authStore.initializeAuth();
  }

  // Aguardar até que o usuário esteja carregado
  if (authStore.user && authStore.user.value) {
    console.log(authStore.user.value); // Agora deve exibir o usuário corretamente
  } else {
    console.log('Usuário não carregado.');
  }

  isLoading.value = false; // Finaliza o carregamento após o auth estar pronto
});


// Computed property to handle avatar image
const avatarSrc = computed(() => {
  // Verifique se o usuário tem uma foto
  if (user.value && user.value.userPhotoUrl) {
    return user.value.userPhotoUrl; // Usa o URL retornado pelo backend
  }
  // Se não tiver foto, retorna a imagem padrão
  return avatarNone;

  
});


const logout = () => {
  authStore.logout();
  router.push('/'); // Redireciona para a página de login
};
</script>

<template>
  <!-- Show loading state while fetching data -->
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <p>Loading...</p>
  </div>

  <!-- Once loading is complete, show the profile data -->
  <div v-else>
    <div v-if="user" class="bg-gray-100 p-6 rounded-lg shadow-lg">
      <div class="max-w-2xl mx-auto py-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex justify-center mb-6">
            <img
              :src="avatarSrc"
              alt="User Avatar"
              class="w-24 h-24 rounded-full shadow-lg"
            />
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Name:</span>
              <span class="text-gray-900">{{ user?.name || 'N/A' }}</span> <!-- Verificação com 'user?.name' -->
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Nickname:</span>
              <span class="text-gray-900">{{ user?.nickname || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Email:</span>
              <span class="text-gray-900">{{ user?.email || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Email Verified:</span>
              <span class="text-gray-900">{{ user?.email_verified_at ? 'Yes' : 'No' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Type:</span>
              <span class="text-gray-900">{{ user?.type || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Coins Balance:</span>
              <span class="text-gray-900">{{ user?.brain_coins_balance || 'N/A' }}</span>
            </div>
          </div>
          <div class="mt-6 text-center">
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Caso o usuário não esteja carregado, exibe um conteúdo alternativo -->
    <div v-else class="bg-gray-100 p-6 rounded-lg shadow-lg">
      <p>O usuário não foi encontrado.</p>
    </div>
  </div>
</template>

