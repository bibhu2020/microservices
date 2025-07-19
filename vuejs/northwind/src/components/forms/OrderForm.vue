<!-- src/components/OrderForm.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4">
        <h2 class="text-2xl font-bold">{{ order?.id ? 'Edit Order' : 'New Order' }}</h2>
  
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Customer</label>
            <select v-model="form.customer" class="w-full p-2 border rounded">
              <option v-for="c in dropdowns.customers" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
  
          <div>
            <label class="block mb-1">Employee</label>
            <select v-model="form.employee" class="w-full p-2 border rounded">
              <option v-for="e in dropdowns.employees" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
  
          <div>
            <label class="block mb-1">Shipper</label>
            <select v-model="form.shipper" class="w-full p-2 border rounded">
              <option v-for="s in dropdowns.shippers" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
  
          <div>
            <label class="block mb-1">Ship City</label>
            <input v-model="form.shipCity" type="text" class="w-full p-2 border rounded" />
          </div>
  
          <div>
            <label class="block mb-1">Order Date</label>
            <input v-model="form.orderDate" type="date" class="w-full p-2 border rounded" />
          </div>
  
          <div>
            <label class="block mb-1">Shipped Date</label>
            <input v-model="form.shippedDate" type="date" class="w-full p-2 border rounded" />
          </div>
        </div>
  
        <div>
          <h3 class="text-lg font-semibold mt-4">Order Items</h3>
          <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 items-center mt-2">
            <select v-model="item.product" class="flex-1 p-2 border rounded">
              <option v-for="p in dropdowns.products" :key="p" :value="p">{{ p }}</option>
            </select>
            <input v-model.number="item.quantity" type="number" placeholder="Qty" class="w-20 p-2 border rounded" />
            <input v-model.number="item.price" type="number" placeholder="Price" class="w-24 p-2 border rounded" />
            <button @click="removeItem(index)" class="text-red-600">🗑️</button>
          </div>
  
          <button @click="addItem" class="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
            ➕ Add Item
          </button>
        </div>
  
        <div class="flex justify-end gap-4 mt-6">
          <button @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Cancel
          </button>
          <button @click="saveOrder" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import orderService from '@/services/orderService'
  
  const props = defineProps(['order'])
  const emit = defineEmits(['close', 'saved'])
  
  const form = ref({
    customer: '',
    employee: '',
    shipper: '',
    shipCity: '',
    orderDate: '',
    shippedDate: '',
    freight: 0,
    items: []
  })
  
  const dropdowns = ref({
    customers: [],
    employees: [],
    shippers: [],
    products: []
  })
  
  onMounted(async () => {
    dropdowns.value = await orderService.getDropdownData()
    if (props.order) {
      form.value = JSON.parse(JSON.stringify(props.order))
    }
  })
  
  const addItem = () => {
    form.value.items.push({ product: '', quantity: 1, price: 0 })
  }
  
  const removeItem = (index) => {
    form.value.items.splice(index, 1)
  }
  
  const saveOrder = async () => {
    await orderService.saveOrder(form.value)
    emit('saved')
    emit('close')
  }
  </script>
  