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
  
  const balanceChartData = computed(() => {
    const months: string[] = []
    const standardBalances: number[] = []
    const acceleratedBalances: number[] = []
    
    let standardBalance = principal.value
    let acceleratedBalance = principal.value - lumpSumPayment.value
    
    const rate = monthlyInterestRate.value
    const basePayment = monthlyPayment.value
    const extraPayment = additionalMonthlyPayment.value
    
    const maxMonths = Math.max(basePayoffMonths.value, acceleratedPayoffMonths.value)
    
    for (let month = 0; month <= maxMonths; month++) {
      months.push(month === 0 ? 'Start' : `Month ${month}`)
      
      // Standard balance calculation
      if (month === 0) {
        standardBalances.push(standardBalance)
      } else if (standardBalance > 0) {
        const interestCharge = standardBalance * rate
        const principalPayment = basePayment - interestCharge
        standardBalance = Math.max(0, standardBalance - principalPayment)
        standardBalances.push(standardBalance)
      } else {
        standardBalances.push(0)
      }
      
      // Accelerated balance calculation
      if (month === 0) {
        acceleratedBalances.push(acceleratedBalance)
      } else if (acceleratedBalance > 0) {
        const interestCharge = acceleratedBalance * rate
        const principalPayment = basePayment + extraPayment - interestCharge
        acceleratedBalance = Math.max(0, acceleratedBalance - principalPayment)
        acceleratedBalances.push(acceleratedBalance)
      } else {
        acceleratedBalances.push(0)
      }
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Standard Payoff',
          data: standardBalances,
          borderColor: '#95a5a6',
          backgroundColor: '#95a5a633',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Accelerated Payoff',
          data: acceleratedBalances,
          borderColor: '#27ae60',
          backgroundColor: '#27ae6033',
          fill: false,
          tension: 0.4
        }
      ]
    }
  })
  
  const interestComparisonChartData = computed(() => {
    const months: string[] = []
    const standardInterest: number[] = []
    const acceleratedInterest: number[] = []
    
    let standardBalance = principal.value
    let acceleratedBalance = principal.value - lumpSumPayment.value
    let standardCumulativeInterest = 0
    let acceleratedCumulativeInterest = 0
    
    const rate = monthlyInterestRate.value
    const basePayment = monthlyPayment.value
    const extraPayment = additionalMonthlyPayment.value
    
    const maxMonths = Math.max(basePayoffMonths.value, acceleratedPayoffMonths.value)
    
    for (let month = 0; month <= maxMonths; month++) {
      if (month % 12 === 0) {  // Show yearly data points
        months.push(month === 0 ? 'Start' : `Year ${month / 12}`)
        
        // Calculate cumulative interest for the year
        for (let m = 0; m < 12 && (month + m) <= maxMonths; m++) {
          // Standard interest
          if (standardBalance > 0) {
            const interest = standardBalance * rate
            standardCumulativeInterest += interest
            const principalPayment = basePayment - interest
            standardBalance = Math.max(0, standardBalance - principalPayment)
          }
          
          // Accelerated interest
          if (acceleratedBalance > 0) {
            const interest = acceleratedBalance * rate
            acceleratedCumulativeInterest += interest
            const principalPayment = basePayment + extraPayment - interest
            acceleratedBalance = Math.max(0, acceleratedBalance - principalPayment)
          }
        }
        
        standardInterest.push(standardCumulativeInterest)
        acceleratedInterest.push(acceleratedCumulativeInterest)
      }
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Standard Payoff Interest',
          data: standardInterest,
          borderColor: '#e74c3c',
          backgroundColor: '#e74c3c33',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Accelerated Payoff Interest',
          data: acceleratedInterest,
          borderColor: '#27ae60',
          backgroundColor: '#27ae6033',
          fill: true,
          tension: 0.4
        }
      ]
    }
  })
  
  const investmentComparisonChartData = computed(() => {
    if (!showInvestmentComparison.value) return null
    
    const months: string[] = []
    const mortgageValues: number[] = []
    const investmentValues: number[] = []
    
    const monthlyReturn = investmentReturnRate.value / 100 / 12
    let investmentValue = lumpSumPayment.value
    
    const payoffMonths = acceleratedPayoffMonths.value
    
    for (let month = 0; month <= payoffMonths; month++) {
      if (month % 12 === 0) {  // Show yearly data points
        months.push(month === 0 ? 'Start' : `Year ${month / 12}`)
        
        // Calculate mortgage value (equity gained from paying down principal + interest saved)
        const equityGained = principal.value - (principal.value * Math.pow(1 + monthlyInterestRate.value, -month))
        const interestSavedSoFar = (baseTotalInterest.value / basePayoffMonths.value) * month - 
                                    (acceleratedTotalInterest.value / acceleratedPayoffMonths.value) * month
        mortgageValues.push(equityGained + Math.max(0, interestSavedSoFar))
        
        // Calculate investment value
        if (month === 0) {
          investmentValue = lumpSumPayment.value
        } else {
          // Compound the lump sum
          investmentValue = lumpSumPayment.value * Math.pow(1 + monthlyReturn, month)
          // Add monthly contributions compounded
          if (additionalMonthlyPayment.value > 0) {
            const monthlyGrowth = additionalMonthlyPayment.value * 
              ((Math.pow(1 + monthlyReturn, month) - 1) / monthlyReturn)
            investmentValue += monthlyGrowth
          }
        }
        
        // Apply taxes to gains
        const totalInvested = lumpSumPayment.value + (additionalMonthlyPayment.value * month)
        const gains = investmentValue - totalInvested
        const taxOnGains = gains * (investmentTaxRate.value / 100)
        investmentValues.push(investmentValue - taxOnGains)
      }
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Mortgage Payoff Value',
          data: mortgageValues,
          borderColor: '#409eff',
          backgroundColor: '#409eff33',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Investment Value (After Tax)',
          data: investmentValues,
          borderColor: '#f39c12',
          backgroundColor: '#f39c1233',
          fill: false,
          tension: 0.4
        }
      ]
    }
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
    resetToDefaults
  }
}, {
  persist: {
    key: 'mortgagePayoff',
    storage: localStorage
  }
})