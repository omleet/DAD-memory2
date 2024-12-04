<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';


const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const nickname = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const submit = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    await authStore.register({ email: email.value, nickname: nickname.value, password: password.value });
    router.push('/profile'); // Redireciona para a página de perfil após o registro
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed';
  }
};
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Register</h2>

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
          <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
          <input
            type="nickname"
            id="nickname"
            v-model="nickname"
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

        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>

        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        <div class="mt-4 text-sm text-gray-600 text-center">
          <p>
            Already have an account yet? 
            <router-link to="/loginform" class="text-blue-500 hover:text-blue-700">Login here</router-link>
          </p>
          
        </div>
      </form>
    </div>
  </div>
</template>
