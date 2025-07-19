<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-semibold mb-4">{{title}}</h2>
    <div class="h-72">
      <div class="w-full h-64 relative">
        <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  chartData: Object,
  title: String
})

const canvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()  // destroy old instance before creating a new one
  }

  chartInstance = new Chart(canvas.value, {
    type: 'bar',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: { ticks: { color: '#6b7280' } },
        y: { ticks: { color: '#6b7280' } }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.chartData, (newData) => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
