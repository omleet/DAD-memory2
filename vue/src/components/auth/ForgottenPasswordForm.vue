<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();


const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const submit = async () => {
  try {
    // Aqui você pode implementar a lógica para enviar a solicitação de recuperação de senha
    await authStore.recoverPassword({ email: email.value });
    successMessage.value = 'We have sent you an email with recovery instructions.';
  } catch (error) {
    errorMessage.value = error.message || 'Failed to recover password';
  }
};
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Recover Your Password</h2>

      <form @submit.prevent="submit" class="space-y-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Recover Password
        </button>

        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
      </form>

      <div class="mt-4 text-sm text-gray-600 text-center">
        <p>
          Remember your password? 
          <router-link to="/loginform" class="text-blue-500 hover:text-blue-700">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
