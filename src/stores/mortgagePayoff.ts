import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  calculateMonthlyRate,
  calculatePayoff,
  calculateInvestmentValue,
  calculateAfterTaxReturn,
  determineBetterStrategy,
  generateMortgageBalanceChart,
  generateInterestComparisonChart,
  generateInvestmentComparisonChart
} from '../utils/math'

export const useMortgagePayoffStore = defineStore('mortgagePayoff', () => {
  const principal = ref(300000)
  const yearsLeft = ref(25)
  const interestRate = ref(4.5)
  const monthlyPayment = ref(1500)
  const additionalMonthlyPayment = ref(0)
  const lumpSumPayment = ref(0)
  
  const investmentReturnRate = ref(7)
  const investmentTaxRate = ref(20)
  const showInvestmentComparison = ref(false)
  
  const resetToDefaults = () => {
    principal.value = 300000
    yearsLeft.value = 25
    interestRate.value = 4.5
    monthlyPayment.value = 1500
    additionalMonthlyPayment.value = 0
    lumpSumPayment.value = 0
    investmentReturnRate.value = 7
    investmentTaxRate.value = 20
    showInvestmentComparison.value = false
  }
  
  const monthlyInterestRate = computed(() => calculateMonthlyRate(interestRate.value))
  const totalMonths = computed(() => yearsLeft.value * 12)
  
  const calculatePayoffTime = (extraMonthly: number, lumpSum: number) => {
    const totalPayment = monthlyPayment.value + extraMonthly
    
    try {
      const result = calculatePayoff(principal.value, totalPayment, monthlyInterestRate.value, lumpSum)
      return result.months
    } catch (error) {
      // Handle edge cases that the math library rejects
      if (principal.value <= 0 || totalPayment <= 0) {
        return 0
      }
      
      // If payment is too small, return a very large number (essentially never pays off)
      if (totalPayment <= principal.value * monthlyInterestRate.value) {
        return 9999 // Essentially infinite
      }
      
      return 0
    }
  }
  
  const calculateTotalInterest = (extraMonthly: number, lumpSum: number) => {
    const totalPayment = monthlyPayment.value + extraMonthly
    
    try {
      const result = calculatePayoff(principal.value, totalPayment, monthlyInterestRate.value, lumpSum)
      return result.totalInterest
    } catch (error) {
      // Handle edge cases
      if (principal.value <= 0 || totalPayment <= 0) {
        return 0
      }
      
      // If payment is too small, return a very large interest amount
      if (totalPayment <= principal.value * monthlyInterestRate.value) {
        return principal.value * 10 // Essentially infinite interest
      }
      
      return 0
    }
  }
  
  const basePayoffMonths = computed(() => calculatePayoffTime(0, 0))
  const baseTotalInterest = computed(() => calculateTotalInterest(0, 0))
  
  const acceleratedPayoffMonths = computed(() => 
    calculatePayoffTime(additionalMonthlyPayment.value, lumpSumPayment.value)
  )
  const acceleratedTotalInterest = computed(() => 
    calculateTotalInterest(additionalMonthlyPayment.value, lumpSumPayment.value)
  )
  
  const monthsSaved = computed(() => basePayoffMonths.value - acceleratedPayoffMonths.value)
  const interestSaved = computed(() => baseTotalInterest.value - acceleratedTotalInterest.value)
  
  const calculateInvestmentValueInternal = () => {
    const months = acceleratedPayoffMonths.value
    const monthlyReturn = investmentReturnRate.value / 100 / 12
    
    const result = calculateInvestmentValue(
      lumpSumPayment.value,
      additionalMonthlyPayment.value,
      monthlyReturn,
      months
    )
    return result.grossReturn
  }
  
  const investmentGrossReturn = computed(() => calculateInvestmentValueInternal())
  
  const investmentProfit = computed(() => {
    const totalInvested = lumpSumPayment.value + (additionalMonthlyPayment.value * acceleratedPayoffMonths.value)
    return Math.max(0, investmentGrossReturn.value - totalInvested)
  })
  
  const investmentTaxes = computed(() => investmentProfit.value * (investmentTaxRate.value / 100))
  
  const investmentNetReturn = computed(() => {
    const totalInvested = lumpSumPayment.value + (additionalMonthlyPayment.value * acceleratedPayoffMonths.value)
    const result = calculateAfterTaxReturn(
      investmentGrossReturn.value,
      totalInvested,
      investmentTaxRate.value / 100
    )
    return result.netReturn
  })
  
  const betterStrategy = computed(() => {
    const totalInvested = lumpSumPayment.value + (additionalMonthlyPayment.value * acceleratedPayoffMonths.value)
    const investmentNetBenefit = investmentNetReturn.value - totalInvested
    
    return determineBetterStrategy(interestSaved.value, investmentNetBenefit)
  })
  
  const balanceChartData = computed(() => {
    return generateMortgageBalanceChart(
      principal.value,
      monthlyPayment.value,
      additionalMonthlyPayment.value,
      monthlyInterestRate.value,
      lumpSumPayment.value
    )
  })
  
  const interestComparisonChartData = computed(() => {
    return generateInterestComparisonChart(
      principal.value,
      monthlyPayment.value,
      additionalMonthlyPayment.value,
      monthlyInterestRate.value,
      lumpSumPayment.value
    )
  })
  
  const investmentComparisonChartData = computed(() => {
    if (!showInvestmentComparison.value) return null
    
    return generateInvestmentComparisonChart(
      principal.value,
      monthlyPayment.value,
      additionalMonthlyPayment.value,
      monthlyInterestRate.value,
      lumpSumPayment.value,
      investmentReturnRate.value / 100 / 12,
      investmentTaxRate.value / 100
    )
  })
  
  const debugState = () => {
    const state = {
      // Input values
      inputs: {
        principal: principal.value,
        yearsLeft: yearsLeft.value,
        interestRate: interestRate.value,
        monthlyPayment: monthlyPayment.value,
        additionalMonthlyPayment: additionalMonthlyPayment.value,
        lumpSumPayment: lumpSumPayment.value,
        investmentReturnRate: investmentReturnRate.value,
        investmentTaxRate: investmentTaxRate.value,
        showInvestmentComparison: showInvestmentComparison.value
      },
      // Computed values
      computed: {
        monthlyInterestRate: monthlyInterestRate.value,
        totalMonths: totalMonths.value,
        basePayoffMonths: basePayoffMonths.value,
        baseTotalInterest: baseTotalInterest.value,
        acceleratedPayoffMonths: acceleratedPayoffMonths.value,
        acceleratedTotalInterest: acceleratedTotalInterest.value,
        monthsSaved: monthsSaved.value,
        interestSaved: interestSaved.value,
        investmentGrossReturn: investmentGrossReturn.value,
        investmentProfit: investmentProfit.value,
        investmentTaxes: investmentTaxes.value,
        investmentNetReturn: investmentNetReturn.value,
        betterStrategy: betterStrategy.value
      }
    }
    
    // Generate test code
    const testCode = `
// Test case for mortgage payoff calculator
it('should calculate mortgage payoff correctly', () => {
  const store = useMortgagePayoffStore()
  
  // Set input values
  store.principal = ${principal.value}
  store.yearsLeft = ${yearsLeft.value}
  store.interestRate = ${interestRate.value}
  store.monthlyPayment = ${monthlyPayment.value}
  store.additionalMonthlyPayment = ${additionalMonthlyPayment.value}
  store.lumpSumPayment = ${lumpSumPayment.value}
  store.investmentReturnRate = ${investmentReturnRate.value}
  store.investmentTaxRate = ${investmentTaxRate.value}
  store.showInvestmentComparison = ${showInvestmentComparison.value}
  
  // Verify computed values
  expect(store.monthlyInterestRate).toBeCloseTo(${monthlyInterestRate.value}, 6)
  expect(store.totalMonths).toBe(${totalMonths.value})
  expect(store.basePayoffMonths).toBe(${basePayoffMonths.value})
  expect(store.baseTotalInterest).toBeCloseTo(${baseTotalInterest.value}, 2)
  expect(store.acceleratedPayoffMonths).toBe(${acceleratedPayoffMonths.value})
  expect(store.acceleratedTotalInterest).toBeCloseTo(${acceleratedTotalInterest.value}, 2)
  expect(store.monthsSaved).toBe(${monthsSaved.value})
  expect(store.interestSaved).toBeCloseTo(${interestSaved.value}, 2)
  ${showInvestmentComparison.value ? `expect(store.investmentGrossReturn).toBeCloseTo(${investmentGrossReturn.value}, 2)
  expect(store.investmentProfit).toBeCloseTo(${investmentProfit.value}, 2)
  expect(store.investmentTaxes).toBeCloseTo(${investmentTaxes.value}, 2)
  expect(store.investmentNetReturn).toBeCloseTo(${investmentNetReturn.value}, 2)
  expect(store.betterStrategy).toBe('${betterStrategy.value}')` : '// Investment comparison not enabled'}
})`
    
    console.log('=== Mortgage Payoff Calculator Debug State ===')
    console.log(JSON.stringify(state, null, 2))
    console.log('\n=== Generated Test Code ===')
    console.log(testCode)
    
    return { state, testCode }
  }
  
  return {
    principal,
    yearsLeft,
    interestRate,
    monthlyPayment,
    additionalMonthlyPayment,
    lumpSumPayment,
    investmentReturnRate,
    investmentTaxRate,
    showInvestmentComparison,
    monthlyInterestRate,
    totalMonths,
    basePayoffMonths,
    baseTotalInterest,
    acceleratedPayoffMonths,
    acceleratedTotalInterest,
    monthsSaved,
    interestSaved,
    investmentGrossReturn,
    investmentProfit,
    investmentTaxes,
    investmentNetReturn,
    betterStrategy,
    balanceChartData,
    interestComparisonChartData,
    investmentComparisonChartData,
    resetToDefaults,
    debugState
  }
}, {
  persist: {
    key: 'mortgagePayoff',
    storage: localStorage
  }
})