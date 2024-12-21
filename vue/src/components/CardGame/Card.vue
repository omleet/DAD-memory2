<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div 
    class="card w-16 h-28 sm:w-20 sm:h-32 cursor-pointer relative"
    :class="{ 'flipped': isFlipped, 'matched': card.isMatched, 'shuffling': card.isShuffling }"
    @click="$emit('flip')"
  >
    <div class="card-inner w-full h-full transition-transform duration-300 ease-in-out transform-style-preserve-3d">
      <div
        class="card-front w-full h-full absolute top-0 left-0 shadow-lg bg-cover bg-center"
        :style="{
          backgroundImage: `url(${
            card.isFlipped || card.isMatched 
              ? card.image 
              : selectedBackgroundImage
          })`,
        }"
      >
      </div>
      <div class="card-back w-full h-full absolute top-0 left-0 bg-green-600 text-white text-lg font-bold shadow-lg flex items-center justify-center transform rotate-y-180">
        <img
          v-if="card.isFlipped || card.isMatched"
          :src="card.image"
          alt="card image"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

defineProps({
  card: Object,
  isFlipped: Boolean,
});

const authStore = useAuthStore();
const selectedBackgroundImage = computed(() => authStore.userData.selectedBackgroundImage);
</script>


<style scoped>
.card {
  perspective: 1200px;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 8rem;
  
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card.matched {
  animation: disappear 0.5s ease-out forwards;
}

.card.shuffling {
  animation: shuffle-animation 0.8s ease-in-out forwards;
}

@keyframes shuffle-animation {
  0% {
    transform: rotateY(0);
    opacity: 1;
  }

  50% {
    transform: rotateY(180deg);
    opacity: 0.6;
  }

  100% {
    transform: rotateY(0);
    opacity: 1;
  }
}

@keyframes disappear {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem; /* Adjusted font size for smaller cards */
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-front {
  color: white;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid black;
  box-sizing: border-box;
}

.card-back {
  background-color: #cbeeff;
  color: white;
  transform: rotateY(180deg);
  border: 1px solid black;
  box-sizing: border-box;
}
</style>