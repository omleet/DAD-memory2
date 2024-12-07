<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Descomente se necessário
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';

const router = useRouter();
const storeAuth = useAuthStore(); // Use isso se tiver a store configurada

// Refs para o formulário
const currentPassword = ref('');
const showAlert = ref(false);
const alertMessage = ref('');

// Cancelar a ação e voltar
const cancel = () => {
  router.back();
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
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Account Removal</h2>
      <div class="mb-4">
        <label for="currentPassword" class="block text-gray-700">Your Current Password</label>
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
          class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Remove Account
        </button>
        <button
          @click.prevent="cancel"
          class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Alerta -->
    <AlertMessage v-if="showAlert" :message="alertMessage" :duration="4000" />
  </div>
</template>
