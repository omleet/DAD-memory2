<script setup>
import { ref, defineProps} from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  userType: {
    type: String,
    default: 'P'
  }
})

const storeAuth = useAuthStore()
const storeError = useErrorStore()
const previewUrl = ref(null)
const confirmPassword = ref('')

const credentials = ref({
  email: '',
  password: '',
  name: '',
  nickname: '',
  type: props.userType,
  photo_filename: null
})

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      credentials.value.photo_filename = reader.result
      previewUrl.value = reader.result // Set the preview URL
    }
    reader.readAsDataURL(file)
  } else {
    storeError.setErrorMessages('The selected file must be an image.')
    credentials.value.photo_filename = null
    previewUrl.value = null // Clear the preview URL
  }
}

const register = () => {
  if (credentials.value.password.length < 8) {
    storeError.setErrorMessages('Password must be at least 8 characters long.');
    return;
  }
  if (credentials.value.password !== confirmPassword.value) {
    storeError.setErrorMessages('Passwords do not match.');
    return;
  }
  storeAuth.register(credentials.value)
  credentials.value = {
    email: '',
    password: '',
    name: '',
    nickname: '',
    type: props.userType,
    photo_filename: null
  }
  confirmPassword.value = ''
}

</script>


<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <button v-if="storeAuth.isAdministrator()" @click="router.push({ name: 'admintab'});"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
    <div class="max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        {{ storeAuth.isAdministrator() ? 'Register a new Administrator' : 'Register' }}
      </h2>

      <form @submit.prevent="register" class="space-y-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" id="email" v-model="credentials.email" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
          <input type="text" id="name" v-model="credentials.name" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="space-y-2">
          <label for="nickname" class="block text-sm font-medium text-gray-700">Nickname:</label>
          <input type="text" id="nickname" v-model="credentials.nickname" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input type="password" id="password" v-model="credentials.password" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        <div class="space-y-2">
          <label for="photo_filename" class="block text-sm font-medium text-gray-700">
      {{ storeAuth.isAdministrator() ? 'Insert the admin photo or avatar:' : 'Insert your photo or avatar:' }}
    </label>
          <input type="file" id="photo_filename" @change="onFileChange"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer" />
          <div v-if="previewUrl" class="mt-4 text-center">
            <label class="text-gray-700 block">Image Preview:</label>
            <img :src="previewUrl" alt="Image Preview" class="w-24 h-24 rounded-full mx-auto" />
          </div>
        </div>

        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Register
        </button>

        <div v-if="!storeAuth.isAdministrator()" class="mt-4 text-sm text-gray-600 text-center">
          <p>
            Already have an account yet?
            <router-link :to="{ name: 'loginform' }" class="text-blue-500 hover:text-blue-700">Login here</router-link>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>