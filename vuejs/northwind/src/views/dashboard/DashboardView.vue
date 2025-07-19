<template>
  <div v-if="!state.isLoading" class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <KPICard :totalOrders="`${totalOrders}`" color="blue" name="Total Order" />
      <KPICard :totalOrders="`${totalFreight.toFixed(2)}`" color="green" name="Total Freight" />
      <KPICard :totalOrders="`${topCustomer}`" color="purple" name="Top Customer" />
    </div>

    <!-- Main Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <LineChart :chart-data="freightTrendData" title="Freight Trend by Year" />
      <BarChart :chart-data="ordersByCountryData" title="Orders by Country" />
    </div>

    <!-- Additional Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <PieChart :chart-data="ordersByShipperData" title="Order Distribution by Shipper" />
      <StackedBarChart :chart-data="monthlyOrdersFreightData"  title="Monthly Orders vs Freight"/>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <KPICard :totalOrders="`${avgFreight.toFixed(2)}`" :color="indigo" name="Avg Freight per Order" />
      <KPICard :totalOrders="`${totalCountries}`" :color="cyan" name="Countries Served" />
      <KPICard :totalOrders="`${topShippingCountry}`" :color="pink" name="Top Shipping Country" />
    </div>

    <!-- Top Customers Table -->
    <!-- <TopCustomerList :topCustomers="`${topCustomers}`" title="Top 5 Customers by Freight" /> -->
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
            <tr v-for="customer in topCustomers" :key="customer.name" class="border-t hover:bg-gray-50">
              <td class="py-2">{{ customer.name }}</td>
              <td class="py-2 text-green-600 font-semibold">${{ customer.freight.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Loading Spinner -->
  <div v-else class="flex justify-center items-center h-screen">
    <RotateLoader color="#102841" size="15px" />
  </div>
</template>


<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'
import axios from 'axios'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import KPICard from '@/components/cards/KPICard.vue'
import TopCustomerList from '@/components/grids/TopCustomerList.vue'


// Data State
const state = reactive({
  orders: [],
  isLoading: true
});



onMounted(async () => {
  try {
    console.log("API_URL: " + import.meta.env.VITE_API_URL);

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
    state.orders = response.data;
  } catch (err) {
    console.error(err);
  } finally {
    state.isLoading = false;
  }
});

// KPIs
const totalOrders = computed(() => state.orders.length);

const totalFreight = computed(() =>
  state.orders.reduce((sum, order) => sum + parseFloat(order.Freight), 0)
);

const customerFreightMap = computed(() => {
  const map = {};
  state.orders.forEach(order => {
    const name = order.Customer.CompanyName;
    if (!map[name]) map[name] = 0;
    map[name] += parseFloat(order.Freight);
  });
  return map;
});

const topCustomer = computed(() => {
  const sorted = Object.entries(customerFreightMap.value).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'N/A';
});

// Freight Trend by Year
const freightTrendData = computed(() => {
  const map = {};
  state.orders.forEach(order => {
    const year = new Date(order.OrderDate).getFullYear();
    if (!map[year]) map[year] = 0;
    map[year] += parseFloat(order.Freight);
  });
  return {
    labels: Object.keys(map),
    datasets: [{
      label: 'Freight',
      data: Object.values(map),
      fill: false,
      borderColor: '#3b82f6',
      tension: 0.4
    }]
  };
});

// Orders by Country
const ordersByCountryData = computed(() => {
  const map = {};
  state.orders.forEach(order => {
    const country = order.ShipCountry;
    if (!map[country]) map[country] = 0;
    map[country] += 1;
  });
  return {
    labels: Object.keys(map),
    datasets: [{
      label: 'Orders',
      data: Object.values(map),
      backgroundColor: '#002641'
    }]
  };
});

// Orders by Shipper (Pie Chart)
const ordersByShipperData = computed(() => {
  const map = {};
  state.orders.forEach(order => {
    const shipper = order.ShipVia.CompanyName;
    if (!map[shipper]) map[shipper] = 0;
    map[shipper] += 1;
  });
  return {
    labels: Object.keys(map),
    datasets: [{
      data: Object.values(map),
      backgroundColor: ['#3b82f6', '#6366f1', '#f59e0b', '#10b981', '#ef4444'],
    }]
  };
});

// Monthly Orders vs Freight (Stacked Bar)
const monthlyOrdersFreightData = computed(() => {
  const ordersMap = {};
  const freightMap = {};

  state.orders.forEach(order => {
    const month = new Date(order.OrderDate).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!ordersMap[month]) ordersMap[month] = 0;
    if (!freightMap[month]) freightMap[month] = 0;
    ordersMap[month]++;
    freightMap[month] += parseFloat(order.Freight);
  });

  const months = Object.keys(ordersMap);
  return {
    labels: months,
    datasets: [
      {
        label: 'Orders',
        data: months.map(m => ordersMap[m]),
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Freight',
        data: months.map(m => freightMap[m]),
        backgroundColor: '#10b981',
      }
    ]
  };
});

// Quick Stats
const avgFreight = computed(() => {
  return totalFreight.value / (totalOrders.value || 1);
});

const totalCountries = computed(() => {
  const countries = new Set(state.orders.map(order => order.ShipCountry));
  return countries.size;
});

const topShippingCountry = computed(() => {
  const map = {};
  state.orders.forEach(order => {
    const country = order.ShipCountry;
    if (!map[country]) map[country] = 0;
    map[country]++;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'N/A';
});

// Top Customers for Table
// const topCustomers = ref([]);

const topCustomers = computed(() => {
  const entries = Object.entries(customerFreightMap.value);
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, freight]) => ({ name, freight }));
});
</script>

<style scoped>
/* Optional: Add extra styling for better looks */
</style>
