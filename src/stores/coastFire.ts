import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCoastFireStore = defineStore('coastFire', () => {
  const currentAge = ref(30)
  const retirementAge = ref(65)
  const currentSavings = ref(50000)
  const expectedReturnRate = ref(7)
  const targetRetirementAmount = ref(1000000)
  
  const errors = ref({
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    expectedReturnRate: '',
    targetRetirementAmount: ''
  })
  
  const validateInputs = () => {
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: ''
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
    
    return isValid
  }
  
  const resetToDefaults = () => {
    currentAge.value = 30
    retirementAge.value = 65
    currentSavings.value = 50000
    expectedReturnRate.value = 7
    targetRetirementAmount.value = 1000000
    // Clear validation errors
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: ''
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
    return futureValueOfCurrentSavings.value >= targetRetirementAmount.value
  })
  
  const additionalSavingsNeeded = computed(() => {
    if (isCoastFIREReady.value) return 0
    const rate = expectedReturnRate.value / 100
    const years = yearsToRetirement.value
    if (years === 0) return targetRetirementAmount.value - currentSavings.value
    const presentValue = targetRetirementAmount.value / Math.pow(1 + rate, years)
    return Math.max(0, presentValue - currentSavings.value)
  })
  
  const coastFIREAge = computed(() => {
    if (isCoastFIREReady.value) return currentAge.value
    
    const rate = expectedReturnRate.value / 100
    const yearsNeeded = Math.log(targetRetirementAmount.value / currentSavings.value) / Math.log(1 + rate)
    return Math.ceil(retirementAge.value - yearsNeeded)
  })
  
  return {
    currentAge,
    retirementAge,
    currentSavings,
    expectedReturnRate,
    targetRetirementAmount,
    errors,
    validateInputs,
    yearsToRetirement,
    futureValueOfCurrentSavings,
    isCoastFIREReady,
    additionalSavingsNeeded,
    coastFIREAge,
    resetToDefaults
  }
}, {
  persist: {
    key: 'coastFire',
    storage: localStorage
  }
})