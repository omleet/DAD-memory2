<template>
  <div class="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-xl max-w-full mx-auto my-6 relative">
    <!-- Botão com a seta para voltar -->
    <button @click="router.back"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
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

    <div v-if="isInactivityPopupVisible"
      class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div class="bg-white rounded-xl p-6 text-center shadow-xl max-w-lg w-full">
        <h2 class="text-3xl sm:text-4xl text-red-500 mb-4">⚠️ Attention!</h2>
        <p class="text-lg text-gray-600 mb-5">
          The game will end in {{ maxInactivityTime - inactivityTimer }} seconds!
        </p>
        <button @click="resetInactivityTimer"
          class="bg-blue-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
          Continue Playing...
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import Card from './Card.vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';


const props = defineProps({
  gridSize: {
    type: Number,
    required: true
  }
});
const router = useRouter();
const gameStore = useGameStore();

const inactivityTimer = ref(0);
const maxInactivityTime = 21;
const inactivityWarningTime = 10;
const isInactivityPopupVisible = ref(false);
let inactivityInterval = null;

const hasGameStarted = ref(false);
const gameStartTime = ref(null);

const timer = ref(0);
const moves = ref(0);
const mistakes = ref(0);
const timerStarted = ref(false);
let timerInterval = null;

const cards = reactive([]);
const flippedCards = reactive([]);

const boardStyle = computed(() => {
  const columns = Math.ceil(Math.sqrt(12)); 
  return {
    gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))`,
    gap: '10px',
  };
});

const isGameComplete = computed(() => {
  return cards.every(card => card.isMatched);
});

const startInactivityTimer = () => {
  inactivityInterval = setInterval(() => {
    inactivityTimer.value += 1;

    if (inactivityTimer.value >= inactivityWarningTime && !isInactivityPopupVisible.value) {
      isInactivityPopupVisible.value = true;
    }

    if (inactivityTimer.value >= maxInactivityTime) {
      endGame();
    }
  }, 1000);
};

const stopInactivityTimer = () => {
  clearInterval(inactivityInterval);
};

const resetInactivityTimer = () => {
  inactivityTimer.value = 0;
  isInactivityPopupVisible.value = false;
};

const endGame = () => {
  stopInactivityTimer();
  stopTimer();
  alert("The game ended for inactivity!");
  resetGame();
};

const formatDateForMySQL = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const handleGameCompletion = async () => {
  stopTimer();
  stopInactivityTimer();

  const gameData = {
  winner_user_id: null, // Single-player game
  type: 'S',
  status: 'E',
  began_at: formatDateForMySQL(gameStartTime.value),  // Correct format
  ended_at: formatDateForMySQL(new Date()), // Correct format
  total_time: timer.value,
  board_id: 1,
  total_turns_winner: moves.value,
  
  custom: JSON.stringify({ mistakes: mistakes.value, gridSize: props.gridSize }), // Correct reference
};

  await gameStore.submitGame(gameData);

  if (gameStore.success) {
    console.log(gameStore.success);
  } else if (gameStore.error) {
    console.error(gameStore.error);
  }
};

const resetGame = () => {
  resetInactivityTimer();
  stopInactivityTimer();
  cards.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });
  moves.value = 0;
  mistakes.value = 0;
  timer.value = 0;
  timerStarted.value = false;
  hasGameStarted.value = false;

  setTimeout(() => {
    cards.splice(0, cards.length, ...generateCards(props.gridSize));  // Use gridSize from props
  }, 700);

  clearInterval(timerInterval);
};


const generateCards = (gridSize) => {
  const imagePaths = [
    '/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg',
    '/images/6.jpg', '/images/7.jpg', '/images/8.jpg', '/images/9.jpg', '/images/10.jpg',
    '/images/11.jpg', '/images/12.jpg', '/images/13.jpg', '/images/14.jpg', '/images/15.jpg', 
    '/images/16.jpg', '/images/17.jpg', '/images/18.jpg', '/images/19.jpg', '/images/20.jpg',
  ];

  const totalCards = gridSize % 2 === 0 ? gridSize : gridSize - 1;
  const images = [...imagePaths.slice(0, totalCards / 2), ...imagePaths.slice(0, totalCards / 2)];
  const shuffled = images.sort(() => Math.random() - 0.5);
  
  return shuffled.map(image => ({
    image,
    isFlipped: false,
    isMatched: false,
    className: 'rounded-card',
  }));
};

const handleCardFlip = index => {
  resetInactivityTimer();

  if (!gameStartTime.value && hasGameStarted.value) {
    gameStartTime.value = new Date().toISOString();
  }

  const card = cards[index];
  if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

  if (!hasGameStarted.value) {
    hasGameStarted.value = true;
    startInactivityTimer();
  }

  card.isFlipped = true;
  flippedCards.push(index);

  if (!timerStarted.value) {
    timerStarted.value = true;
    startTimer();
  }

  if (flippedCards.length === 2) {
    moves.value += 1;
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.image === secondCard.image) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      flippedCards.length = 0;
    } else {
      mistakes.value += 1;
      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        flippedCards.length = 0;
      }, 1000);
    }
  }

  if (isGameComplete.value) {
    stopTimer();
    stopInactivityTimer();
    handleGameCompletion();
  }
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timer.value += 1;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

onMounted(() => {
  cards.splice(0, cards.length, ...generateCards(props.gridSize));  // Use gridSize from props
});

onUnmounted(() => {
  stopTimer();
  stopInactivityTimer();
});
</script>
