import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useTransactionListStore = defineStore('transactionList', () => {
  const transactions = ref({});
  const loading = ref(true);
  const error = ref(null);
  const currentPage = ref(1);

  // Fetch Transactions
  const fetchTransactions = async (page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`/transactions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      transactions.value = response.data; // Assign the paginated data
      currentPage.value = page;
    } catch (err) {
      error.value = 'Failed to fetch transactions. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  // Format Date
  const formatDate = (datetime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(datetime).toLocaleDateString(undefined, options);
  };

  return {
    transactions,
    loading,
    error,
    currentPage,
    fetchTransactions,
    formatDate,
  };
});
