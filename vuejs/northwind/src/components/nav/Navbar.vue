<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const profileMenuOpen = ref(false);

function toggleProfileMenu() {
    profileMenuOpen.value = !profileMenuOpen.value;
}

// Optional: close profile menu when clicking outside
function handleClickOutside(event: MouseEvent) {
    const profile = document.querySelector('.profile-menu');
    if (profile && !profile.contains(event.target as Node)) {
        profileMenuOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="flex items-center justify-between p-2 md:px-8 bg-[#102841]">
    <!-- Left Side: Logo -->
    <RouterLink to="/">
      <img
        alt="Vue logo"
        src="@/assets/logo.png"
        width="75"
        height="75"
        class="block"
      />
    </RouterLink>

    <!-- Right Side: Navigation and Profile -->
    <div class="flex items-center space-x-6">
      <nav class="flex items-center space-x-6 text-sm text-white">
        <RouterLink
          to="/"
          class="hover:text-blue-400"
          exact-active-class="text-blue-300"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/customers"
          class="hover:text-blue-400"
          exact-active-class="text-blue-300"
        >
          Customer
        </RouterLink>
        <RouterLink
          to="/orders"
          class="hover:text-blue-400"
          exact-active-class="text-blue-300"
        >
          Order
        </RouterLink>

        <!-- Admin with Submenu (hover-based) -->
        <div class="relative group">
          <button class="hover:text-blue-400 flex items-center focus:outline-none">
            Admin
            <svg
              class="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg py-2 z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all"
          >
            <RouterLink
              to="/admin/categories"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Category
            </RouterLink>
            <RouterLink
              to="/admin/products"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Product
            </RouterLink>
            <RouterLink
              to="/admin/shippers"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Shipper
            </RouterLink>
            <RouterLink
              to="/admin/suppliers"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Supplier
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Profile Picture and Dropdown -->
      <div class="relative profile-menu" @click="toggleProfileMenu">
        <img
          src="@/assets/profile.png"
          alt="Profile"
          class="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
        />
        <div
          v-if="profileMenuOpen"
          class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-2 z-20"
        >
          <RouterLink
            to="/login"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
