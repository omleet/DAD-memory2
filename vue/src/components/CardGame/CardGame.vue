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
import { useRouter } from 'vue-router'
const router = useRouter()

const inactivityTimer = ref(0); // Tempo atual de inatividade
const maxInactivityTime = 21; // Tempo total para encerrar o jogo
const inactivityWarningTime = 10; // Tempo para mostrar o aviso
const isInactivityPopupVisible = ref(false); // Controle de visibilidade do aviso
let inactivityInterval = null; // Intervalo para monitorar a inatividade
const hasGameStarted = ref(false); // Indica se o jogador já começou o jogo


const startInactivityTimer = () => {
  inactivityInterval = setInterval(() => {
    inactivityTimer.value += 1;

    // Mostrar o aviso após 10 segundos
    if (inactivityTimer.value >= inactivityWarningTime && !isInactivityPopupVisible.value) {
      isInactivityPopupVisible.value = true; // Mostra o popup
    }

    // Finalizar o jogo após 22 segundos
    if (inactivityTimer.value >= maxInactivityTime) {
      endGame(); // Finaliza o jogo
    }
  }, 1000);
};

const resetInactivityTimer = () => {
  inactivityTimer.value = 0; // Reseta o contador de inatividade
  isInactivityPopupVisible.value = false; // Esconde o popup se estiver visível
};

const stopInactivityTimer = () => {
  clearInterval(inactivityInterval); // Para o intervalo de inatividade
};


const endGame = () => {
  stopInactivityTimer(); // Para o timer de inatividade
  stopTimer(); // Para o cronômetro do jogo

  cards.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });

  alert("The game ended for inactivity!");
  resetGame(); // Reinicia o jogo
  
};



const props = defineProps({
  gridSize: {
    type: Number,
    default: 12, // Tamanho padrão da grade (4x3)
  },
});



const generateCards = (gridSize) => {
  // Número de cartas deve ser `gridSize / 2` porque estamos criando pares de cartas
  const imagePaths = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
    '/images/11.jpg',
    '/images/12.jpg',
    '/images/13.jpg',
    '/images/14.jpg',
    '/images/15.jpg',
    '/images/16.jpg',
    '/images/17.jpg',
    '/images/18.jpg',
    '/images/19.jpg',
    '/images/20.jpg',

    // Adicione mais imagens conforme necessário
  ];

  // Garantir que o gridSize tenha o valor adequado
  const totalCards = gridSize % 2 === 0 ? gridSize : gridSize - 1; // Garante que o número de cartas seja par
  const images = [...imagePaths.slice(0, totalCards / 2), ...imagePaths.slice(0, totalCards / 2)];

  const shuffled = images.sort(() => Math.random() - 0.5); // Embaralhar as cartas
  return shuffled.map(image => ({
    image,  // Agora cada carta tem uma imagem
    isFlipped: false,
    isMatched: false,
    className: 'rounded-card',
  }));
};


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
  resetInactivityTimer(); // Reseta o cronómetro de inatividade

  const card = cards[index];
  if (card.isFlipped || card.isMatched || flippedCards.length === 2) return; // Evita virar cartas inválidas

  // Inicia o cronómetro de inatividade na primeira jogada
  if (!hasGameStarted.value) {
    hasGameStarted.value = true;
    startInactivityTimer(); // Agora o cronómetro de inatividade só começa aqui
  }

  card.isFlipped = true; // Vira a carta
  flippedCards.push(index); // Adiciona o índice da carta à lista das cartas viradas

  if (!timerStarted.value) {
    timerStarted.value = true;
    startTimer(); // Inicia o cronómetro do jogo
  }

  if (flippedCards.length === 2) {
    moves.value += 1;
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.image === secondCard.image) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      flippedCards.length = 0; // Limpa as cartas viradas
    } else {
      mistakes.value += 1;
      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        flippedCards.length = 0; // Limpa as cartas viradas
      }, 1000); // Espera 1 segundo antes de virar as cartas novamente
    }
  }

  if (isGameComplete.value) {
    stopTimer();
    stopInactivityTimer(); // Para o cronómetro de inatividade ao finalizar o jogo
  }
};




const resetGame = () => {
  resetInactivityTimer(); // Reseta o cronómetro de inatividade
  stopInactivityTimer(); // Certifica-se de que o cronómetro esteja parado

  cards.forEach(card => {
    card.isFlipped = false;
    card.isMatched = false;
  });

  moves.value = 0;
  mistakes.value = 0;
  timer.value = 0;
  timerStarted.value = false;
  hasGameStarted.value = false; // Marca que o jogo ainda não começou

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
  stopInactivityTimer();
});




</script>


<style scoped>
.grid {
  display: grid;
  justify-items: center;
  align-items: center;
}
</style>
