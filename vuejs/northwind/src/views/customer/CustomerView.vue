<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import CustomerList from '@/components/grids/CustomerList.vue';
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import axios from 'axios';

//const customers = ref<Array<any>>([]);
//const loading = ref(true);
const state = reactive({
  customers: [],
  isLoading: true 
})

onMounted(async () => {
  try {
    // const apiUrl = import.meta.env.VITE_API_URL;
    // console.log(apiUrl)
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/customers`); // replace with your actual API URL
    //const data = await response.json();
    state.customers = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Customers</h1>

    <div v-if="state.isLoading" class="text-center text-gray-500"><RotateLoader color="#102841"  size="15px" /></div>

    <div v-else>
      <CustomerList :customers="state.customers" />
    </div>
  </div>
</template>
