import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionListStore = defineStore('transactionList', {
  state: () => ({
    transactions: {},
    loading: true,
    error: null,
    currentPage: 1,
  }),

  actions: {
    async fetchTransactions(page = 1) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/transactions?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.transactions = response.data; // Assign the paginated data
        this.currentPage = page;
      } catch (err) {
        this.error = 'Failed to fetch transactions. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    formatDate(datetime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(datetime).toLocaleDateString(undefined, options);
    },
  },
});
