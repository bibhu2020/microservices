<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">🚚 Shippers</h1>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        ➕ New Shipper
      </button>
    </div>

    <!-- Shippers Table -->
    <div v-if="!state.isLoading">
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Company Name</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="shipper in state.shippers"
              :key="shipper.ShipperID"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ shipper.ShipperID }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ shipper.CompanyName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ shipper.Phone }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                <div class="flex items-center space-x-2">
                  <button
                    class="flex items-center text-blue-600 hover:text-blue-700"
                    @click="openEditModal(shipper)"
                  >
                    <span class="mr-1">📝</span>
                    <span>Edit</span>
                  </button>
                  <button
                    class="flex items-center text-red-600 hover:text-red-700"
                    @click="deleteShipper(shipper.ShipperID)"
                  >
                    <span class="mr-1">🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="flex justify-center py-20">
      <RotateLoader color="#102841" size="15px" />
    </div>

    <!-- Create or Edit Shipper Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Shipper' : 'Create New Shipper' }}</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Company Name</label>
            <input v-model="form.CompanyName" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Phone</label>
            <input v-model="form.Phone" class="border rounded p-2 w-full" />
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-6">
          <button
            @click="showModal = false"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="isEditing ? updateShipper() : createShipper()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {{ isEditing ? 'Save Changes' : 'Create Shipper' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'

const state = reactive({
  shippers: [],
  isLoading: true
})
const showModal = ref(false)
const isEditing = ref(false)
const selectedShipperId = ref(null)

const form = ref({
  CompanyName: '',
  Phone: ''
})

async function fetchShippers() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/shippers`)
    state.shippers = response.data
  } finally {
    state.isLoading = false
  }
}

function openCreateModal() {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

function openEditModal(shipper) {
  selectedShipperId.value = shipper.ShipperID
  form.value = { ...shipper }
  isEditing.value = true
  showModal.value = true
}

function resetForm() {
  form.value = {
    CompanyName: '',
    Phone: ''
  }
}

async function createShipper() {
  try {
    const { data } = await axios.post('/shippers', form.value)
    state.shippers.push(data)
    showModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function updateShipper() {
  try {
    await axios.put(`/shippers/${selectedShipperId.value}`, form.value)
    const index = state.shippers.findIndex(s => s.ShipperID === selectedShipperId.value)
    if (index !== -1) state.shippers[index] = { ...form.value, ShipperID: selectedShipperId.value }
    showModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function deleteShipper(id) {
  try {
    await axios.delete(`/api/shippers/${id}`)
    state.shippers = state.shippers.filter(s => s.ShipperID !== id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchShippers)
</script>
