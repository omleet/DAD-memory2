<script setup>
import { ref, inject } from 'vue'
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const socket = inject('socket')

const message = ref('WebSocket connection is working!')
const responseData = ref('')

const send = () => {
    socket.emit('echo', message.value)
}

socket.on('echo', (message) => {
    responseData.value = message
})

</script>

<template>
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
        <!-- Botão com a seta para voltar -->
    <button @click="router.push({ name: 'home'});"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
    <div class="max-w-2xl mx-auto py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">WebSockets</h2>

        <div class="mb-6 flex items-center space-x-2">
            <div class="flex items-center">
                <div class="h-2.5 w-2.5 rounded-full  mr-2 animate-pulse"
                    :class="{ 'bg-green-500': socket.connected, 'bg-red-500': !socket.connected, }"></div>
                <span class="text-sm text-gray-600"> {{ (!socket.connected) ? 'Not' : '' }} Connected</span>
            </div>
        </div>

        <form class="space-y-6">
            <div class="space-y-2">
                <label for="message" class="block text-sm font-medium text-gray-700">
                    Message:
                </label>
                <div class="flex space-x-4">
                    <input type="text" id="message" v-model="message"
                        class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Type your message here...">
                    <Button @click.prevent="send" type="submit">Send </Button>
                </div>
            </div>

            <div v-if="responseData" class="space-y-2 mt-8">
                <div class="flex justify-between items-center mb-2">
                    <label for="response" class="block text-sm font-medium text-gray-700">
                        Response
                    </label>
                    <span class="text-xs text-gray-500">Real-time updates</span>
                </div>
                <textarea :value="responseData" id="response" rows="5"
                    class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    readonly></textarea>
            </div>
        </form>
    </div>
</div>
</template>