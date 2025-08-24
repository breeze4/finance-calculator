import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCoastFireStore = defineStore('coastFire', () => {
  const currentAge = ref(30)
  const retirementAge = ref(65)
  const currentSavings = ref(50000)
  const expectedReturnRate = ref(7)
  const targetRetirementAmount = ref(1000000)
  const monthlyExpenses = ref(0)
  const withdrawalRate = ref(4)
  const lastEditedField = ref<'target' | 'monthly'>('target')
  
  const errors = ref({
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    expectedReturnRate: '',
    targetRetirementAmount: '',
    monthlyExpenses: '',
    withdrawalRate: ''
  })
  
  const validateInputs = () => {
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: '',
      monthlyExpenses: '',
      withdrawalRate: ''
    }
    
    let isValid = true
    
    if (currentAge.value < 18 || currentAge.value > 100) {
      errors.value.currentAge = 'Age must be between 18 and 100'
      isValid = false
    }
    
    if (retirementAge.value < currentAge.value) {
      errors.value.retirementAge = 'Retirement age must be greater than current age'
      isValid = false
    }
    
    if (retirementAge.value > 100) {
      errors.value.retirementAge = 'Retirement age must be 100 or less'
      isValid = false
    }
    
    if (currentSavings.value < 0) {
      errors.value.currentSavings = 'Savings cannot be negative'
      isValid = false
    }
    
    if (expectedReturnRate.value < 0 || expectedReturnRate.value > 30) {
      errors.value.expectedReturnRate = 'Return rate must be between 0% and 30%'
      isValid = false
    }
    
    if (targetRetirementAmount.value <= 0) {
      errors.value.targetRetirementAmount = 'Target amount must be greater than 0'
      isValid = false
    }
    
    if (monthlyExpenses.value < 0) {
      errors.value.monthlyExpenses = 'Monthly expenses cannot be negative'
      isValid = false
    }
    
    if (withdrawalRate.value < 2 || withdrawalRate.value > 8) {
      errors.value.withdrawalRate = 'Withdrawal rate should be between 2% and 8%'
      isValid = false
    }
    
    return isValid
  }
  
  const resetToDefaults = () => {
    currentAge.value = 30
    retirementAge.value = 65
    currentSavings.value = 50000
    expectedReturnRate.value = 7
    targetRetirementAmount.value = 1000000
    monthlyExpenses.value = 0
    withdrawalRate.value = 4
    lastEditedField.value = 'target'
    // Clear validation errors
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: '',
      monthlyExpenses: '',
      withdrawalRate: ''
    }
  }
  
  const yearsToRetirement = computed(() => {
    return Math.max(0, retirementAge.value - currentAge.value)
  })
  
  const futureValueOfCurrentSavings = computed(() => {
    const rate = expectedReturnRate.value / 100
    const years = yearsToRetirement.value
    return currentSavings.value * Math.pow(1 + rate, years)
  })
  
  const isCoastFIREReady = computed(() => {
    return futureValueOfCurrentSavings.value >= activeTargetAmount.value
  })
  
  const additionalSavingsNeeded = computed(() => {
    if (isCoastFIREReady.value) return 0
    const rate = expectedReturnRate.value / 100
    const years = yearsToRetirement.value
    const target = activeTargetAmount.value
    if (years === 0) return target - currentSavings.value
    const presentValue = target / Math.pow(1 + rate, years)
    return Math.max(0, presentValue - currentSavings.value)
  })
  
  const coastFIREAge = computed(() => {
    if (isCoastFIREReady.value) return currentAge.value
    
    const rate = expectedReturnRate.value / 100
    const target = activeTargetAmount.value
    const yearsNeeded = Math.log(target / currentSavings.value) / Math.log(1 + rate)
    return Math.ceil(currentAge.value + yearsNeeded)
  })
  
  const projectionChartData = computed(() => {
    const ages: number[] = []
    const projectedValues: number[] = []
    const targetValues: number[] = []
    
    const rate = expectedReturnRate.value / 100
    const years = yearsToRetirement.value
    
    // Generate data points for each year from current age to retirement
    for (let i = 0; i <= years; i++) {
      const age = currentAge.value + i
      ages.push(age)
      
      // Calculate projected value at this age
      const projectedValue = currentSavings.value * Math.pow(1 + rate, i)
      projectedValues.push(projectedValue)
      
      // Target value is constant
      targetValues.push(activeTargetAmount.value)
    }
    
    return {
      labels: ages.map(age => `Age ${age}`),
      datasets: [
        {
          label: 'Projected Savings',
          data: projectedValues,
          borderColor: '#409eff',
          backgroundColor: '#409eff33',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Target Amount',
          data: targetValues,
          borderColor: '#e74c3c',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    }
  })
  
  const targetFromMonthlyExpenses = computed(() => {
    if (monthlyExpenses.value <= 0 || withdrawalRate.value <= 0) return 0
    // Round to nearest dollar (no cents)
    return Math.round((monthlyExpenses.value * 12) / (withdrawalRate.value / 100))
  })
  
  const monthlyFromTarget = computed(() => {
    if (targetRetirementAmount.value <= 0 || withdrawalRate.value <= 0) return 0
    return (targetRetirementAmount.value * (withdrawalRate.value / 100)) / 12
  })
  
  const activeTargetAmount = computed(() => {
    if (lastEditedField.value === 'monthly' && monthlyExpenses.value > 0) {
      return targetFromMonthlyExpenses.value
    }
    return targetRetirementAmount.value
  })
  
  const syncFromMonthlyExpenses = () => {
    lastEditedField.value = 'monthly'
    // Always sync the values, even when 0
    if (withdrawalRate.value > 0) {
      // Round to nearest dollar (no cents)
      targetRetirementAmount.value = Math.round(targetFromMonthlyExpenses.value)
    }
  }
  
  const syncFromTargetAmount = () => {
    lastEditedField.value = 'target'
    // Always sync the values, even when 0
    if (withdrawalRate.value > 0) {
      // Round to nearest dollar (no cents)
      monthlyExpenses.value = Math.round(monthlyFromTarget.value)
    }
  }
  
  const requiredSavingsByAge = computed(() => {
    const ages: number[] = []
    const requiredSavings: number[] = []
    
    const rate = expectedReturnRate.value / 100
    
    // Calculate required savings for ages from 20 to 50
    for (let age = 20; age <= 50; age += 5) {
      ages.push(age)
      
      const yearsToRetire = retirementAge.value - age
      if (yearsToRetire > 0) {
        const presentValue = activeTargetAmount.value / Math.pow(1 + rate, yearsToRetire)
        requiredSavings.push(presentValue)
      } else {
        requiredSavings.push(activeTargetAmount.value)
      }
    }
    
    return {
      labels: ages.map(age => `Age ${age}`),
      datasets: [
        {
          label: 'Required Savings to Coast',
          data: requiredSavings,
          borderColor: '#27ae60',
          backgroundColor: '#27ae6033',
          fill: true,
          tension: 0.4
        }
      ]
    }
  })
  
  return {
    currentAge,
    retirementAge,
    currentSavings,
    expectedReturnRate,
    targetRetirementAmount,
    monthlyExpenses,
    withdrawalRate,
    lastEditedField,
    errors,
    validateInputs,
    yearsToRetirement,
    futureValueOfCurrentSavings,
    isCoastFIREReady,
    additionalSavingsNeeded,
    coastFIREAge,
    projectionChartData,
    requiredSavingsByAge,
    targetFromMonthlyExpenses,
    monthlyFromTarget,
    activeTargetAmount,
    syncFromMonthlyExpenses,
    syncFromTargetAmount,
    resetToDefaults
  }
}, {
  persist: {
    key: 'coastFire',
    storage: localStorage
  }
})