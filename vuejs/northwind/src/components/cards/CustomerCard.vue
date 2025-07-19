<script setup lang="ts">
defineProps<{
  customer: {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string | null;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string | null;
  };
}>();
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
    <!-- Header Section -->
    <div class="flex items-center gap-4">
      <!-- Profile Picture -->
      <div class="w-16 h-16 aspect-square rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-blue-600 text-white text-xl font-bold">
        <img
          v-if="customer.PhotoURL"
          :src="customer.PhotoURL"
          alt="Profile Picture"
          class="w-full h-full object-cover"
        />
        <span v-else>
          {{ customer.ContactName.charAt(0).toUpperCase() }}
        </span>
      </div>



      <!-- Title and Contact -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ customer.CompanyName }}</h2>
        <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
          {{ customer.ContactTitle }}
        </span>
        <p class="text-sm text-gray-600 mt-1">{{ customer.ContactName }}</p>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-4 space-y-2 text-sm text-gray-700">
      <p class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13 21.314l-4.657-4.657A8 8 0 1117.657 16.657z" />
        </svg>
        {{ customer.Address }}, {{ customer.City }}
        <span v-if="customer.Region">, {{ customer.Region }}</span>,
        {{ customer.Country }} {{ customer.PostalCode }}
      </p>
      <p class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 10l1.664-1.333a1.5 1.5 0 011.865 0L12 12.5l5.471-3.833a1.5 1.5 0 011.865 0L21 10m-9 2v4m0 0l-3-3m3 3l3-3" />
        </svg>
        {{ customer.Phone }}
      </p>
    </div>
  </div>
</template>
