<template>
  <div class="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-xl max-w-full mx-auto my-6">
    <h1 class="text-3xl sm:text-4xl text-gray-800 mb-6">Card Matching Game</h1>

    <div class="flex items-center justify-center gap-6 mb-8 text-sm sm:text-lg">
      <span class="text-gray-600 flex items-center">
        <span class="mr-2">⏱</span> Time: <span class="ml-1">{{ timer }}s</span>
      </span>
      <span class="text-gray-600 flex items-center">
        <span class="mr-2">🃏</span> Moves: <span class="ml-1">{{ moves }}</span>
      </span>
      <span class="text-gray-600 flex items-center">
        <span class="mr-2">❌</span> Mistakes: <span class="ml-1">{{ mistakes }}</span>
      </span>
    </div>


    <div class="grid gap-4 mb-8" :style="boardStyle">
      <Card v-for="(card, index) in cards" :key="index" :card="card" :class="{ matched: card.isMatched }"
        :is-flipped="card.isFlipped || card.isMatched" @flip="handleCardFlip(index)" />
    </div>

    <div class="mt-6">
      <button @click="resetGame"
        class="bg-blue-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
        🔄 Reset Game
      </button>
    </div>

    <div v-if="isGameComplete" class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div class="bg-white rounded-xl p-6 text-center shadow-xl max-w-lg w-full">
        <h2 class="text-3xl sm:text-4xl text-green-500 mb-4">🎉 Congratulations! 🎉</h2>
        <p class="text-lg text-gray-600 mb-5">You completed the game!</p>
        <div class="text-lg text-gray-700 mb-6">
          <p><strong>⏱️ Time:</strong> {{ timer }} seconds</p>
          <p><strong>🖐️ Moves:</strong> {{ moves }}</p>
          <p><strong>❌ Mistakes:</strong> {{ mistakes }}</p>
          <p><strong>🎯 Pairs Found:</strong> {{ gridSize / 2 }}</p>
        </div>
        <button @click="resetGame"
          class="bg-blue-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          🔄 Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import Card from './Card.vue';

const props = defineProps({
  gridSize: {
    type: Number,
    default: 12, // Tamanho padrão da grade (4x3)
  },
});

const generateCards = (gridSize) => {
  const values = Array.from({ length: gridSize / 2 }, (_, i) => i + 1);
  const shuffled = [...values, ...values].sort(() => Math.random() - 0.5);
  return shuffled.map(value => ({
    value,
    isFlipped: false,
    isMatched: false,
  }));
};
/*
const generateCards = (gridSize) => {
  const imagePaths = [
    '/vue/public/1.jpg',
    '/vue/public/2.jpg',
    '/vue/public/3.jpg',
    '/vue/public/4.jpg',
    '/vue/public/5.jpg',
    '/vue/public/6.jpg',
    '/vue/public/7.jpg',
    '/vue/public/8.jpg',
    '/vue/public/9.jpg',
    '/vue/public/10.jpg',
    // Adicione mais imagens conforme necessário
  ];
*/

const cards = reactive([]);
const flippedCards = reactive([]);
const timer = ref(0);
const moves = ref(0);
const mistakes = ref(0);
const timerStarted = ref(false);
let timerInterval = null;

const boardStyle = computed(() => {
  const columns = Math.ceil(Math.sqrt(props.gridSize)); // Número de colunas baseado na grade
  return {
    gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))`, // Tamanho mínimo de 120px por carta
    gap: '10px',
  };
});

const isGameComplete = computed(() => {
  return cards.every(card => card.isMatched);
});

// Função que embaralha as cartas
const shuffleCards = () => {
  cards.forEach(card => (card.isShuffling = true));
  setTimeout(() => {
    const shuffled = [...generateCards(props.gridSize)];
    cards.splice(0, cards.length, ...shuffled);
  }, 500);
};

onMounted(() => {
  cards.splice(0, cards.length, ...generateCards(props.gridSize)); // Gera as cartas
  shuffleCards(); // Embaralha as cartas após a geração
});

const handleCardFlip = index => {
  const card = cards[index];
  if (card.isFlipped || card.isMatched || flippedCards.length === 2) return; // Não vira cartas se já estiverem viradas ou se já houver 2 cartas viradas

  card.isFlipped = true; // Vira a carta
  flippedCards.push(index); // Adiciona o índice da carta na lista das cartas viradas

  if (!timerStarted.value) {
    timerStarted.value = true;
    startTimer();
  }

  if (flippedCards.length === 2) {
    moves.value += 1;
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.value === secondCard.value) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      flippedCards.length = 0; // Limpa as cartas viradas
    } else {
      mistakes.value += 1;
      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        flippedCards.length = 0; // Limpa as cartas viradas
      }, 1000); // Diminui a visibilidade das cartas por 1 segundo
    }
  }

  if (isGameComplete.value) {
    stopTimer();
  }
};

const resetGame = () => {
  cards.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });

  moves.value = 0;
  mistakes.value = 0;
  timer.value = 0;
  timerStarted.value = false;

  setTimeout(() => {
    cards.splice(0, cards.length, ...generateCards(props.gridSize));
    shuffleCards(); // Embaralha as cartas após a regeneração
  }, 700);

  clearInterval(timerInterval);
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timer.value += 1;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>


<style scoped>
.grid {
  display: grid;
  /* Assegura que as cartas se ajustem ao tamanho da tela */
  justify-items: center;
  align-items: center;
}
</style>
