<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800"><svg class="w-8 h-8 text-gray-800 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18l-1.2 8H4.2L3 3zm0 0L1 9l1 11h16l1-11-2.2-6H3z"/>
  </svg>
  Orders</h1>
      <button
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        @click="openForm()"
      >
        ➕ Add Order
      </button>
    </div>

    <div v-if="!state.isLoading">
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3">Expand</th>
              <th class="px-6 py-3">Customer</th>
              <th class="px-6 py-3">Order Date</th>
              <th class="px-6 py-3">Shipped Date</th>
              <th class="px-6 py-3">City</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in state.orders" :key="order.id">
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-center">
                  <button
                    @click.stop="toggleExpand(order.id)"
                    class="text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    <span v-if="expandedOrderId === order.id">🔽</span>
                    <span v-else>▶️</span>
                  </button>
                </td>
                <td class="px-6 py-4">{{ order.Customer.CompanyName }}</td>
                <td class="px-6 py-4">{{ order.OrderDate }}</td>
                <td class="px-6 py-4">
                  <span :class="order.ShippedDate ? 'text-green-600' : 'text-yellow-500'">
                    {{ order.ShippedDate || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ order.ShipCity }}</td>
                <td class="px-6 py-4 flex gap-2">
                  <button
                    class="text-blue-600 hover:underline"
                    @click.stop="openForm(order)"
                  >
                    📝 Edit
                  </button>
                  <button
                    class="text-red-600 hover:underline"
                    @click.stop="deleteOrder(order.id)"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>

              <!-- Expanded Row for Items -->
              <tr v-if="expandedOrderId === order.id">
                <td colspan="6" class="bg-gray-50 px-6 py-4">
                  <div v-if="order.items?.length" class="space-y-2">
                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="flex justify-between text-sm text-gray-600"
                    >
                      <span>{{ item.product }}</span>
                      <div class="flex gap-2">
                        <span>Qty: {{ item.quantity }}</span>
                        <span>💲{{ item.price }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-gray-400 text-sm">
                    No items found for this order.
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="flex justify-center py-20">
      <RotateLoader color="#102841" size="15px" />
    </div>

    <OrderForm v-if="showForm" :order="editingOrder" @close="closeForm" @saved="loadOrders" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import OrderForm from '@/components/forms/OrderForm.vue'
import orderService from '@/services/orderService'
import axios from 'axios'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'

const state = reactive({
  orders: [],
  isLoading: true
});
const expandedOrderId = ref(null) // <-- single expanded order
const showForm = ref(false)
const editingOrder = ref(null)

const loadOrders = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`)
    state.orders = response.data
  } catch (err) {
    console.log(err)
  } finally {
    state.isLoading = false;
  }
}

const toggleExpand = (orderId) => {
  // If clicked order is already expanded, collapse it, else expand it
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId
}

const openForm = (order = null) => {
  editingOrder.value = order
  showForm.value = true
}

const closeForm = () => {
  editingOrder.value = null
  showForm.value = false
}

const deleteOrder = async (orderId) => {
  await orderService.deleteOrder(orderId)
  loadOrders()
}

onMounted(loadOrders)
</script>
