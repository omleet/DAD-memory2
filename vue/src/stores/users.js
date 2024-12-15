import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useErrorStore } from '@/stores/error';
import axios from 'axios';

export const useUsersStore = defineStore('admin', () => {
    // Estado reativo
    const errorStore = useErrorStore();
    const users = ref([]);
    const pages = ref(0);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const totalItems = ref(0);
    const searchName = ref('');
    const searchUserType = ref('');

    // Função para carregar usuários
    const loadUsers = async () => {
        errorStore.resetMessages();
        isLoading.value = true;

        try {
            // Construção de parâmetros de consulta
            const queryParams = new URLSearchParams({
                page: currentPage.value,
                ...(searchName.value && { search: searchName.value }),
                ...(searchUserType.value && { type: searchUserType.value }),
            });

            // Requisição para buscar usuários
            const response = await axios.get(`/users?${queryParams.toString()}`);
            const { data, meta } = response.data;

            // Atualização do estado
            users.value = data;
            pages.value = meta.last_page;
            currentPage.value = meta.current_page;
            totalItems.value = meta.total;
        } catch (e) {
            const { data, status } = e.response || {};
            errorStore.setErrorMessages(
                data?.message || 'An error occurred.',
                data?.errors || null,
                status || 500,
                'Getting Users Error!'
            );
        } finally {
            isLoading.value = false;
        }
    };

    // Função para mudar para a próxima página
    const nextPage = async () => {
        if (currentPage.value < pages.value) {
            currentPage.value++;
            await loadUsers();
        }
    };

    // Função para voltar para a página anterior
    const previousPage = async () => {
        if (currentPage.value > 1) {
            currentPage.value--;
            await loadUsers();
        }
    };

    // Função para ir para uma página específica
    const toPage = async (page) => {
        if (page >= 1 && page <= pages.value) {
            currentPage.value = page;
            await loadUsers();
        }
    };

    // Função para remover um usuário
    const removeUser = async (id) => {
        errorStore.resetMessages();

        try {
            await axios.delete(`/users/${id}`);
            await loadUsers();
            return true;
        } catch (e) {
            const { data, status } = e.response || {};
            errorStore.setErrorMessages(
                data?.message || 'An error occurred.',
                data?.errors || null,
                status || 500,
                'Removing User Error!'
            );
            return false;
        }
    };

    // Função para bloquear/desbloquear um usuário
    const toggleBlockUser = async (id) => {
        errorStore.resetMessages();

        try {
            await axios.post(`/users/${id}/block`);
            await loadUsers();
            return true;
        } catch (e) {
            const { data, status } = e.response || {};
            errorStore.setErrorMessages(
                data?.message || 'An error occurred.',
                data?.errors || null,
                status || 500,
                'Blocking User Error!'
            );
            return false;
        }
    };

    // Retorno dos estados e funções
    return {
        loadUsers,
        users,
        pages,
        currentPage,
        isLoading,
        nextPage,
        previousPage,
        toPage,
        totalItems,
        removeUser,
        toggleBlockUser,
        searchName,
        searchUserType,
    };
});
