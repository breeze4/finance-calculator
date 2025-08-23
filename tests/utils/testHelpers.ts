/**
 * Test utilities and helpers for finance calculator testing
 */

export interface CoastFireTestScenario {
  currentAge: number
  retirementAge: number
  currentSavings: number
  expectedReturnRate: number
  targetRetirementAmount: number
  expectedResults?: {
    yearsToRetirement?: number
    futureValue?: number
    isCoastFire?: boolean
    additionalNeeded?: number
    coastFireAge?: number
  }
}

export interface MortgageTestScenario {
  principal: number
  yearsLeft: number
  interestRate: number
  monthlyPayment: number
  additionalMonthlyPayment?: number
  lumpSumPayment?: number
  expectedResults?: {
    basePayoffMonths?: number
    baseTotalInterest?: number
    acceleratedPayoffMonths?: number
    acceleratedTotalInterest?: number
  }
}

/**
 * Coast FIRE test scenarios with known outcomes
 */
export const coastFireTestCases: CoastFireTestScenario[] = [
  {
    // Basic scenario - not Coast FIRE ready
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    expectedReturnRate: 7,
    targetRetirementAmount: 1000000,
    expectedResults: {
      yearsToRetirement: 35,
      futureValue: 527633, // Approximate, will verify in tests
      isCoastFire: false
    }
  },
  {
    // Already Coast FIRE ready
    currentAge: 40,
    retirementAge: 65,
    currentSavings: 200000,
    expectedReturnRate: 7,
    targetRetirementAmount: 1000000,
    expectedResults: {
      yearsToRetirement: 25,
      isCoastFire: true,
      additionalNeeded: 0,
      coastFireAge: 40
    }
  },
  {
    // Edge case - same age
    currentAge: 65,
    retirementAge: 65,
    currentSavings: 500000,
    expectedReturnRate: 7,
    targetRetirementAmount: 500000,
    expectedResults: {
      yearsToRetirement: 0,
      futureValue: 500000,
      isCoastFire: true
    }
  },
  {
    // Zero return rate
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    expectedReturnRate: 0,
    targetRetirementAmount: 100000,
    expectedResults: {
      yearsToRetirement: 35,
      futureValue: 50000, // No growth
      isCoastFire: false
    }
  }
]

/**
 * Mortgage test scenarios with known outcomes
 */
export const mortgageTestCases: MortgageTestScenario[] = [
  {
    // Standard 30-year mortgage
    principal: 300000,
    yearsLeft: 30,
    interestRate: 4.5,
    monthlyPayment: 1520, // Approximately correct for this loan
    expectedResults: {
      basePayoffMonths: 360,
      // Total interest will be calculated in tests
    }
  },
  {
    // 15-year mortgage
    principal: 250000,
    yearsLeft: 15,
    interestRate: 3.5,
    monthlyPayment: 1789, // Approximately correct
    expectedResults: {
      basePayoffMonths: 180
    }
  },
  {
    // With extra payments
    principal: 300000,
    yearsLeft: 25,
    interestRate: 4.5,
    monthlyPayment: 1667, // Base payment
    additionalMonthlyPayment: 500,
    lumpSumPayment: 10000
  }
]

/**
 * Helper to check if two numbers are approximately equal (for floating point comparison)
 */
export function approxEqual(actual: number, expected: number, tolerance = 0.01): boolean {
  return Math.abs(actual - expected) <= Math.abs(expected * tolerance)
}

/**
 * Helper to round currency values for comparison
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100
}

/**
 * Helper to calculate expected compound interest manually for verification
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number
): number {
  return principal * Math.pow(1 + rate / 100, years)
}

/**
 * Helper to calculate present value manually for verification
 */
export function calculatePresentValue(
  futureValue: number,
  rate: number,
  years: number
): number {
  if (years === 0) return futureValue
  return futureValue / Math.pow(1 + rate / 100, years)
}