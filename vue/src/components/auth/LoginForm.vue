<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const submit = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/profile'); // Redireciona para a página de perfil
  } catch (error) {
    errorMessage.value = error.message || 'Invalid credentials';
  }
};


</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Login</h2>

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

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>

        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>

        <!-- Links para login e recuperação de senha -->
        <div class="mt-4 text-sm text-gray-600 text-center">
          <p>
            Don't have an account yet? 
            <router-link to="/register" class="text-blue-500 hover:text-blue-700">Register here</router-link>
          </p>
          <p>
            Forgot your password? 
            <router-link to="/passwordrecovery" class="text-blue-500 hover:text-blue-700">Recover password</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
