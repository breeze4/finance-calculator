<script setup lang="ts">
import { computed } from 'vue'
import { useMortgagePayoffStore } from '../../stores/mortgagePayoff'
import LineChart from './LineChart.vue'
import AreaChart from './AreaChart.vue'
import type { ChartOptions } from 'chart.js'

const store = useMortgagePayoffStore()

const balanceChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Principal Balance Over Time',
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
        text: 'Time',
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
        text: 'Remaining Balance',
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

const interestChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Cumulative Interest Comparison',
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
        text: 'Time',
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
        text: 'Cumulative Interest',
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

const investmentChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Mortgage Payoff vs Investment Comparison',
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
        text: 'Time',
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
        text: 'Value',
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
  <div class="charts-container">
    <div class="chart-wrapper">
      <LineChart 
        :chart-data="store.balanceChartData" 
        :options="balanceChartOptions"
        :height="300"
      />
    </div>
    
    <div class="chart-wrapper">
      <AreaChart 
        :chart-data="store.interestComparisonChartData" 
        :options="interestChartOptions"
        :height="300"
      />
    </div>
    
    <div v-if="store.showInvestmentComparison && store.investmentComparisonChartData" class="chart-wrapper">
      <LineChart 
        :chart-data="store.investmentComparisonChartData" 
        :options="investmentChartOptions"
        :height="300"
      />
    </div>
  </div>
</template>

<style scoped>
.charts-container {
  margin-top: 2rem;
}

.chart-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.chart-wrapper:last-child {
  margin-bottom: 0;
}
</style>