<template>
  <div>
    <div v-for="image in images" :key="image" @click="selectBackground(image)">
      <img :src="image" :alt="image" class="background-option" />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();

    const selectBackground = (image) => {
      authStore.updateSelectedBackgroundImage(image);
    };

    return {
      images: ['/carta.png', '/carta2.png'],
      selectBackground,
    };
  },
};
</script>
  
  <style scoped>
  .background-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .background-options {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .background-option {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    border: 2px solid black;
    cursor: pointer;
    position: relative;
  }
  
  .background-option.selected {
    border: 2px solid green;
  }
  
  .background-option p {
    position: absolute;
    bottom: 5px;
    left: 5px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px 5px;
    font-size: 12px;
  }
  </style>
  