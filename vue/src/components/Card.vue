<template>
  <div class="card w-30 h-45 cursor-pointer relative" 
       :class="{ 'flipped': isFlipped, 'matched': card.isMatched, 'shuffling': card.isShuffling }"
       @click="$emit('flip')">
    <div class="card-inner w-full h-full transition-transform duration-300 ease-in-out transform-style-preserve-3d">
      <div class="card-front w-full h-full absolute top-0 left-0 rounded-lg shadow-lg bg-cover bg-center"
           style="background-image: url('/carta.png');">
      </div>
      <div class="card-back w-full h-full absolute top-0 left-0 bg-green-600 text-white text-2xl font-bold rounded-lg shadow-lg flex items-center justify-center transform rotate-y-180">
        {{ card.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  card: Object,
  isFlipped: Boolean,
});
</script>

<style scoped>
.card {
  width: 120px;
  height: 180px;
  perspective: 1200px;
  cursor: pointer;
  transition: transform 0.3s ease;
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

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-front {
  background-image: url('/carta.png');
  color: white;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid black;
  box-sizing: border-box;
}

.card-back {
  background-color: #269e58;
  color: white;
  transform: rotateY(180deg);
  border: 1px solid black;
  box-sizing: border-box;
}
</style>
