<template>
  <div 
    ref="containerRef"
    class="math-tooltip-container" 
    :class="{ 'disabled': props.disabled }"
    @mouseenter="handleMouseEnter"
  >
    <slot />
    <div 
      ref="tooltipRef"
      class="math-tooltip"
      :class="{ 
        'math-tooltip-mobile': isMobile,
        'math-tooltip-below': showBelow && !isMobile 
      }"
      @click.stop
    >
      <div class="math-tooltip-content">
        <div v-if="title" class="math-tooltip-title">{{ title }}</div>
        
        <div v-if="formula" class="math-formula">
          <div class="formula-label">Formula:</div>
          <div class="formula-content" v-html="formattedFormula"></div>
        </div>
        
        <div v-if="calculation" class="math-calculation">
          <div class="calculation-label">Calculation:</div>
          <div class="calculation-steps">
            <div 
              v-for="(step, index) in calculationSteps" 
              :key="index" 
              class="calculation-step"
              v-html="step"
            ></div>
          </div>
        </div>
        
        <div v-if="result" class="math-result">
          <div class="result-content" v-html="formattedResult"></div>
        </div>
        
        <div v-if="explanation" class="math-explanation">
          <div class="explanation-content">{{ explanation }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  title?: string
  formula?: string
  values?: Record<string, any>
  calculation?: string | string[]
  result?: string
  explanation?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const isMobile = ref(false)
const showBelow = ref(false)
const tooltipRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

const formattedFormula = computed(() => {
  if (!props.formula) return ''
  return formatMathExpression(props.formula, props.values || {})
})

const calculationSteps = computed(() => {
  if (!props.calculation) return []
  const steps = Array.isArray(props.calculation) ? props.calculation : [props.calculation]
  return steps.map(step => formatMathExpression(step, props.values || {}))
})

const formattedResult = computed(() => {
  if (!props.result) return ''
  return formatMathExpression(props.result, props.values || {})
})

function formatMathExpression(expression: string, values: Record<string, any>): string {
  let formatted = expression
  
  // Replace placeholders with actual values
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    let formattedValue = String(value)
    
    // Format numbers appropriately
    if (typeof value === 'number') {
      if (key.includes('Rate') || key.includes('Percentage')) {
        formattedValue = `${value}%`
      } else if (key.includes('Currency') || key.includes('Amount') || key.includes('Savings')) {
        formattedValue = formatCurrency(value)
      } else {
        formattedValue = value.toLocaleString()
      }
    }
    
    formatted = formatted.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), formattedValue)
  })
  
  // Format mathematical notation
  formatted = formatted
    .replace(/\^(\d+)/g, '<sup>$1</sup>') // Superscripts
    .replace(/\*\*/g, '^') // Convert ** to ^
    .replace(/×/g, '×') // Multiplication symbol
    .replace(/÷/g, '÷') // Division symbol
    
  return formatted
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

function checkTooltipPosition() {
  if (!containerRef.value || !tooltipRef.value || isMobile.value) {
    showBelow.value = false
    return
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const tooltipHeight = tooltipRef.value.offsetHeight || 400 // Estimate if not visible
  const spaceAbove = containerRect.top
  const spaceBelow = window.innerHeight - containerRect.bottom
  
  // If there's not enough space above (need at least tooltip height + margin)
  const requiredSpaceAbove = tooltipHeight + 16 // 8px margin + some buffer
  
  // Show below if there's insufficient space above OR if there's much more space below
  showBelow.value = spaceAbove < requiredSpaceAbove && spaceBelow > tooltipHeight
}

function handleMouseEnter() {
  if (!isMobile.value) {
    // Small delay to ensure tooltip is in DOM before measuring
    setTimeout(() => {
      checkTooltipPosition()
    }, 10)
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.math-tooltip-container {
  position: relative;
  display: inline-block;
}

.math-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  min-width: 320px;
  max-width: 480px;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  transform: translateX(-50%) translateY(-8px);
}

.math-tooltip-container:hover .math-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.math-tooltip-container.disabled:hover .math-tooltip {
  opacity: 0;
  visibility: hidden;
}

/* Below positioning when there's insufficient space above */
.math-tooltip-below {
  bottom: auto;
  top: 100%;
  margin-bottom: 0;
  margin-top: 8px;
  transform: translateX(-50%) translateY(8px);
}

.math-tooltip-container:hover .math-tooltip-below {
  transform: translateX(-50%) translateY(0);
}

.math-tooltip-below::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: #2c3e50;
}

/* Default positioning - center above the trigger */

.math-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #2c3e50;
}

.math-tooltip-mobile {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}

.math-tooltip-mobile::after {
  display: none;
}

.math-tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.math-tooltip-title {
  font-weight: bold;
  font-size: 16px;
  color: #3498db;
  border-bottom: 1px solid #34495e;
  padding-bottom: 8px;
}

.math-formula,
.math-calculation,
.math-result {
  font-family: 'Courier New', monospace;
}

.formula-label,
.calculation-label {
  font-weight: bold;
  color: #ecf0f1;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.formula-content,
.result-content {
  background: #34495e;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.calculation-steps {
  background: #34495e;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
}

.calculation-step {
  margin: 4px 0;
}

.calculation-step:not(:last-child) {
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #2c3e50;
}

.math-explanation {
  font-style: italic;
  color: #bdc3c7;
  background: #34495e;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #f39c12;
}

.explanation-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mathematical notation styling */
:deep(sup) {
  font-size: 0.75em;
  vertical-align: super;
}

:deep(sub) {
  font-size: 0.75em;
  vertical-align: sub;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .math-tooltip {
    min-width: 280px;
    max-width: 90vw;
    font-size: 13px;
    padding: 12px;
  }
  
  .math-tooltip-title {
    font-size: 15px;
  }
}

/* Hide tooltip on mobile when not active */
@media (max-width: 768px) {
  .math-tooltip:not(.math-tooltip-mobile) {
    display: none;
  }
}
</style>