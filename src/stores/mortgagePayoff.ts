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
    // Use the base payoff time if accelerated time is invalid (9999 = never pays off)
    // This ensures investment comparison uses a reasonable timeframe
    const months = acceleratedPayoffMonths.value >= 9999 
      ? basePayoffMonths.value >= 9999 
        ? totalMonths.value // Fall back to original loan term
        : basePayoffMonths.value
      : acceleratedPayoffMonths.value
    
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
    return Math.max(0, investmentGrossReturn.value - totalAllContributions.value)
  })
  
  const investmentTaxes = computed(() => investmentProfit.value * (investmentTaxRate.value / 100))
  
  const investmentNetReturn = computed(() => {
    const result = calculateAfterTaxReturn(
      investmentGrossReturn.value,
      totalAllContributions.value,
      investmentTaxRate.value / 100
    )
    return result.netReturn
  })
  
  const investmentNetBenefit = computed(() => {
    return investmentNetReturn.value - totalAllContributions.value
  })
  
  const betterStrategy = computed(() => {
    return determineBetterStrategy(interestSaved.value, investmentNetBenefit.value)
  })
  
  const totalMonthlyContributions = computed(() => {
    // Use same logic as investment calculation for consistency
    const months = acceleratedPayoffMonths.value >= 9999 
      ? basePayoffMonths.value >= 9999 
        ? totalMonths.value // Fall back to original loan term
        : basePayoffMonths.value
      : acceleratedPayoffMonths.value
    
    return additionalMonthlyPayment.value * months
  })
  
  const totalLumpSumContributions = computed(() => {
    return lumpSumPayment.value
  })
  
  const totalAllContributions = computed(() => {
    return totalMonthlyContributions.value + totalLumpSumContributions.value
  })
  
  const balanceChartData = computed(() => {
    try {
      return generateMortgageBalanceChart(
        principal.value,
        monthlyPayment.value,
        additionalMonthlyPayment.value,
        monthlyInterestRate.value,
        lumpSumPayment.value
      )
    } catch (error) {
      // Return empty chart data when payment doesn't cover interest
      return {
        labels: ['Start'],
        datasets: [
          {
            label: 'Standard Payments',
            data: [principal.value],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.1
          },
          {
            label: 'With Extra Payments',
            data: [principal.value - lumpSumPayment.value],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.1
          }
        ]
      }
    }
  })
  
  const interestComparisonChartData = computed(() => {
    try {
      return generateInterestComparisonChart(
        principal.value,
        monthlyPayment.value,
        additionalMonthlyPayment.value,
        monthlyInterestRate.value,
        lumpSumPayment.value
      )
    } catch (error) {
      // Return empty chart data when payment doesn't cover interest
      return {
        labels: ['Standard', 'With Extra Payments'],
        datasets: [
          {
            label: 'Total Interest Paid',
            data: [baseTotalInterest.value, acceleratedTotalInterest.value],
            backgroundColor: ['rgba(239, 68, 68, 0.6)', 'rgba(34, 197, 94, 0.6)'],
            borderColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
            borderWidth: 2
          }
        ]
      }
    }
  })
  
  const investmentComparisonChartData = computed(() => {
    if (!showInvestmentComparison.value) return null
    
    try {
      return generateInvestmentComparisonChart(
        principal.value,
        monthlyPayment.value,
        additionalMonthlyPayment.value,
        monthlyInterestRate.value,
        lumpSumPayment.value,
        investmentReturnRate.value / 100 / 12,
        investmentTaxRate.value / 100
      )
    } catch (error) {
      // Return null when chart can't be generated
      return null
    }
  })
  
  // Tooltip data for mathematical explanations
  const tooltipData = computed(() => ({
    monthlyInterestRate: {
      title: 'Monthly Interest Rate Calculation',
      formula: 'Monthly Rate = Annual Rate ÷ 12',
      values: {
        annualRate: interestRate.value,
        monthlyRate: (monthlyInterestRate.value * 100).toFixed(3)
      },
      calculation: [
        '{annualRate}% ÷ 12 = {monthlyRate}%'
      ],
      result: `${(monthlyInterestRate.value * 100).toFixed(3)}% per month`,
      explanation: 'Standard mortgage calculation - annual rate divided by 12 months for monthly compounding.'
    },
    
    basePayoffTime: {
      title: 'Base Payoff Time Calculation',
      formula: 'Amortization Schedule: Monthly payments until balance = 0',
      values: {
        principal: principal.value,
        monthlyPayment: monthlyPayment.value,
        monthlyRate: (monthlyInterestRate.value * 100).toFixed(3),
        months: basePayoffMonths.value
      },
      calculation: [
        'Each month: Interest = Balance × {monthlyRate}%',
        'Principal Payment = {monthlyPayment} - Interest',
        'New Balance = Balance - Principal Payment',
        'Repeat until balance reaches $0'
      ],
      result: `${Math.floor(basePayoffMonths.value / 12)} years, ${basePayoffMonths.value % 12} months`,
      explanation: 'Standard amortization schedule with regular monthly payments only.'
    },
    
    acceleratedPayoffTime: {
      title: 'Accelerated Payoff Time Calculation',
      formula: 'Modified Amortization: Regular + Extra payments until balance = 0',
      values: {
        principal: principal.value,
        regularPayment: monthlyPayment.value,
        extraMonthly: additionalMonthlyPayment.value,
        lumpSum: lumpSumPayment.value,
        totalPayment: monthlyPayment.value + additionalMonthlyPayment.value,
        months: acceleratedPayoffMonths.value
      },
      calculation: [
        'Total Monthly Payment = {regularPayment} + {extraMonthly} = {totalPayment}',
        'Lump Sum Applied: {lumpSum}',
        'Each month: Interest = Balance × Monthly Rate',
        'Principal Payment = {totalPayment} - Interest',
        'Extra payments reduce principal faster'
      ],
      result: `${Math.floor(acceleratedPayoffMonths.value / 12)} years, ${acceleratedPayoffMonths.value % 12} months`,
      explanation: 'Amortization with extra payments - additional amounts go directly to principal.'
    },
    
    interestSaved: {
      title: 'Interest Saved Calculation',
      formula: 'Interest Saved = Base Total Interest - Accelerated Total Interest',
      values: {
        baseTotalInterest: baseTotalInterest.value,
        acceleratedTotalInterest: acceleratedTotalInterest.value,
        interestSaved: interestSaved.value
      },
      calculation: [
        'Base Total Interest = {baseTotalInterest}',
        'Accelerated Total Interest = {acceleratedTotalInterest}',
        'Interest Saved = {baseTotalInterest} - {acceleratedTotalInterest}',
        '= {interestSaved}'
      ],
      result: `Save ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(interestSaved.value)}`,
      explanation: 'Extra payments reduce the loan balance faster, so less interest accrues over the life of the loan.'
    },
    
    totalContributions: {
      title: 'Total Contributions Calculation',
      formula: 'Total = (Extra Monthly × Months) + Lump Sum',
      values: {
        extraMonthly: additionalMonthlyPayment.value,
        months: acceleratedPayoffMonths.value,
        monthlyTotal: totalMonthlyContributions.value,
        lumpSum: lumpSumPayment.value,
        totalAll: totalAllContributions.value
      },
      calculation: [
        'Monthly Contributions = {extraMonthly} × {months} = {monthlyTotal}',
        'Lump Sum Contributions = {lumpSum}',
        'Total All Contributions = {monthlyTotal} + {lumpSum} = {totalAll}'
      ],
      result: `Total extra payments: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAllContributions.value)}`,
      explanation: 'Sum of all additional money put toward the mortgage beyond regular payments.'
    },
    
    investmentGrossReturn: {
      title: 'Investment Gross Return Calculation',
      formula: 'Compound Growth: Lump Sum + Monthly Contributions',
      values: {
        lumpSum: lumpSumPayment.value,
        monthlyContrib: additionalMonthlyPayment.value,
        monthlyReturn: ((investmentReturnRate.value / 100 / 12) * 100).toFixed(3),
        months: acceleratedPayoffMonths.value,
        grossReturn: investmentGrossReturn.value
      },
      calculation: [
        'Monthly Return Rate = {monthlyReturn}%',
        'Lump Sum Growth: {lumpSum} × (1 + rate)^{months}',
        'Monthly Contributions: {monthlyContrib}/month compounded',
        'Total Investment Value = Lump Sum FV + Monthly FV'
      ],
      result: `Investment grows to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investmentGrossReturn.value)}`,
      explanation: 'If extra payments were invested instead, this would be the gross return before taxes.'
    },
    
    investmentProfit: {
      title: 'Investment Profit Calculation',
      formula: 'Profit = Gross Investment Return - Total Amount Invested',
      values: {
        grossReturn: investmentGrossReturn.value,
        totalInvested: totalAllContributions.value,
        profit: investmentProfit.value
      },
      calculation: [
        'Gross Investment Return = {grossReturn}',
        'Total Amount Invested = {totalInvested}',
        'Taxable Profit = {grossReturn} - {totalInvested}',
        '= {profit}'
      ],
      result: `Taxable profit: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investmentProfit.value)}`,
      explanation: 'Only the profit portion (gains) of your investment is subject to capital gains tax, not the entire return.'
    },
    
    investmentTaxes: {
      title: 'Capital Gains Tax Calculation',
      formula: 'Taxes Owed = Investment Profit × Tax Rate',
      values: {
        profit: investmentProfit.value,
        taxRate: investmentTaxRate.value,
        taxes: investmentTaxes.value
      },
      calculation: [
        'Investment Profit = {profit}',
        'Capital Gains Tax Rate = {taxRate}%',
        'Taxes Owed = {profit} × {taxRate}%',
        '= {taxes}'
      ],
      result: `Capital gains tax: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investmentTaxes.value)}`,
      explanation: 'Capital gains tax is only applied to the profit portion of your investment, reducing your net return.'
    },
    
    investmentNetReturn: {
      title: 'Investment Net Return (After Tax)',
      formula: 'Net Return = Gross Return - (Profit × Tax Rate)',
      values: {
        grossReturn: investmentGrossReturn.value,
        totalInvested: totalAllContributions.value,
        profit: investmentProfit.value,
        taxRate: investmentTaxRate.value,
        taxes: investmentTaxes.value,
        netReturn: investmentNetReturn.value
      },
      calculation: [
        'Gross Return = {grossReturn}',
        'Total Invested = {totalInvested}',
        'Taxable Profit = {grossReturn} - {totalInvested} = {profit}',
        'Taxes = {profit} × {taxRate}% = {taxes}',
        'Net Return = {grossReturn} - {taxes} = {netReturn}'
      ],
      result: `After-tax investment value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investmentNetReturn.value)}`,
      explanation: 'Investment return after capital gains taxes - the real value you would keep.'
    },
    
    investmentNetBenefit: {
      title: 'Investment Net Benefit (True Gain)',
      formula: 'Net Benefit = After-Tax Investment Value - Total Amount Invested',
      values: {
        netReturn: investmentNetReturn.value,
        totalInvested: totalAllContributions.value,
        netBenefit: investmentNetBenefit.value
      },
      calculation: [
        'After-Tax Investment Value = {netReturn}',
        'Total Amount Invested = {totalInvested}',
        'Net Benefit = {netReturn} - {totalInvested}',
        '= {netBenefit}'
      ],
      result: `True investment gain: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(investmentNetBenefit.value)}`,
      explanation: 'This is your actual financial benefit from investing - what you gain above your initial investment, directly comparable to interest saved.'
    },
    
    strategyRecommendation: {
      title: 'Strategy Recommendation Analysis',
      formula: 'Compare: Interest Saved vs Investment Net Benefit',
      values: {
        interestSaved: interestSaved.value,
        investmentNetBenefit: investmentNetBenefit.value,
        totalInvested: totalAllContributions.value,
        netReturn: investmentNetReturn.value,
        betterStrategy: betterStrategy.value,
        difference: Math.abs(interestSaved.value - investmentNetBenefit.value)
      },
      calculation: [
        'Mortgage Payoff Benefit = {interestSaved}',
        'Investment Net Benefit = {netReturn} - {totalInvested} = {investmentNetBenefit}',
        'Difference = {difference}',
        `Better Strategy: ${betterStrategy.value === 'payoff' ? 'Pay Off Mortgage' : 'Invest Extra Payments'}`
      ],
      result: `Recommendation: ${betterStrategy.value === 'payoff' ? 'Pay off mortgage early' : 'Invest the extra payments'}`,
      explanation: betterStrategy.value === 'payoff' ? 
        'Paying off the mortgage saves more money than investing after taxes.' :
        'Investing the extra payments yields better returns than the interest saved.'
    }
  }))

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
        totalMonthlyContributions: totalMonthlyContributions.value,
        totalLumpSumContributions: totalLumpSumContributions.value,
        totalAllContributions: totalAllContributions.value,
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
    totalMonthlyContributions,
    totalLumpSumContributions,
    totalAllContributions,
    investmentGrossReturn,
    investmentProfit,
    investmentTaxes,
    investmentNetReturn,
    investmentNetBenefit,
    betterStrategy,
    balanceChartData,
    interestComparisonChartData,
    investmentComparisonChartData,
    tooltipData,
    resetToDefaults,
    debugState
  }
}, {
  persist: {
    key: 'mortgagePayoff',
    storage: localStorage
  }
})