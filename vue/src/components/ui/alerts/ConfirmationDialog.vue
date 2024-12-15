<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="mb-4">{{ message }}</p>
        <div class="flex justify-between">
          <button @click="cancel" class="px-4 py-2 bg-gray-300 text-black rounded">Cancel</button>
          <button @click="confirm" class="px-4 py-2 bg-red-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isVisible = ref(false);
  const title = ref('');
  const message = ref('');
  const confirmCallback = ref(null);
  
  const showDialog = (titleText, messageText, confirmAction) => {
    title.value = titleText;
    message.value = messageText;
    confirmCallback.value = confirmAction;
    isVisible.value = true;
  };
  
  const confirm = () => {
    if (confirmCallback.value) {
      confirmCallback.value();
    }
    isVisible.value = false;
  };
  
  const cancel = () => {
    isVisible.value = false;
  };
  
  defineExpose({
    showDialog,
  });
  </script>
  
  <style scoped>
  /* Add your styling for modal here */
  </style>
  