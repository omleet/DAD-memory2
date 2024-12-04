<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref, watchEffect, computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(true); // Controle de carregamento
const user = ref(authStore.user); // Ref para o user

const userPhotoUrl = computed(() => authStore.userPhotoUrl);

watchEffect(async () => {
  if (!authStore.isAuthenticated) {
    // Inicializa o authStore se necessário
    await authStore.initializeAuth();
  }
  user.value = authStore.user; // Atualiza o usuário após inicialização
  isLoading.value = false; // Finaliza o carregamento
});

const logout = () => {
  authStore.logout();
  router.push('/loginform'); // Redireciona para a página de login
};
</script>


<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex justify-center mb-6">
          <img
            class="w-20 h-20 rounded-full"
            :src="userPhotoUrl"
            alt="Rounded avatar"
          />
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between" v-if="user">
            <span class="font-medium text-gray-700">Name:</span>
            <span class="text-gray-900">{{ user.name }}</span>
          </div>
          <div class="flex items-center justify-between" v-if="user">
            <span class="font-medium text-gray-700">Nickname:</span>
            <span class="text-gray-900">{{ user.nickname }}</span>
          </div>
          <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Email:</span>
              <span class="text-gray-900">{{ user?.email || 'N/A' }}</span>
            </div>
          <div class="flex items-center justify-between" v-if="user">
            <span class="font-medium text-gray-700">Email Verified:</span>
            <span class="text-gray-900">
              {{ user.email_verified_at ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Type:</span>
              <span class="text-gray-900">{{ user?.type }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700">Brain Coins Balance:</span>
              <span class="text-gray-900">{{ user?.brain_coins_balance}}</span>
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
</template>
