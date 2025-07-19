<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">🏢 Suppliers</h1>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        ➕ New Supplier
      </button>
    </div>

    <!-- Suppliers Table -->
    <div v-if="!state.isLoading">
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Company</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">City</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Country</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="supplier in state.suppliers"
              :key="supplier.SupplierID"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ supplier.SupplierID }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ supplier.CompanyName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ supplier.ContactName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ supplier.Phone }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ supplier.City }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ supplier.Country }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                <div class="flex items-center space-x-2">
                  <button
                    class="flex items-center text-blue-600 hover:text-blue-700"
                    @click="openEditModal(supplier)"
                  >
                    <span class="mr-1">📝</span>
                    <span>Edit</span>
                  </button>
                  <button
                    class="flex items-center text-red-600 hover:text-red-700"
                    @click="deleteSupplier(supplier.SupplierID)"
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

    <!-- Create or Edit Supplier Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Supplier' : 'Create New Supplier' }}</h2>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">Company Name</label>
            <input v-model="form.CompanyName" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Contact Name</label>
            <input v-model="form.ContactName" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Contact Title</label>
            <input v-model="form.ContactTitle" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Phone</label>
            <input v-model="form.Phone" class="border rounded p-2 w-full" />
          </div>
          <div class="col-span-2">
            <label class="block text-gray-700">Address</label>
            <input v-model="form.Address" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">City</label>
            <input v-model="form.City" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Region</label>
            <input v-model="form.Region" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Postal Code</label>
            <input v-model="form.PostalCode" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Country</label>
            <input v-model="form.Country" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Fax</label>
            <input v-model="form.Fax" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700">Homepage</label>
            <input v-model="form.HomePage" class="border rounded p-2 w-full" />
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
            @click="isEditing ? updateSupplier() : createSupplier()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {{ isEditing ? 'Save Changes' : 'Create Supplier' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import axios from 'axios'

const state = reactive({
  suppliers: [],
  isLoading: true
})
const showModal = ref(false)
const isEditing = ref(false)
const selectedSupplierId = ref(null)

const form = ref({
  CompanyName: '',
  ContactName: '',
  ContactTitle: '',
  Address: '',
  City: '',
  Region: '',
  PostalCode: '',
  Country: '',
  Phone: '',
  Fax: '',
  HomePage: ''
})

async function fetchSuppliers() {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`)
    state.suppliers = data
  } finally {
    state.isLoading = false
  }
}

function openCreateModal() {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

function openEditModal(supplier) {
  selectedSupplierId.value = supplier.SupplierID
  form.value = { ...supplier }
  isEditing.value = true
  showModal.value = true
}

function resetForm() {
  form.value = {
    CompanyName: '',
    ContactName: '',
    ContactTitle: '',
    Address: '',
    City: '',
    Region: '',
    PostalCode: '',
    Country: '',
    Phone: '',
    Fax: '',
    HomePage: ''
  }
}

async function createSupplier() {
  try {
    const { data } = await axios.post('/api/suppliers', form.value)
    state.suppliers.push(data)
    showModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function updateSupplier() {
  try {
    await axios.put(`/api/suppliers/${selectedSupplierId.value}`, form.value)
    const index = state.suppliers.findIndex(s => s.SupplierID === selectedSupplierId.value)
    if (index !== -1) state.suppliers[index] = { ...form.value, SupplierID: selectedSupplierId.value }
    showModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function deleteSupplier(id) {
  try {
    await axios.delete(`/api/suppliers/${id}`)
    state.suppliers = state.suppliers.filter(s => s.SupplierID !== id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchSuppliers)
</script>
