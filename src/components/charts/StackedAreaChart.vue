<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  chartData: ChartData<'line'>
  options?: ChartOptions<'line'>
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200
})

const processedChartData = computed(() => {
  const data = { ...props.chartData }
  
  if (data.datasets) {
    data.datasets = data.datasets.map((dataset, index) => ({
      ...dataset,
      fill: index === 0 ? 'origin' : '-1',
      tension: dataset.tension !== undefined ? dataset.tension : 0.4,
      borderWidth: dataset.borderWidth !== undefined ? dataset.borderWidth : 2,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  }
  
  return data
})

const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(context.parsed.y)
          }
          return label
        },
        footer: (tooltipItems) => {
          let sum = 0
          tooltipItems.forEach(item => {
            sum += item.parsed.y
          })
          return 'Total: ' + new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(sum)
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      }
    },
    y: {
      stacked: true,
      display: true,
      grid: {
        color: '#f0f0f0'
      },
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: 'compact'
          }).format(value as number)
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options
}))

const chartStyles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'relative' as const
}))
</script>

<template>
  <div class="chart-container" :style="chartStyles">
    <Line :data="processedChartData" :options="mergedOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 100%;
}
</style>