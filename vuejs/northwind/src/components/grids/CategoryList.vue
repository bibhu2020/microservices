<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">📋 Categories</h1>
      <button
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
        @click="openCreateModal"
      >
        ➕ New Category
      </button>
    </div>

    <div v-if="!state.isLoading">
      <div class="overflow-x-auto bg-white rounded-2xl shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="category in state.categories"
              :key="category.CategoryID"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ category.CategoryID }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ category.CategoryName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ category.Description }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-500">
                <div class="flex items-center space-x-2">
                  <button
                    class="flex items-center text-blue-600 hover:text-blue-700"
                    @click.stop="startEdit(category)"
                  >
                    <span class="mr-1">📝</span>
                    <span>Edit</span>
                  </button>
                  <button
                    class="flex items-center text-red-600 hover:text-red-700"
                    @click.stop="deleteCategory(category.CategoryID)"
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
        <h2 class="text-xl font-bold mb-4">Create New Category</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Name</label>
            <input 
              v-model="newName" 
              class="border rounded p-2 w-full"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label class="block text-gray-700">Description</label>
            <input 
              v-model="newDescription" 
              class="border rounded p-2 w-full"
              placeholder="Enter description"
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
            @click="createCategory"
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
        <h2 class="text-xl font-bold mb-4">Edit Category</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Name</label>
            <input 
              v-model="editName" 
              class="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label class="block text-gray-700">Description</label>
            <input 
              v-model="editDescription" 
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
  categories: [],
  isLoading: true
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const newName = ref('')
const newDescription = ref('')
const editId = ref(null)
const editName = ref('')
const editDescription = ref('')

async function fetchCategories() {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/categories`)
    state.categories = data
  } finally {
    state.isLoading = false
  }
}

function startEdit(category) {
  editId.value = category.CategoryID
  editName.value = category.CategoryName
  editDescription.value = category.Description
  showEditModal.value = true
}

async function saveEdit() {
  try {
    await axios.put(`/api/categories/${editId.value}`, {
      CategoryName: editName.value,
      Description: editDescription.value
    })
    const category = state.categories.find(c => c.CategoryID === editId.value)
    category.CategoryName = editName.value
    category.Description = editDescription.value
    showEditModal.value = false
  } catch (error) {
    console.error(error)
  }
}

async function deleteCategory(id) {
  try {
    await axios.delete(`/api/categories/${id}`)
    state.categories = state.categories.filter(c => c.CategoryID !== id)
  } catch (error) {
    console.error(error)
  }
}

function openCreateModal() {
  newName.value = ''
  newDescription.value = ''
  showCreateModal.value = true
}

async function createCategory() {
  try {
    const { data } = await axios.post('/api/categories', {
      CategoryName: newName.value,
      Description: newDescription.value
    })
    state.categories.push(data)
    showCreateModal.value = false
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchCategories)
</script>
