<template>
  <div class="flex flex-col items-center p-8 bg-gray-100 rounded-lg shadow-md">
    <h2 class="text-2xl mb-4 text-gray-800 font-bold">Select a card to your liking below!</h2><br>
    <p class="mb-6 text-lg text-gray-700 text-center font-semibold">
      The card that you select will be the background of the game.
    </p><br>
    <div class="flex gap-6 flex-wrap justify-center">
      <div
        v-for="card in cards"
        :key="card.image"
        @click="selectBackground(card.image)"
        :class="['relative w-40 h-56 rounded-3xl overflow-hidden cursor-pointer shadow-lg transform transition-transform duration-300 ease-in-out', { 'border-4 border-green-500': selectedImage === card.image }]">
        <img :src="card.image" :alt="card.image" class="w-full h-full object-cover rounded-3xl" />
        <!-- Display the corresponding text for each card -->
        <p class="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 text-sm rounded-lg shadow-md">
          {{ card.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const selectedImage = ref(null);

// Array of card objects with image and text
const cards = [
  { image: '/carta.png', text: 'Default' },
  { image: '/carta5.png', text: 'Card 1' },
  { image: '/carta4.png', text: 'Card 2' },
  { image: '/carta3.png', text: 'Card 3' },
  { image: '/carta2.png', text: 'Card 4' },
];

// Retrieve the selected card from localStorage when the page loads
onMounted(() => {
  const storedImage = localStorage.getItem('selectedBackgroundImage');
  if (storedImage) {
    selectedImage.value = storedImage;
  }
});

// Update the selected image and store it in localStorage
const selectBackground = (image) => {
  authStore.updateSelectedBackgroundImage(image);
  selectedImage.value = image;  // Update the selected image
  localStorage.setItem('selectedBackgroundImage', image); // Save the selection in localStorage
};
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>