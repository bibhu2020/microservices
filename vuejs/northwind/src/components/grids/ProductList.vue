<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">📦 Products</h1>
      <button
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        @click="openCreateModal"
      >
        ➕ New Product
      </button>
    </div>

    <div v-if="!state.isLoading">
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Product Name</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Quantity Per Unit</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Unit Price</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Units In Stock</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Discontinued</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in state.products"
              :key="product.ProductID"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ product.ProductID }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ product.ProductName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ product.QuantityPerUnit }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">${{ product.UnitPrice }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ product.UnitsInStock }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <span :class="{'text-red-600': product.Discontinued, 'text-green-600': !product.Discontinued}">
                  {{ product.Discontinued ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                <div class="flex items-center space-x-2">
                  <button
                    class="flex items-center text-blue-600 hover:text-blue-700"
                    @click.stop="openEditModal(product)"
                  >
                    <span class="mr-1">📝</span>
                    <span>Edit</span>
                  </button>
                  <button
                    class="flex items-center text-red-600 hover:text-red-700"
                    @click.stop="deleteProduct(product.ProductID)"
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

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold mb-4">Create New Product</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Product Name</label>
            <input 
              v-model="newProductName" 
              class="border rounded p-2 w-full"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label class="block text-gray-700">Quantity Per Unit</label>
            <input 
              v-model="newQuantityPerUnit" 
              class="border rounded p-2 w-full"
              placeholder="Enter quantity per unit"
            />
          </div>
          <div>
            <label class="block text-gray-700">Unit Price</label>
            <input 
              v-model="newUnitPrice" 
              type="number"
              class="border rounded p-2 w-full"
              placeholder="Enter unit price"
            />
          </div>
          <div>
            <label class="block text-gray-700">Units In Stock</label>
            <input 
              v-model="newUnitsInStock" 
              type="number"
              class="border rounded p-2 w-full"
              placeholder="Enter units in stock"
            />
          </div>
          <div>
            <label class="block text-gray-700">Discontinued</label>
            <input 
              v-model="newDiscontinued" 
              type="checkbox"
              class="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-6">
          <button 
            @click="showCreateModal = false"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="createProduct"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold mb-4">Edit Product</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Product Name</label>
            <input 
              v-model="editProductName" 
              class="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label class="block text-gray-700">Quantity Per Unit</label>
            <input 
              v-model="editQuantityPerUnit" 
              class="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label class="block text-gray-700">Unit Price</label>
            <input 
              v-model="editUnitPrice" 
              type="number"
              class="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label class="block text-gray-700">Units In Stock</label>
            <input 
              v-model="editUnitsInStock" 
              type="number"
              class="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label class="block text-gray-700">Discontinued</label>
            <input 
              v-model="editDiscontinued" 
              type="checkbox"
              class="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-6">
          <button 
            @click="showEditModal = false"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="saveEdit"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
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
  products: [],
  isLoading: true
})

const showCreateModal = ref(false)
const showEditModal = ref(false)

const newProductName = ref('')
const newQuantityPerUnit = ref('')
const newUnitPrice = ref(0)
const newUnitsInStock = ref(0)
const newDiscontinued = ref(false)

const editProductID = ref(null)
const editProductName = ref('')
const editQuantityPerUnit = ref('')
const editUnitPrice = ref(0)
const editUnitsInStock = ref(0)
const editDiscontinued = ref(false)

async function fetchProducts() {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`)
    state.products = data
  } finally {
    state.isLoading = false
  }
}

function openCreateModal() {
  newProductName.value = ''
  newQuantityPerUnit.value = ''
  newUnitPrice.value = 0
  newUnitsInStock.value = 0
  newDiscontinued.value = false
  showCreateModal.value = true
}

async function createProduct() {
  try {
    const { data } = await axios.post('/api/products', {
      ProductName: newProductName.value,
      QuantityPerUnit: newQuantityPerUnit.value,
      UnitPrice: newUnitPrice.value,
      UnitsInStock: newUnitsInStock.value,
      Discontinued: newDiscontinued.value
    })
    state.products.push(data)
    showCreateModal.value = false
  } catch (error) {
    console.error(error)
  }
}

function openEditModal(product) {
  editProductID.value = product.ProductID
  editProductName.value = product.ProductName
  editQuantityPerUnit.value = product.QuantityPerUnit
  editUnitPrice.value = product.UnitPrice
  editUnitsInStock.value = product.UnitsInStock
  editDiscontinued.value = product.Discontinued
  showEditModal.value = true
}

async function saveEdit() {
  try {
    await axios.put(`/api/products/${editProductID.value}`, {
      ProductName: editProductName.value,
      QuantityPerUnit: editQuantityPerUnit.value,
      UnitPrice: editUnitPrice.value,
      UnitsInStock: editUnitsInStock.value,
      Discontinued: editDiscontinued.value
    })
    const product = state.products.find(p => p.ProductID === editProductID.value)
    product.ProductName = editProductName.value
    product.QuantityPerUnit = editQuantityPerUnit.value
    product.UnitPrice = editUnitPrice.value
    product.UnitsInStock = editUnitsInStock.value
    product.Discontinued = editDiscontinued.value
    showEditModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function deleteProduct(id) {
  try {
    await axios.delete(`/api/products/${id}`)
    state.products = state.products.filter(p => p.ProductID !== id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchProducts)
</script>
