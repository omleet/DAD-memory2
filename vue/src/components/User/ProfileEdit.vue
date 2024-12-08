<script setup>
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'


const storeAuth = useAuthStore()
const storeError = useErrorStore()
const router = useRouter()

const credentials = ref({
    email: '',
    name: '',
    nickname: '',
    photo_filename: null,
})

const previewUrl = ref(null) // URL para preview da imagem


const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
            credentials.value.photo_filename = reader.result
            previewUrl.value = reader.result // Define a URL para preview
        }
        reader.readAsDataURL(file)
    } else {
        storeError.setErrorMessages('The selected file must be an image.')
        credentials.value.photo_filename = null
        previewUrl.value = null
    }
}



const ProfileUpdate = async () => {
    await storeAuth.ProfileUpdate(credentials.value)
    alert('Profile updated successfully!')
}


if (!storeAuth.user) {
    router.push('/')  // Redireciona para a página home se o usuário não estiver autenticado
}
</script>

<template>
    <div v-if="storeAuth.user" class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <!-- Botão com a seta para voltar -->
        <button @click="router.push('/profile')"
            class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
                <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
            </svg>
        </button>
        <div class="max-w-2xl mx-auto py-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile Edit</h2>

            <div class="bg-white p-6 rounded-lg shadow-lg">
                <!-- Formulário de Edição -->
                <div class="space-y-4">
                    <div class="flex flex-col space-y-1.5">
                        <label class="font-bold text-gray-900">Update Name</label>
                        <input type="text" placeholder="New Name" v-model="credentials.name"
                            class="border border-gray-300 p-2 rounded" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <label class="font-bold text-gray-900">Update Nickname</label>
                        <input type="text" placeholder="New Nickname" v-model="credentials.nickname"
                            class="border border-gray-300 p-2 rounded" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <label class="font-bold text-gray-900">Update Email</label>
                        <input type="email" placeholder="New Email" v-model="credentials.email"
                            class="border border-gray-300 p-2 rounded" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <label class="font-bold text-gray-900">Update Photo</label>
                        <input type="file" @change="onFileChange" class="border border-gray-300 p-2 rounded" />
                        <!-- Pré-visualização da Imagem -->
                        <div v-if="previewUrl" class="mt-4 text-center">
                            <label class="text-gray-700">Image Preview</label>
                            <img :src="previewUrl" alt="Preview" class="w-24 h-24 rounded-full mx-auto" />
                        </div>
                    </div>
                </div>

                <!-- Botão Confirmar -->
                <div class="flex justify-center mt-6">
                    <Button @click.prevent="ProfileUpdate"
                        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Confirm Changes
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
