<script setup lang="ts">
interface Customer {
  name: string;
  freight: number;
}

const props = defineProps<{
  topCustomers: Customer[];
  title: string;
}>();
console.log("TopCustomerList props: ", props.topCustomers.length);
</script>

<template>
    <div class="bg-white p-6 rounded-2xl shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{title}}</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead class="text-gray-600 border-b">
            <tr>
              <th class="pb-2">Customer</th>
              <th class="pb-2">Total Freight</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in props.topCustomers" :key="customer.name" class="border-t hover:bg-gray-50">
              <td class="py-2">{{ customer.name }}</td>
              <td class="py-2 text-green-600 font-semibold">${{ customer.freight.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>