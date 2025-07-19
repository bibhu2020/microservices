<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
    <div class="h-72">
      <div class="w-full h-64 relative">
        <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted, defineProps } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  chartData: Object,
  title: String
})

const canvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvas.value, {
    type: 'line',
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
      },
      elements: {
        line: {
          tension: 0.4  // smooth curves
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.chartData, () => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
