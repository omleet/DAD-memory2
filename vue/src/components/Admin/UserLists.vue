<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-lg relative">
    <button @click="router.push({ name: 'admintab'});"
      class="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
        <path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" />
      </svg>
    </button>
    <div class="max-w-4xl mx-auto py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">Search Users</h2>

      <!-- Search Form -->
      <div class="mb-6">
        <h5 class="text-lg text-gray-800">Filter by name</h5>
        <div class="relative mb-4">
          <input type="text" v-model="userStore.searchName" placeholder="Search by name"
            class="w-full p-2 border rounded dark:bg-slate-300" />
          <svg v-if="userStore.searchName" @click="clearSearchName" xmlns="http://www.w3.org/2000/svg" height="24px"
            viewBox="0 -960 960 960" width="24px" fill="currentColor"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer hover:text-red-700">
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </div>

        <h5 class="text-lg text-gray-800">Filter by type</h5>
        <div class="relative mb-4">
          <select v-model="userStore.searchUserType" class="w-full p-2 border rounded dark:bg-slate-300">
            <option value="">All Users</option>
            <option value="A">Admin</option>
            <option value="P">Player</option>
          </select>
        </div>

        <div class="relative mb-4 flex justify-end">
          <button @click="handleKeyUp" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>

      <!-- User Table -->
      <div class="overflow-x-auto">
        <div v-if="userStore.isLoading" class="flex justify-center items-center h-32">
          <p>Loading users...</p> <!-- You can style this message as you wish -->
        </div>

        <table v-if="!userStore.isLoading" class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th class="w-[150px] md:w-[200px] p-2 text-left text-xs md:text-sm">ID</th>
              <th class="p-2 text-left text-xs md:text-sm">Type</th>
              <th class="p-2 text-left text-xs md:text-sm">Name</th>
              <th class="p-2 text-left text-xs md:text-sm">Email</th>
              <th class="p-2 text-left text-xs md:text-sm">Nickname</th>
              <th class="p-2 text-left text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users.filter(user => user.id !== currentUserId)" :key="user.id">
              <td class="p-2 text-xs md:text-sm">{{ user.id }}</td>
              <td class="p-2 text-xs md:text-sm">{{ user.type }}</td>
              <td class="p-2 text-xs md:text-sm">{{ user.name }}</td>
              <td class="p-2 text-xs md:text-sm">{{ user.email }}</td>
              <td class="p-2 text-xs md:text-sm">{{ user.nickname }}</td>
              <td class="p-2 text-xs md:text-sm">
                <div class="flex items-center space-x-2">
                  <button @click="removeAccount(user.id)"
                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                    Remove Account
                  </button>
                  <button @click="toggleBlockUser(user)"
                    :class="user.blocked ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400'"
                    class="text-white px-2 py-1 rounded focus:outline-none focus:ring-2">
                    {{ user.blocked ? 'Unblock' : 'Block' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!userStore.isLoading" class="flex justify-center mt-4 gap-1 rounded">
        <button @click="userStore.toPage(1)"
          class="px-4 py-2 bg-gray-500 text-white  hover:bg-gray-600 rounded">First</button>
        <button @click="userStore.previousPage"
          class="px-4 py-2 bg-gray-500 text-white  hover:bg-gray-600 rounded">Prev</button>

        <button v-for="page in visiblePages" :key="page" @click="userStore.toPage(page)"
          :class="userStore.currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'"
          class="px-4 py-2 mx-1 rounded">
          {{ page }}
        </button>

        <button @click="userStore.nextPage"
          class="px-4 py-2 bg-gray-500 text-white  hover:bg-gray-600 rounded">Next</button>
        <button @click="userStore.toPage(userStore.pages)"
          class="px-4 py-2 bg-gray-500 text-white  hover:bg-gray-600 rounded">Last</button>
      </div>
      <ConfirmationDialog ref="confirmationDialog" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ConfirmationDialog from '@/components/ui/alerts/ConfirmationDialog.vue';

const router = useRouter()
const userStore = useUsersStore()
const storeAuth = useAuthStore()
const { toast } = useToast()

// Create a ref for the ConfirmationDialog component
const confirmationDialog = ref(null);

const visiblePages = computed(() => {
  const totalPages = userStore.pages.length;
  const currentPage = userStore.currentPage;
  const maxVisible = 5; // Number of page numbers to show at once

  const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Adjust the start page if we are near the last pages
  const adjustedStartPage = Math.max(1, endPage - maxVisible + 1);

  return Array.from({ length: endPage - adjustedStartPage + 1 }, (_, i) => adjustedStartPage + i);
});

// Computed for the current user ID to avoid listing it in the table
const currentUserId = computed(() => storeAuth.user.id)

// Search query binding


// Handle key up event for initiating user load
const handleKeyUp = () => {
  userStore.currentPage = 1
  userStore.loadUsers()
}

// Clear search name and reset pagination
const clearSearchName = () => {
  userStore.searchName = ''
  userStore.currentPage = 1
  userStore.loadUsers()
}

// Remove user account and show a success toast
const removeAccountConfirmed = async (id) => {
  try {
    await userStore.removeUser(id);
    toast({
      description: `User ${id} Removed!`
    });
    userStore.toPage(1);
  } catch (error) {
    console.error('Error removing account:', error);
  }
};

// Handle user removal
const removeAccount = (id) => {
  const dialog = confirmationDialog.value; // Use ref to access the dialog
  dialog.showDialog(
    'Are you certain you want to proceed??',
    `This action cannot be reversed. This will result in the permanent removal of the user profile.`,
    () => removeAccountConfirmed(id) // Pass the id to confirm action
  );
};

// Toggle block/unblock user and show success toast
const toggleBlockUserConfirmed = async (user) => {
  try {
    await userStore.toggleBlockUser(user.id);
    toast({
      description: `User ${user.id} ${user.blocked ? 'Unblocked' : 'Blocked'}!`
    });
    userStore.toPage(1);
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
  }
};

const toggleBlockUser = (user) => {
  const action = user.blocked ? 'Unblock' : 'Block';
  const dialog = confirmationDialog.value; // Use ref to access the dialog
  dialog.showDialog(
    'Are you certain you want to proceed??',
    `This action cannot be reversed. This will result in ${action.toUpperCase()} of the user profile.`,
    () => toggleBlockUserConfirmed(user)
  );
};

// Initialize the loading of users when the component is created
userStore.loadUsers()

</script>
