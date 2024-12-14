<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';

const router = useRouter();
const storeAuth = useAuthStore(); 

// Refs para o formulário
const currentPassword = ref('');
const showAlert = ref(false);
const alertMessage = ref('');

// Cancelar a ação e voltar
const cancel = () => {
  router.push('/profile');
};

// Função para validar e remover a conta
const removeAccount = async () => {

  const PasswordisValid = await storeAuth.validatePassword(currentPassword.value);
  if (!PasswordisValid) {
    alertMessage.value = 'Invalid password. Please try again.';
    showAlert.value = true;
    return;
  }

  // Exibir confirmação ao usuário
  const confirmRemoval = confirm(
    'This action cannot be undone. Are you sure you want to delete your account?'
  );

  if (confirmRemoval) {
    await removeAccountConfirmed();
  }
};

// Confirmação de exclusão
const removeAccountConfirmed = async () => {
  alertMessage.value = 'Your account has been deleted.';
  showAlert.value = true;
  storeAuth.accountRemoval();

  setTimeout(() => {
    router.push('/loginform'); // Redirecionar para a página de login
  }, 2000);
};
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <!-- Botão com a seta para voltar -->
    <button @click="router.push('/profile')"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Account Removal</h2>
      <div class="mb-4">
        <label for="currentPassword" class="block text-gray-700">To delete your account, please insert your current Password</label>
        <input
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          v-model="currentPassword"
          class="w-full mt-2 p-3 border rounded-lg"
        />
      </div>
      <div class="flex justify-between mt-6">
        <button
          @click.prevent="removeAccount"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          Remove Account
        </button>
        <button
          @click.prevent="cancel"
          class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Alerta -->
    <AlertMessage v-if="showAlert" :message="alertMessage" :duration="4000" />
  </div>
</template>
