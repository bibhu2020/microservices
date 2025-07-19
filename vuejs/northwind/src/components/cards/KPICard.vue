<script lang="ts" setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    totalOrders: {
        type: String,
        default: '0'
    },
    color: {
        type: String,
        default: 'blue'
    },
    name: {
        type: String,
        default: ''
    }
});

// Computed style object based on the color prop
const dynamicStyle = computed(() => ({
  iconColor: "pi pi-shopping-cart text-4xl text-" + props.color + "-500",
  fontColor: "text-3xl font-bold mt-2 text-" + props.color + "-700"
}));

</script>

<template>
    <div class="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:shadow-lg transition">
        <i :class="dynamicStyle.iconColor"></i>
        <div>
          <h2 class="text-gray-500 text-sm">{{ name }}</h2>
          <p :class="dynamicStyle.fontColor">{{ totalOrders }}</p>
        </div>
      </div>
</template>