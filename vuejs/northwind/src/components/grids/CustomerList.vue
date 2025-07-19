<script setup lang="ts">
import CustomerCard from '@/components/cards/CustomerCard.vue';

defineProps<{
  customers: Array<{
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
  }>;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <CustomerCard
      v-for="customer in customers"
      :key="customer.CustomerID"
      :customer="customer"
    />
  </div>
</template>
