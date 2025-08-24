import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  calculateYearsToRetirement,
  calculateRealReturnRate,
  calculateFutureValue,
  adjustTargetForInflation,
  isCoastFireReady,
  calculateAdditionalSavingsNeeded,
  calculateCoastFireAge,
  calculateCoastFireNumber,
  calculateTargetFromMonthlyExpenses,
  calculateExpensesFromTarget,
  generateCoastFireProjectionChart,
  generateRequiredSavingsByAgeChart,
  validateCoastFireInputs,
  type CoastFireInputs
} from '../utils/math'

export const useCoastFireStore = defineStore('coastFire', () => {
  const currentAge = ref(30)
  const retirementAge = ref(65)
  const currentSavings = ref(50000)
  const expectedReturnRate = ref(7)
  const targetRetirementAmount = ref(1000000)
  const monthlyExpenses = ref(0)
  const yearlyExpenses = ref(0)
  const withdrawalRate = ref(4)
  const inflationRate = ref(0)
  const useRealReturns = ref(false)
  const lastEditedField = ref<'target' | 'monthly' | 'yearly'>('target')
  
  const errors = ref({
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    expectedReturnRate: '',
    targetRetirementAmount: '',
    monthlyExpenses: '',
    yearlyExpenses: '',
    withdrawalRate: '',
    inflationRate: ''
  })
  
  const validateInputs = () => {
    const inputs: CoastFireInputs = {
      currentAge: currentAge.value,
      retirementAge: retirementAge.value,
      currentSavings: currentSavings.value,
      expectedReturnRate: expectedReturnRate.value,
      targetRetirementAmount: targetRetirementAmount.value,
      monthlyExpenses: monthlyExpenses.value,
      yearlyExpenses: yearlyExpenses.value,
      withdrawalRate: withdrawalRate.value,
      inflationRate: inflationRate.value
    }
    
    const validation = validateCoastFireInputs(inputs)
    
    // Initialize empty errors first
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: '',
      monthlyExpenses: '',
      yearlyExpenses: '',
      withdrawalRate: '',
      inflationRate: ''
    }
    
    // Then populate with actual errors
    Object.keys(validation.errors).forEach(key => {
      if ((errors.value as any)[key] !== undefined) {
        (errors.value as any)[key] = validation.errors[key] || ''
      }
    })
    
    return validation.isValid
  }
  
  const resetToDefaults = () => {
    currentAge.value = 30
    retirementAge.value = 65
    currentSavings.value = 50000
    expectedReturnRate.value = 7
    targetRetirementAmount.value = 1000000
    monthlyExpenses.value = 0
    yearlyExpenses.value = 0
    withdrawalRate.value = 4
    inflationRate.value = 0
    useRealReturns.value = false
    lastEditedField.value = 'target'
    // Clear validation errors
    errors.value = {
      currentAge: '',
      retirementAge: '',
      currentSavings: '',
      expectedReturnRate: '',
      targetRetirementAmount: '',
      monthlyExpenses: '',
      yearlyExpenses: '',
      withdrawalRate: '',
      inflationRate: ''
    }
  }
  
  const yearsToRetirement = computed(() => {
    return calculateYearsToRetirement(currentAge.value, retirementAge.value)
  })
  
  // Calculate the real (inflation-adjusted) return rate using Fisher equation
  const realReturnRate = computed(() => {
    if (!useRealReturns.value) return expectedReturnRate.value
    
    const realRate = calculateRealReturnRate(expectedReturnRate.value / 100, inflationRate.value / 100)
    return realRate * 100 // Convert back to percentage
  })
  
  // The effective rate to use in calculations (real or nominal based on setting)
  const effectiveReturnRate = computed(() => {
    return useRealReturns.value ? realReturnRate.value : expectedReturnRate.value
  })
  
  const futureValueOfCurrentSavings = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const years = yearsToRetirement.value
    return calculateFutureValue(currentSavings.value, rate, years)
  })
  
  // If using nominal returns, we need to adjust the target for inflation
  const inflationAdjustedTarget = computed(() => {
    if (useRealReturns.value) {
      // When using real returns, target stays in today's dollars
      return activeTargetAmount.value
    } else {
      // When using nominal returns, adjust target for inflation
      return adjustTargetForInflation(activeTargetAmount.value, inflationRate.value / 100, yearsToRetirement.value)
    }
  })
  
  const isCoastFIREReady = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const years = yearsToRetirement.value
    const target = inflationAdjustedTarget.value
    return isCoastFireReady(currentSavings.value, target, rate, years)
  })
  
  const additionalSavingsNeeded = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const years = yearsToRetirement.value
    const target = inflationAdjustedTarget.value
    return calculateAdditionalSavingsNeeded(currentSavings.value, target, rate, years)
  })
  
  const coastFIREAge = computed(() => {
    if (isCoastFIREReady.value) return currentAge.value
    
    const rate = effectiveReturnRate.value / 100
    const target = inflationAdjustedTarget.value
    
    // Handle edge cases that math library might not handle
    if (currentSavings.value <= 0) {
      // If no savings, can't calculate age - return a reasonable default
      return currentAge.value + 100 // Essentially "never" ready
    }
    
    try {
      return calculateCoastFireAge(currentSavings.value, target, rate, currentAge.value)
    } catch (error) {
      // Fallback to old logic if math library fails
      const yearsNeeded = Math.log(target / currentSavings.value) / Math.log(1 + rate)
      return Math.ceil(currentAge.value + yearsNeeded)
    }
  })
  
  // Coast FIRE number: the amount you need saved right now to coast to retirement
  const coastFIRENumber = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const years = yearsToRetirement.value
    const target = inflationAdjustedTarget.value
    return calculateCoastFireNumber(target, rate, years)
  })
  
  const projectionChartData = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const target = activeTargetAmount.value
    const inflationRate_decimal = inflationRate.value / 100
    
    return generateCoastFireProjectionChart(
      currentSavings.value,
      currentAge.value,
      retirementAge.value,
      rate,
      target,
      inflationRate_decimal,
      useRealReturns.value
    )
  })
  
  const targetFromMonthlyExpenses = computed(() => {
    if (monthlyExpenses.value <= 0 || withdrawalRate.value <= 0) return 0
    return Math.round(calculateTargetFromMonthlyExpenses(monthlyExpenses.value, withdrawalRate.value / 100))
  })
  
  const targetFromYearlyExpenses = computed(() => {
    if (yearlyExpenses.value <= 0 || withdrawalRate.value <= 0) return 0
    // Round to nearest dollar (no cents)
    return Math.round(yearlyExpenses.value / (withdrawalRate.value / 100))
  })
  
  const monthlyFromTarget = computed(() => {
    if (targetRetirementAmount.value <= 0 || withdrawalRate.value <= 0) return 0
    return calculateExpensesFromTarget(targetRetirementAmount.value, withdrawalRate.value / 100) / 12
  })
  
  const activeTargetAmount = computed(() => {
    if (lastEditedField.value === 'monthly' && monthlyExpenses.value > 0) {
      return targetFromMonthlyExpenses.value
    }
    if (lastEditedField.value === 'yearly' && yearlyExpenses.value > 0) {
      return targetFromYearlyExpenses.value
    }
    return targetRetirementAmount.value
  })
  
  const syncFromMonthlyExpenses = () => {
    lastEditedField.value = 'monthly'
    // Always sync the values, even when 0
    if (withdrawalRate.value > 0) {
      // Round to nearest dollar (no cents)
      targetRetirementAmount.value = Math.round(targetFromMonthlyExpenses.value)
      // Also update yearly expenses
      yearlyExpenses.value = Math.round(monthlyExpenses.value * 12)
    }
  }
  
  const syncFromYearlyExpenses = () => {
    lastEditedField.value = 'yearly'
    // Always sync the values, even when 0
    if (withdrawalRate.value > 0) {
      // Round to nearest dollar (no cents)
      targetRetirementAmount.value = Math.round(targetFromYearlyExpenses.value)
      // Also update monthly expenses
      monthlyExpenses.value = Math.round(yearlyExpenses.value / 12)
    }
  }
  
  const syncFromTargetAmount = () => {
    lastEditedField.value = 'target'
    // Always sync the values, even when 0
    if (withdrawalRate.value > 0) {
      // Round to nearest dollar (no cents)
      monthlyExpenses.value = Math.round(monthlyFromTarget.value)
      // Also update yearly expenses
      yearlyExpenses.value = Math.round(monthlyExpenses.value * 12)
    }
  }
  
  const requiredSavingsByAge = computed(() => {
    const rate = effectiveReturnRate.value / 100
    const target = activeTargetAmount.value
    const inflationRate_decimal = inflationRate.value / 100
    
    return generateRequiredSavingsByAgeChart(
      target,
      retirementAge.value,
      rate,
      inflationRate_decimal,
      useRealReturns.value
    )
  })
  
  // Tooltip data for mathematical explanations
  const tooltipData = computed(() => ({
    yearsToRetirement: {
      title: 'Years to Retirement Calculation',
      formula: 'Years = Retirement Age - Current Age',
      values: {
        retirementAge: retirementAge.value,
        currentAge: currentAge.value,
        years: yearsToRetirement.value
      },
      calculation: '{retirementAge} - {currentAge} = {years} years',
      result: `${yearsToRetirement.value} years until retirement`,
      explanation: 'Time available for compound growth to work on your investments.'
    },
    
    realReturnRate: {
      title: 'Fisher Equation (Real Returns)',
      formula: 'Real Rate = (1 + nominal) ÷ (1 + inflation) - 1',
      values: {
        nominalRate: Math.round(expectedReturnRate.value * 10) / 10,
        inflationRate: Math.round(inflationRate.value * 10) / 10,
        realRate: Math.round(realReturnRate.value * 10) / 10
      },
      calculation: [
        '(1 + {nominalRate}) ÷ (1 + {inflationRate}) - 1',
        '= {realRateCalculation} - 1',
        '= {realRate}%'
      ],
      result: `${realReturnRate.value.toFixed(2)}% inflation-adjusted return`,
      explanation: 'Why not simple subtraction? The Fisher equation accounts for the compounding interaction between inflation and returns.'
    },
    
    futureValue: {
      title: 'Future Value of Current Savings',
      formula: 'FV = PV × (1 + r)^t',
      values: {
        currentSavings: currentSavings.value,
        effectiveRate: Math.round(effectiveReturnRate.value * 10) / 10,
        years: yearsToRetirement.value,
        futureValue: Math.round(futureValueOfCurrentSavings.value),
        multiplier: Math.round(Math.pow(1 + effectiveReturnRate.value / 100, yearsToRetirement.value) * 1000) / 1000
      },
      calculation: [
        'FV = {currentSavings} × (1 + {effectiveRate})^{years}',
        '= {currentSavings} × {multiplier}',
        '= {futureValue}'
      ],
      result: `Your current savings will grow to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(futureValueOfCurrentSavings.value)}`,
      explanation: 'Compound interest allows your money to grow exponentially over time.'
    },
    
    inflationAdjustedTarget: {
      title: useRealReturns.value ? 'Target Amount (Real Returns)' : 'Inflation-Adjusted Target',
      formula: useRealReturns.value ? 
        'Target = Original Target (no adjustment needed)' : 
        'Adjusted Target = Original × (1 + inflation)^years',
      values: {
        originalTarget: activeTargetAmount.value,
        inflationRate: Math.round(inflationRate.value * 10) / 10,
        years: yearsToRetirement.value,
        adjustedTarget: inflationAdjustedTarget.value
      },
      calculation: useRealReturns.value ? 
        ['Target remains {originalTarget} (using real returns)'] :
        [
          'Adjusted = {originalTarget} × (1 + {inflationRate})^{years}',
          '= {originalTarget} × {inflationMultiplier}',
          '= {adjustedTarget}'
        ],
      result: `Target: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inflationAdjustedTarget.value)}`,
      explanation: useRealReturns.value ?
        'Using real returns, so target stays in today\'s purchasing power.' :
        'Target adjusted for inflation to maintain purchasing power at retirement.'
    },
    
    coastFIREReady: {
      title: 'Coast FIRE Ready Check',
      formula: 'Coast FIRE Ready = Future Value ≥ Target Amount',
      values: {
        futureValue: futureValueOfCurrentSavings.value,
        target: inflationAdjustedTarget.value,
        isReady: isCoastFIREReady.value,
        comparisonResult: isCoastFIREReady.value ? 'TRUE' : 'FALSE'
      },
      calculation: [
        '{futureValue} ≥ {target}',
        '= {comparisonResult}'
      ],
      result: isCoastFIREReady.value ? 'YES - You are Coast FIRE ready!' : 'NO - Not Coast FIRE ready yet',
      explanation: isCoastFIREReady.value ?
        'Your current savings will grow enough to meet your retirement goal.' :
        'You need to save more to let compound interest reach your target.'
    },
    
    additionalSavingsNeeded: {
      title: 'Additional Savings Needed Now',
      formula: 'Additional Needed = Target Present Value - Current Savings',
      values: {
        targetPV: coastFIRENumber.value,
        currentSavings: currentSavings.value,
        additional: additionalSavingsNeeded.value
      },
      calculation: [
        'Target Present Value = {targetPV}',
        'Additional Needed = {targetPV} - {currentSavings}',
        '= {additional}'
      ],
      result: isCoastFIREReady.value ? 
        'No additional savings needed!' :
        `Save ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(additionalSavingsNeeded.value)} more today`,
      explanation: 'This is the lump sum you need to add today to reach Coast FIRE immediately.'
    },
    
    coastFIRENumber: {
      title: 'Coast FIRE Number at Current Age',
      formula: 'Coast FIRE Number = Target ÷ (1 + r)^t',
      values: {
        target: inflationAdjustedTarget.value,
        rate: Math.round(effectiveReturnRate.value * 10) / 10,
        years: yearsToRetirement.value,
        coastNumber: coastFIRENumber.value,
        divisor: Math.round(Math.pow(1 + effectiveReturnRate.value / 100, yearsToRetirement.value) * 1000) / 1000
      },
      calculation: [
        'Coast FIRE Number = {target} ÷ (1 + {rate})^{years}',
        '= {target} ÷ {divisor}',
        '= {coastNumber}'
      ],
      result: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coastFIRENumber.value)} needed at age ${currentAge.value}`,
      explanation: 'This is the exact amount you need saved right now to coast to your retirement goal with compound growth.'
    },
    
    coastFIREAge: {
      title: 'Coast FIRE Age Calculation',
      formula: isCoastFIREReady.value ? 
        'Already Coast FIRE ready at current age' :
        'Years Needed = ln(Target ÷ Current) ÷ ln(1 + r)',
      values: {
        currentAge: currentAge.value,
        target: inflationAdjustedTarget.value,
        currentSavings: currentSavings.value,
        rate: Math.round(effectiveReturnRate.value * 10) / 10,
        coastAge: coastFIREAge.value
      },
      calculation: isCoastFIREReady.value ? 
        ['You are already Coast FIRE ready!'] :
        [
          'Years = ln({target} ÷ {currentSavings}) ÷ ln(1 + {rate})',
          '= ln({ratio}) ÷ ln({onePlusRate})',
          '= {yearsNeeded} years',
          'Coast FIRE Age = {currentAge} + {yearsNeeded} = {coastAge}'
        ],
      result: isCoastFIREReady.value ?
        `Coast FIRE ready now at age ${currentAge.value}` :
        `Coast FIRE ready at age ${coastFIREAge.value}`,
      explanation: isCoastFIREReady.value ?
        'Your current savings are sufficient to reach your retirement goal.' :
        'Age when your current savings (with no additions) will be enough to coast to retirement.'
    },
    
    targetFromExpenses: {
      title: 'Target from Annual Expenses',
      formula: 'Target = Annual Expenses ÷ Withdrawal Rate',
      values: {
        monthlyExpenses: monthlyExpenses.value,
        yearlyExpenses: yearlyExpenses.value,
        withdrawalRate: Math.round(withdrawalRate.value * 10) / 10,
        target: lastEditedField.value === 'yearly' ? targetFromYearlyExpenses.value : targetFromMonthlyExpenses.value
      },
      calculation: lastEditedField.value === 'yearly' ? 
        [
          'Target = {yearlyExpenses} ÷ ({withdrawalRate}% ÷ 100)',
          '= {yearlyExpenses} ÷ {withdrawalRateDecimal}',
          '= {target}'
        ] :
        [
          'Annual Expenses = {monthlyExpenses} × 12 = {yearlyExpenses}',
          'Target = {yearlyExpenses} ÷ ({withdrawalRate}% ÷ 100)',
          '= {yearlyExpenses} ÷ {withdrawalRateDecimal}',
          '= {target}'
        ],
      result: `Need ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activeTargetAmount.value)} for retirement`,
      explanation: `Based on the ${withdrawalRate.value}% safe withdrawal rule. This amount should provide your desired spending in retirement.`
    },
    
    monthlyFromTarget: {
      title: 'Monthly Spending from Target',
      formula: 'Monthly = (Target × Withdrawal Rate) ÷ 12',
      values: {
        target: targetRetirementAmount.value,
        withdrawalRate: Math.round(withdrawalRate.value * 10) / 10,
        monthly: monthlyFromTarget.value
      },
      calculation: [
        'Monthly = ({target} × {withdrawalRate}%) ÷ 12',
        '= ({target} × {withdrawalRateDecimal}) ÷ 12',
        '= {annualWithdrawal} ÷ 12',
        '= {monthly}'
      ],
      result: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyFromTarget.value)} available monthly`,
      explanation: `Based on the ${withdrawalRate.value}% safe withdrawal rate from your target portfolio.`
    }
  }))

  return {
    currentAge,
    retirementAge,
    currentSavings,
    expectedReturnRate,
    targetRetirementAmount,
    monthlyExpenses,
    yearlyExpenses,
    withdrawalRate,
    inflationRate,
    useRealReturns,
    lastEditedField,
    errors,
    validateInputs,
    yearsToRetirement,
    realReturnRate,
    effectiveReturnRate,
    inflationAdjustedTarget,
    futureValueOfCurrentSavings,
    isCoastFIREReady,
    additionalSavingsNeeded,
    coastFIREAge,
    coastFIRENumber,
    projectionChartData,
    requiredSavingsByAge,
    targetFromMonthlyExpenses,
    targetFromYearlyExpenses,
    monthlyFromTarget,
    activeTargetAmount,
    syncFromMonthlyExpenses,
    syncFromYearlyExpenses,
    syncFromTargetAmount,
    resetToDefaults,
    tooltipData
  }
}, {
  persist: {
    key: 'coastFire',
    storage: localStorage
  }
})