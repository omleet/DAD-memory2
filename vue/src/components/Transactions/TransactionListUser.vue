<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <!-- Back button -->
    <button @click="router.push('/')"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>

    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Your Transactions</h2>

      <!-- Loading State -->
      <div v-if="transactionStore.loading" class="text-center mb-8">
        <p class="text-gray-600">Loading transactions...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="transactionStore.error" class="text-center mb-8">
        <p class="text-red-600">{{ transactionStore.error }}</p>
      </div>

      <!-- Transactions Table -->
      <div v-else>
        <table v-if="transactionStore.transactions.data?.length > 0" class="transaction-table w-full table-auto text-gray-700 mb-8">
          <thead>
            <tr class="text-left text-sm font-semibold text-gray-800 border-b">
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2">Type</th>
              <th class="px-4 py-2">Brain Coins</th>
              <th class="px-4 py-2">Euros</th>
              <th class="px-4 py-2">Payment Type</th>
              <th class="px-4 py-2">Payment Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactionStore.transactions.data" :key="transaction.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">{{ transactionStore.formatDate(transaction.transaction_datetime) }}</td>
              <td class="px-4 py-2">{{ transaction.type }}</td>
              <td class="px-4 py-2">{{ transaction.brain_coins }}</td>
              <td class="px-4 py-2">{{ transaction.euros || '-' }}</td>
              <td class="px-4 py-2">{{ transaction.payment_type || '-' }}</td>
              <td class="px-4 py-2">{{ transaction.payment_reference || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- No Transactions Found -->
        <div v-else class="text-center text-gray-600">
          <p>No transactions found.</p>
        </div>

        <!-- Pagination Controls -->
        <div v-if="transactionStore.transactions.total > transactionStore.transactions.per_page" class="flex justify-between items-center mt-4">
          <button @click="changePage(transactionStore.currentPage - 1)" :disabled="transactionStore.currentPage === 1"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500">
            Previous
          </button>
          <span class="text-gray-600">
            Page {{ transactionStore.currentPage }} of {{ transactionStore.transactions.last_page }}
          </span>
          <button @click="changePage(transactionStore.currentPage + 1)" :disabled="transactionStore.currentPage === transactionStore.transactions.last_page"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionListStore } from '@/stores/transactionlist';
import { useRouter } from 'vue-router';

// Create an instance of the router and store
const router = useRouter();
const transactionStore = useTransactionListStore();

// Fetch transactions on mount
transactionStore.fetchTransactions();

// Define the changePage function
const changePage = (page) => {
  transactionStore.fetchTransactions(page);
};
</script>


<style scoped>
.transaction-table {
  border-collapse: collapse;
}

.transaction-table th,
.transaction-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.transaction-table th {
  background-color: #f4f4f4;
}

.transaction-table td {
  background-color: #ffffff;
}
</style>
