<script setup lang="ts">
import { useCoastFireStore } from '../stores/coastFire'
import { watch, ref } from 'vue'
import CoastFireProjectionChart from '../components/charts/CoastFireProjectionChart.vue'
import MathTooltip from '../components/MathTooltip.vue'

const store = useCoastFireStore()
const showResetFeedback = ref(false)

const handleReset = () => {
  store.resetToDefaults()
  showResetFeedback.value = true
  setTimeout(() => {
    showResetFeedback.value = false
  }, 2000)
}

watch([() => store.currentAge, () => store.retirementAge, () => store.currentSavings, 
       () => store.expectedReturnRate, () => store.targetRetirementAmount, 
       () => store.monthlyExpenses, () => store.yearlyExpenses,
       () => store.withdrawalRate, () => store.inflationRate], () => {
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
            <span class="help-icon" title="Total amount you want saved by retirement (automatically calculated if you enter expenses)">?</span>
          </label>
          <input 
            id="target-amount"
            type="number" 
            v-model.number="store.targetRetirementAmount"
            min="0"
            step="10000"
            :class="{ 'error': store.errors.targetRetirementAmount }"
            @input="store.syncFromTargetAmount"
          />
          <span v-if="store.errors.targetRetirementAmount" class="error-message">{{ store.errors.targetRetirementAmount }}</span>
        </div>
        
        <div class="expenses-row">
          <div class="form-group half-width">
            <label for="monthly-expenses">
              Monthly Expenses
              <span class="help-icon" title="Monthly spending in retirement">?</span>
            </label>
            <input 
              id="monthly-expenses"
              type="number" 
              v-model.number="store.monthlyExpenses"
              min="0"
              step="100"
              :class="{ 'error': store.errors.monthlyExpenses }"
              @input="store.syncFromMonthlyExpenses"
            />
            <span v-if="store.errors.monthlyExpenses" class="error-message">{{ store.errors.monthlyExpenses }}</span>
          </div>
          
          <div class="form-group half-width">
            <label for="yearly-expenses">
              Yearly Expenses
              <span class="help-icon" title="Annual spending in retirement">?</span>
            </label>
            <input 
              id="yearly-expenses"
              type="number" 
              v-model.number="store.yearlyExpenses"
              min="0"
              step="1000"
              :class="{ 'error': store.errors.yearlyExpenses }"
              @input="store.syncFromYearlyExpenses"
            />
            <span v-if="store.errors.yearlyExpenses" class="error-message">{{ store.errors.yearlyExpenses }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="withdrawal-rate">
            Safe Withdrawal Rate (%)
            <span class="help-icon" title="Percentage of portfolio to withdraw annually (4% is the traditional rule)">?</span>
          </label>
          <input 
            id="withdrawal-rate"
            type="number" 
            v-model.number="store.withdrawalRate"
            min="2"
            max="8"
            step="0.1"
            :class="{ 'error': store.errors.withdrawalRate }"
          />
          <span v-if="store.errors.withdrawalRate" class="error-message">{{ store.errors.withdrawalRate }}</span>
        </div>
        
        <div class="form-group">
          <label for="inflation-rate">
            Expected Inflation Rate (%)
            <span class="help-icon" title="Average annual inflation rate (3% is typical, 0% to disable)">?</span>
          </label>
          <input 
            id="inflation-rate"
            type="number" 
            v-model.number="store.inflationRate"
            min="0"
            max="10"
            step="0.1"
            :class="{ 'error': store.errors.inflationRate }"
          />
          <span v-if="store.errors.inflationRate" class="error-message">{{ store.errors.inflationRate }}</span>
        </div>
        
        <div class="form-group">
          <label for="use-real-returns" class="checkbox-label">
            <input 
              id="use-real-returns"
              type="checkbox" 
              v-model="store.useRealReturns"
            />
            <span>
              Use Real (Inflation-Adjusted) Returns
              <span class="help-icon" title="When checked, calculations use inflation-adjusted returns. When unchecked, uses nominal returns and adjusts the target for inflation.">?</span>
            </span>
          </label>
          <div class="info-text">
            <span v-if="store.useRealReturns">
              Using real return of 
              <MathTooltip
                v-if="store.inflationRate > 0"
                :title="store.tooltipData.realReturnRate.title"
                :formula="store.tooltipData.realReturnRate.formula"
                :values="store.tooltipData.realReturnRate.values"
                :calculation="store.tooltipData.realReturnRate.calculation"
                :result="store.tooltipData.realReturnRate.result"
                :explanation="store.tooltipData.realReturnRate.explanation"
              >
                <span class="math-tooltip-trigger">{{ formatPercent(Number(store.realReturnRate.toFixed(2))) }}</span>
              </MathTooltip>
              <span v-else>{{ formatPercent(Number(store.realReturnRate.toFixed(2))) }}</span>
              ({{ formatPercent(store.expectedReturnRate) }} nominal - {{ formatPercent(store.inflationRate) }} inflation)
            </span>
            <span v-else>
              Using nominal return of {{ formatPercent(store.expectedReturnRate) }}, target will be adjusted for {{ formatPercent(store.inflationRate) }} inflation
            </span>
          </div>
        </div>
        
        <button @click="handleReset" class="secondary">
          Reset to Defaults
        </button>
        
        <div v-if="showResetFeedback" class="reset-feedback">
          ✓ Values reset to defaults
        </div>
      </div>
      
      <div class="results-panel">
        <h3>Results</h3>
        
        <div class="result-card" :class="{ 'success': store.isCoastFIREReady }">
          <h4>Coast FIRE Status</h4>
          <MathTooltip
            :title="store.tooltipData.coastFIREReady.title"
            :formula="store.tooltipData.coastFIREReady.formula"
            :values="store.tooltipData.coastFIREReady.values"
            :calculation="store.tooltipData.coastFIREReady.calculation"
            :result="store.tooltipData.coastFIREReady.result"
            :explanation="store.tooltipData.coastFIREReady.explanation"
          >
            <p class="status-text math-tooltip-trigger">
              {{ store.isCoastFIREReady ? '✅ You are Coast FIRE ready!' : '❌ Not Coast FIRE ready yet' }}
            </p>
          </MathTooltip>
        </div>
        
        <div class="result-item">
          <span class="label">Years to Retirement:</span>
          <MathTooltip
            :title="store.tooltipData.yearsToRetirement.title"
            :formula="store.tooltipData.yearsToRetirement.formula"
            :values="store.tooltipData.yearsToRetirement.values"
            :calculation="store.tooltipData.yearsToRetirement.calculation"
            :result="store.tooltipData.yearsToRetirement.result"
            :explanation="store.tooltipData.yearsToRetirement.explanation"
          >
            <span class="value math-tooltip-trigger">{{ store.yearsToRetirement }} years</span>
          </MathTooltip>
        </div>
        
        <div class="result-item">
          <span class="label">Future Value of Current Savings:</span>
          <MathTooltip
            :title="store.tooltipData.futureValue.title"
            :formula="store.tooltipData.futureValue.formula"
            :values="store.tooltipData.futureValue.values"
            :calculation="store.tooltipData.futureValue.calculation"
            :result="store.tooltipData.futureValue.result"
            :explanation="store.tooltipData.futureValue.explanation"
          >
            <span class="value math-tooltip-trigger">{{ formatCurrency(store.futureValueOfCurrentSavings) }}</span>
          </MathTooltip>
        </div>
        
        <div class="result-item">
          <span class="label">Target Retirement Amount{{ !store.useRealReturns ? ' (Today\'s $)' : '' }}:</span>
          <span class="value">{{ formatCurrency(store.activeTargetAmount) }}</span>
        </div>
        
        <div v-if="!store.useRealReturns" class="result-item">
          <span class="label">Inflation-Adjusted Target:</span>
          <span class="value">{{ formatCurrency(store.inflationAdjustedTarget) }}</span>
        </div>
        
        <div v-if="store.monthlyExpenses > 0" class="result-item">
          <span class="label">Monthly Spending Available:</span>
          <MathTooltip
            :title="store.tooltipData.monthlyFromTarget.title"
            :formula="store.tooltipData.monthlyFromTarget.formula"
            :values="store.tooltipData.monthlyFromTarget.values"
            :calculation="store.tooltipData.monthlyFromTarget.calculation"
            :result="store.tooltipData.monthlyFromTarget.result"
            :explanation="store.tooltipData.monthlyFromTarget.explanation"
          >
            <span class="value math-tooltip-trigger">{{ formatCurrency(store.monthlyFromTarget) }}</span>
          </MathTooltip>
        </div>
        
        <div v-if="!store.isCoastFIREReady" class="result-item">
          <span class="label">Additional Savings Needed Now:</span>
          <MathTooltip
            :title="store.tooltipData.additionalSavingsNeeded.title"
            :formula="store.tooltipData.additionalSavingsNeeded.formula"
            :values="store.tooltipData.additionalSavingsNeeded.values"
            :calculation="store.tooltipData.additionalSavingsNeeded.calculation"
            :result="store.tooltipData.additionalSavingsNeeded.result"
            :explanation="store.tooltipData.additionalSavingsNeeded.explanation"
          >
            <span class="value highlight math-tooltip-trigger">{{ formatCurrency(store.additionalSavingsNeeded) }}</span>
          </MathTooltip>
        </div>
        
        <div class="result-item">
          <span class="label">Coast FIRE Age:</span>
          <span class="value">{{ store.coastFIREAge }} years old</span>
        </div>
        
        <div class="result-item">
          <span class="label">Coast FIRE Number at Current Age:</span>
          <MathTooltip
            :title="store.tooltipData.coastFIRENumber.title"
            :formula="store.tooltipData.coastFIRENumber.formula"
            :values="store.tooltipData.coastFIRENumber.values"
            :calculation="store.tooltipData.coastFIRENumber.calculation"
            :result="store.tooltipData.coastFIRENumber.result"
            :explanation="store.tooltipData.coastFIRENumber.explanation"
          >
            <span class="value math-tooltip-trigger">{{ formatCurrency(store.coastFIRENumber) }}</span>
          </MathTooltip>
        </div>
        
        <div class="explanation">
          <p v-if="store.isCoastFIREReady">
            Your current savings of {{ formatCurrency(store.currentSavings) }} will grow to 
            {{ formatCurrency(store.futureValueOfCurrentSavings) }} by age {{ store.retirementAge }} 
            at {{ formatPercent(Number(store.effectiveReturnRate.toFixed(2))) }} {{ store.useRealReturns ? 'real' : 'nominal' }} return, 
            exceeding your target of {{ formatCurrency(store.inflationAdjustedTarget) }}{{ !store.useRealReturns ? ' (inflation-adjusted)' : '' }}.
          </p>
          <p v-else>
            To reach Coast FIRE now, you need {{ formatCurrency(store.additionalSavingsNeeded) }} 
            more in savings. With your current savings of {{ formatCurrency(store.currentSavings) }}, 
            you'll reach Coast FIRE at age {{ store.coastFIREAge }}.
          </p>
          <p v-if="store.inflationRate > 0" class="calculation-note">
            {{ store.useRealReturns ? 
              `Using inflation-adjusted returns (${store.realReturnRate.toFixed(2)}% real = ${store.expectedReturnRate}% nominal - ${store.inflationRate}% inflation)` : 
              `Using nominal returns with target adjusted for ${store.inflationRate}% annual inflation` 
            }}
          </p>
          <p v-else class="calculation-note">
            Inflation disabled (using {{ store.expectedReturnRate }}% returns without adjustment)
          </p>
          <p v-if="store.monthlyExpenses > 0 || store.yearlyExpenses > 0" class="calculation-note">
            Based on {{ formatCurrency(store.monthlyExpenses) }}/month ({{ formatCurrency(store.yearlyExpenses) }}/year) and 
            {{ store.withdrawalRate }}% withdrawal rate.
          </p>
          <p class="calculation-note">
            <strong>Coast FIRE Number:</strong> {{ formatCurrency(store.coastFIRENumber) }} is the exact amount you need saved at age {{ store.currentAge }} 
            to reach your retirement goal by age {{ store.retirementAge }} with {{ formatPercent(Number(store.effectiveReturnRate.toFixed(2))) }} returns.
          </p>
        </div>
      </div>
    </div>
    
    <CoastFireProjectionChart />
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

.calculation-note {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
  margin-top: 0.5rem;
}

button {
  margin-top: 1rem;
  width: 100%;
}

.reset-feedback {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.expenses-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group.half-width {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
  margin-top: 0.2rem;
}

.checkbox-label span {
  flex: 1;
}

.info-text {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f0f9ff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
}

.math-tooltip-trigger {
  cursor: help;
  border-bottom: 1px dotted #409eff;
  position: relative;
  transition: all 0.2s ease;
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 3px;
}

.math-tooltip-trigger:hover {
  background-color: #f0f9ff;
  border-bottom-style: solid;
  border-bottom-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

@media (max-width: 768px) {
  .expenses-row {
    grid-template-columns: 1fr;
  }
  
  .form-group.half-width {
    margin-bottom: 1.5rem;
  }
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