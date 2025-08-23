import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMortgagePayoffStore = defineStore('mortgagePayoff', () => {
  const principal = ref(300000)
  const yearsLeft = ref(25)
  const interestRate = ref(4.5)
  const monthlyPayment = ref(1500)
  const additionalMonthlyPayment = ref(0)
  const lumpSumPayment = ref(0)
  
  const investmentReturnRate = ref(7)
  const investmentTaxRate = ref(20)
  
  const resetToDefaults = () => {
    principal.value = 300000
    yearsLeft.value = 25
    interestRate.value = 4.5
    monthlyPayment.value = 1500
    additionalMonthlyPayment.value = 0
    lumpSumPayment.value = 0
    investmentReturnRate.value = 7
    investmentTaxRate.value = 20
  }
  
  const monthlyInterestRate = computed(() => interestRate.value / 100 / 12)
  const totalMonths = computed(() => yearsLeft.value * 12)
  
  const calculatePayoffTime = (extraMonthly: number, lumpSum: number) => {
    let balance = principal.value - lumpSum
    let months = 0
    const payment = monthlyPayment.value + extraMonthly
    const rate = monthlyInterestRate.value
    
    while (balance > 0 && months < totalMonths.value * 2) {
      const interestCharge = balance * rate
      const principalPayment = payment - interestCharge
      balance -= principalPayment
      months++
      
      if (balance < 0) balance = 0
    }
    
    return months
  }
  
  const calculateTotalInterest = (extraMonthly: number, lumpSum: number) => {
    let balance = principal.value - lumpSum
    let totalInterest = 0
    let months = 0
    const payment = monthlyPayment.value + extraMonthly
    const rate = monthlyInterestRate.value
    
    while (balance > 0 && months < totalMonths.value * 2) {
      const interestCharge = balance * rate
      totalInterest += interestCharge
      const principalPayment = payment - interestCharge
      balance -= principalPayment
      months++
      
      if (balance < 0) balance = 0
    }
    
    return totalInterest
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
  
  const calculateInvestmentValue = () => {
    const months = acceleratedPayoffMonths.value
    const monthlyReturn = investmentReturnRate.value / 100 / 12
    
    let investmentValue = lumpSumPayment.value * Math.pow(1 + monthlyReturn, months)
    
    if (additionalMonthlyPayment.value > 0) {
      const futureValue = additionalMonthlyPayment.value * 
        ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
      investmentValue += futureValue
    }
    
    return investmentValue
  }
  
  const investmentGrossReturn = computed(() => calculateInvestmentValue())
  
  const investmentProfit = computed(() => {
    const totalInvested = lumpSumPayment.value + (additionalMonthlyPayment.value * acceleratedPayoffMonths.value)
    return investmentGrossReturn.value - totalInvested
  })
  
  const investmentTaxes = computed(() => investmentProfit.value * (investmentTaxRate.value / 100))
  
  const investmentNetReturn = computed(() => investmentGrossReturn.value - investmentTaxes.value)
  
  const betterStrategy = computed(() => {
    return investmentNetReturn.value > (principal.value + interestSaved.value) ? 'invest' : 'payoff'
  })
  
  return {
    principal,
    yearsLeft,
    interestRate,
    monthlyPayment,
    additionalMonthlyPayment,
    lumpSumPayment,
    investmentReturnRate,
    investmentTaxRate,
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
    resetToDefaults
  }
}, {
  persist: true
})