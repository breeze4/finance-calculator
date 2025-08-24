<script setup lang="ts">
import { useMortgagePayoffStore } from '../stores/mortgagePayoff'
import { ref } from 'vue'
import MortgageBalanceChart from '../components/charts/MortgageBalanceChart.vue'

const store = useMortgagePayoffStore()
const showResetFeedback = ref(false)

const handleReset = () => {
  store.resetToDefaults()
  showResetFeedback.value = true
  setTimeout(() => {
    showResetFeedback.value = false
  }, 2000)
}

const handleDebug = () => {
  const { testCode } = store.debugState()
  console.log('Debug output generated. Check browser console for details.')
  // Also copy test code to clipboard if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(testCode).then(() => {
      console.log('Test code copied to clipboard!')
    })
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

const formatMonths = (months: number) => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (years === 0) return `${remainingMonths} months`
  if (remainingMonths === 0) return `${years} years`
  return `${years} years, ${remainingMonths} months`
}
</script>

<template>
  <div class="page-container">
    <h2>Mortgage Payoff Calculator</h2>
    <p>Compare different strategies for paying off your mortgage vs investing the extra payments.</p>
    
    <div class="calculator-layout">
      <div class="input-section">
        <h3>Mortgage Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label for="principal">Current Principal Balance</label>
            <input 
              id="principal"
              type="number" 
              v-model.number="store.principal"
              min="0"
              step="1000"
            />
          </div>
          
          <div class="form-group">
            <label for="years-left">Years Remaining</label>
            <input 
              id="years-left"
              type="number" 
              v-model.number="store.yearsLeft"
              min="0"
              max="30"
              step="1"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="interest-rate">Interest Rate (%)</label>
            <input 
              id="interest-rate"
              type="number" 
              v-model.number="store.interestRate"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          
          <div class="form-group">
            <label for="monthly-payment">Monthly P&I Payment</label>
            <input 
              id="monthly-payment"
              type="number" 
              v-model.number="store.monthlyPayment"
              min="0"
              step="10"
            />
          </div>
        </div>
        
        <h3>Additional Payments</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label for="additional-monthly">Extra Monthly Payment</label>
            <input 
              id="additional-monthly"
              type="number" 
              v-model.number="store.additionalMonthlyPayment"
              min="0"
              step="50"
            />
          </div>
          
          <div class="form-group">
            <label for="lump-sum">One-Time Lump Sum</label>
            <input 
              id="lump-sum"
              type="number" 
              v-model.number="store.lumpSumPayment"
              min="0"
              step="1000"
            />
          </div>
        </div>
        
        <div class="collapsible-section">
          <button 
            @click="store.showInvestmentComparison = !store.showInvestmentComparison"
            class="secondary toggle-button"
          >
            {{ store.showInvestmentComparison ? 'Hide' : 'Show' }} Investment Comparison
          </button>
          
          <div v-if="store.showInvestmentComparison" class="investment-inputs">
            <h3>Investment Scenario</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="return-rate">Expected Annual Return (%)</label>
                <input 
                  id="return-rate"
                  type="number" 
                  v-model.number="store.investmentReturnRate"
                  min="0"
                  max="30"
                  step="0.1"
                />
              </div>
              
              <div class="form-group">
                <label for="tax-rate">Capital Gains Tax Rate (%)</label>
                <input 
                  id="tax-rate"
                  type="number" 
                  v-model.number="store.investmentTaxRate"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button @click="handleReset" class="secondary reset-button">
          Reset to Defaults
        </button>
        
        <button @click="handleDebug" class="secondary debug-button" style="margin-top: 0.5rem;">
          Debug State (Console)
        </button>
        
        <div v-if="showResetFeedback" class="reset-feedback">
          ✓ Values reset to defaults
        </div>
      </div>
      
      <div class="results-section">
        <h3>Payoff Comparison</h3>
        
        <div class="comparison-grid">
          <div class="comparison-card">
            <h4>Current Schedule</h4>
            <div class="stat-item">
              <span class="label">Time to Payoff:</span>
              <span class="value">{{ formatMonths(store.basePayoffMonths) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Total Interest:</span>
              <span class="value">{{ formatCurrency(store.baseTotalInterest) }}</span>
            </div>
          </div>
          
          <div class="comparison-card highlight">
            <h4>With Extra Payments</h4>
            <div class="stat-item">
              <span class="label">Time to Payoff:</span>
              <span class="value success">{{ formatMonths(store.acceleratedPayoffMonths) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Total Interest:</span>
              <span class="value success">{{ formatCurrency(store.acceleratedTotalInterest) }}</span>
            </div>
          </div>
        </div>
        
        <div class="savings-summary">
          <h4>Savings Summary</h4>
          <div class="summary-item">
            <span class="label">Time Saved:</span>
            <span class="value highlight">{{ formatMonths(store.monthsSaved) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Interest Saved:</span>
            <span class="value highlight">{{ formatCurrency(store.interestSaved) }}</span>
          </div>
        </div>
        
        <div v-if="store.showInvestmentComparison" class="investment-results">
          <h4>Investment Comparison</h4>
          
          <div class="investment-card">
            <div class="stat-item">
              <span class="label">Investment Value:</span>
              <span class="value">{{ formatCurrency(store.investmentGrossReturn) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Investment Profit:</span>
              <span class="value">{{ formatCurrency(store.investmentProfit) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Taxes Owed:</span>
              <span class="value">{{ formatCurrency(store.investmentTaxes) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Net Investment Return:</span>
              <span class="value highlight">{{ formatCurrency(store.investmentNetReturn) }}</span>
            </div>
          </div>
          
          <div class="recommendation" :class="store.betterStrategy">
            <h5>Recommendation</h5>
            <p v-if="store.betterStrategy === 'payoff'">
              Paying off your mortgage early saves you {{ formatCurrency(store.interestSaved) }} 
              in interest, which is better than the after-tax investment return.
            </p>
            <p v-else>
              Investing the extra payments would yield {{ formatCurrency(store.investmentNetReturn) }} 
              after taxes, which exceeds the {{ formatCurrency(store.interestSaved) }} saved 
              by paying off the mortgage early.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <MortgageBalanceChart />
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

.input-section, .results-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
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

.collapsible-section {
  margin-top: 1.5rem;
}

.toggle-button {
  width: 100%;
  margin-bottom: 1rem;
}

.investment-inputs {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reset-button {
  width: 100%;
  margin-top: 1.5rem;
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

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comparison-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.comparison-card.highlight {
  background: #ecf5ff;
  border-color: #409eff;
}

.comparison-card h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.stat-item, .summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child, .summary-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.value {
  font-weight: 600;
  color: #2c3e50;
}

.value.success {
  color: #27ae60;
}

.value.highlight {
  color: #409eff;
  font-size: 1.1rem;
}

.savings-summary {
  background: #f0f9ff;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.savings-summary h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.investment-results {
  margin-top: 1.5rem;
}

.investment-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.recommendation {
  padding: 1.5rem;
  border-radius: 4px;
  border-left: 4px solid;
}

.recommendation.payoff {
  background: #f0f9ff;
  border-left-color: #409eff;
}

.recommendation.invest {
  background: #f0fdf4;
  border-left-color: #27ae60;
}

.recommendation h5 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.recommendation p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>