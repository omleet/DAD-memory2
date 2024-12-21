<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error';

// Stores
const authStore = useAuthStore();
const errorStore = useErrorStore();

// Estado local
const credentials = ref({
    email: '',
    password: ''
})

// Função de login
const login = () => {
    authStore.login(credentials.value).catch((error) => {
        // Use setErrorMessages to set the error
        errorStore.setErrorMessages(
            error.message || 'An error occurred',
            {},
            error.status || 500
        );
    });
}
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Login</h2>

      <form @submit.prevent="login" class="space-y-6">
        <!-- Campo de Email -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            v-model="credentials.email"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p v-if="errorStore.fieldMessage('email')" class="text-red-500 text-sm mt-1">
            {{ errorStore.fieldMessage('email') }}
          </p>
        </div>

        <!-- Campo de Senha -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            v-model="credentials.password"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p v-if="errorStore.fieldMessage('password')" class="text-red-500 text-sm mt-1">
            {{ errorStore.fieldMessage('password') }}
          </p>
        </div>

        <!-- Botões -->
        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>

        <!-- Mensagem de erro geral -->
        <p v-if="errorStore.message" class="text-red-500 mt-4">{{ errorStore.message }}</p>

        <!-- Links para registro e recuperação de senha -->
        <div class="mt-4 text-sm text-gray-600 text-center">
          <p>
            Don't have an account yet? 
            <router-link :to="{ name: 'register' }" class="text-blue-500 hover:text-blue-700">Register here</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
