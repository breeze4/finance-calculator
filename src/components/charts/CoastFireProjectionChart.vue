<script setup lang="ts">
import { computed } from 'vue'
import { useCoastFireStore } from '../../stores/coastFire'
import AreaChart from './AreaChart.vue'
import type { ChartOptions } from 'chart.js'

const store = useCoastFireStore()

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Savings Growth Projection',
      font: {
        size: 16,
        weight: 'normal'
      },
      color: '#2c3e50'
    },
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
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Age',
        color: '#666'
      },
      grid: {
        display: false
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Savings Value',
        color: '#666'
      },
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
  }
}))
</script>

<template>
  <div class="chart-wrapper">
    <AreaChart 
      :chart-data="store.projectionChartData" 
      :options="chartOptions"
      :height="300"
    />
  </div>
</template>

<style scoped>
.chart-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 1.5rem;
}
</style>