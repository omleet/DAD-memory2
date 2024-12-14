<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { useAuthStore } from '@/stores/auth';
import AlertMessage from '@/components/ui/alerts/AlertMessage.vue';
import { ref } from 'vue';

const storeAuth = useAuthStore();
const showAlert = ref(false);
const alertMessage = ref('');


</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg">
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 ">Profile</h2>

      <div class="bg-white p-6 rounded-lg shadow-lg">
        <!-- Imagem do Perfil -->
        <div class="flex justify-center mb-6">
          <img :src="storeAuth.userPhotoUrl" alt="User Avatar" class="w-20 h-20 rounded-full" />
        </div>

        <!-- Detalhes do Perfil -->
        <div class="space-y-4">
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Name:</span>
            <span class="text-gray-900">{{ storeAuth.userFirstLastName }}</span>
          </div>
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Nickname:</span>
            <span class="text-gray-900">{{ storeAuth.nickname }}</span>
          </div>
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Email:</span>
            <span class="text-gray-900">{{ storeAuth.userEmail }}</span>
          </div>
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Type:</span>
            <span class="text-gray-900">{{ storeAuth.userType == 'A' ? 'Admin' : 'Player' }}</span>
          </div>
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Brain Coins Balance:</span>
            <span class="text-gray-900">{{ storeAuth.balance }}</span>
          </div>
          <div  class="flex items-center justify-between">
            <span class="font-bold text-gray-900">Games Won:</span>
            <span class="text-green-800 font-bold">{{ storeAuth.gamesWon }}</span>
          </div>
        </div>

        <!-- Botão de Edição -->
        <div class="flex justify-center mt-6">
          <RouterLink to="/profileedit">
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0,0,1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0,0-1.727,0L10.47,3.91Z"
                  transform="translate(3.25 3.25)"
                  fill="#FFFFFF"
                />
              </svg>
              <span>Edit Profile</span>
            </button>
          </RouterLink>
        </div>
        <div v-show="storeAuth.canUserDeleteOwnAccount()" class="flex justify-center mt-6">
          <RouterLink to="/accountdelete">
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0,0,1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0,0-1.727,0L10.47,3.91Z"
                  transform="translate(3.25 3.25)"
                  fill="#FFFFFF"
                />
              </svg>
              <span>Delete Account</span>
            </button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Alerta -->
    <AlertMessage v-if="showAlert" :message="alertMessage" :duration="4000" />
  </div>
</template>
