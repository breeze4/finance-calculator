<script setup lang="ts">
import { useCoastFireStore } from '../stores/coastFire'
import { watch } from 'vue'

const store = useCoastFireStore()

watch([() => store.currentAge, () => store.retirementAge, () => store.currentSavings, 
       () => store.expectedReturnRate, () => store.targetRetirementAmount], () => {
  store.validateInputs()
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

const formatPercent = (value: number) => {
  return `${value}%`
}
</script>

<template>
  <div class="page-container">
    <h2>Coast FIRE Calculator</h2>
    <p>Calculate when you can stop saving for retirement and let compound interest do the work.</p>
    
    <div class="calculator-layout">
      <div class="calculator-form">
        <h3>Input Parameters</h3>
        
        <div class="form-group">
          <label for="current-age">
            Current Age
            <span class="help-icon" title="Your age today">?</span>
          </label>
          <input 
            id="current-age"
            type="number" 
            v-model.number="store.currentAge"
            min="18"
            max="100"
            :class="{ 'error': store.errors.currentAge }"
          />
          <span v-if="store.errors.currentAge" class="error-message">{{ store.errors.currentAge }}</span>
        </div>
        
        <div class="form-group">
          <label for="retirement-age">
            Retirement Age
            <span class="help-icon" title="Age when you plan to retire">?</span>
          </label>
          <input 
            id="retirement-age"
            type="number" 
            v-model.number="store.retirementAge"
            min="18"
            max="100"
            :class="{ 'error': store.errors.retirementAge }"
          />
          <span v-if="store.errors.retirementAge" class="error-message">{{ store.errors.retirementAge }}</span>
        </div>
        
        <div class="form-group">
          <label for="current-savings">
            Current Retirement Savings
            <span class="help-icon" title="Total value of retirement accounts (401k, IRA, etc.)">?</span>
          </label>
          <input 
            id="current-savings"
            type="number" 
            v-model.number="store.currentSavings"
            min="0"
            step="1000"
            :class="{ 'error': store.errors.currentSavings }"
          />
          <span v-if="store.errors.currentSavings" class="error-message">{{ store.errors.currentSavings }}</span>
        </div>
        
        <div class="form-group">
          <label for="return-rate">
            Expected Annual Return (%)
            <span class="help-icon" title="Average yearly growth rate (7-10% is typical for stocks)">?</span>
          </label>
          <input 
            id="return-rate"
            type="number" 
            v-model.number="store.expectedReturnRate"
            min="0"
            max="30"
            step="0.1"
            :class="{ 'error': store.errors.expectedReturnRate }"
          />
          <span v-if="store.errors.expectedReturnRate" class="error-message">{{ store.errors.expectedReturnRate }}</span>
        </div>
        
        <div class="form-group">
          <label for="target-amount">
            Target Retirement Amount
            <span class="help-icon" title="How much you want to have saved by retirement">?</span>
          </label>
          <input 
            id="target-amount"
            type="number" 
            v-model.number="store.targetRetirementAmount"
            min="0"
            step="10000"
            :class="{ 'error': store.errors.targetRetirementAmount }"
          />
          <span v-if="store.errors.targetRetirementAmount" class="error-message">{{ store.errors.targetRetirementAmount }}</span>
        </div>
        
        <button @click="store.resetToDefaults" class="secondary">
          Reset to Defaults
        </button>
      </div>
      
      <div class="results-panel">
        <h3>Results</h3>
        
        <div class="result-card" :class="{ 'success': store.isCoastFIREReady }">
          <h4>Coast FIRE Status</h4>
          <p class="status-text">
            {{ store.isCoastFIREReady ? '✅ You are Coast FIRE ready!' : '❌ Not Coast FIRE ready yet' }}
          </p>
        </div>
        
        <div class="result-item">
          <span class="label">Years to Retirement:</span>
          <span class="value">{{ store.yearsToRetirement }} years</span>
        </div>
        
        <div class="result-item">
          <span class="label">Future Value of Current Savings:</span>
          <span class="value">{{ formatCurrency(store.futureValueOfCurrentSavings) }}</span>
        </div>
        
        <div class="result-item">
          <span class="label">Target Retirement Amount:</span>
          <span class="value">{{ formatCurrency(store.targetRetirementAmount) }}</span>
        </div>
        
        <div v-if="!store.isCoastFIREReady" class="result-item">
          <span class="label">Additional Savings Needed Now:</span>
          <span class="value highlight">{{ formatCurrency(store.additionalSavingsNeeded) }}</span>
        </div>
        
        <div class="result-item">
          <span class="label">Coast FIRE Age:</span>
          <span class="value">{{ store.coastFIREAge }} years old</span>
        </div>
        
        <div class="explanation">
          <p v-if="store.isCoastFIREReady">
            Your current savings of {{ formatCurrency(store.currentSavings) }} will grow to 
            {{ formatCurrency(store.futureValueOfCurrentSavings) }} by age {{ store.retirementAge }} 
            at {{ formatPercent(store.expectedReturnRate) }} annual return, exceeding your target of 
            {{ formatCurrency(store.targetRetirementAmount) }}.
          </p>
          <p v-else>
            To reach Coast FIRE now, you need {{ formatCurrency(store.additionalSavingsNeeded) }} 
            more in savings. With your current savings of {{ formatCurrency(store.currentSavings) }}, 
            you'll reach Coast FIRE at age {{ store.coastFIREAge }}.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.calculator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.calculator-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #409eff;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.help-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-left: 0.25rem;
  background: #409eff;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  text-align: center;
  line-height: 18px;
  cursor: help;
  font-weight: normal;
}

.results-panel {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.result-card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e74c3c;
}

.result-card.success {
  border-left-color: #27ae60;
}

.result-card h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.status-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item .label {
  color: #666;
}

.result-item .value {
  font-weight: 600;
  color: #2c3e50;
}

.result-item .value.highlight {
  color: #e74c3c;
}

.explanation {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.6;
  color: #666;
}

button {
  margin-top: 1rem;
  width: 100%;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .calculator-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .calculator-form,
  .results-panel {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }
  
  .calculator-form,
  .results-panel {
    padding: 1rem;
  }
  
  .form-group input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  button {
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  .result-item {
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
  }
  
  .explanation {
    font-size: 0.9rem;
  }
}
</style>