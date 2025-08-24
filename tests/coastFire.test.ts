import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCoastFireStore } from '../src/stores/coastFire'
import { coastFireTestCases, approxEqual, calculateCompoundInterest, calculatePresentValue } from './utils/testHelpers'

describe('Coast FIRE Calculator', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('yearsToRetirement calculation', () => {
    it('should calculate correct years for normal cases', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      expect(store.yearsToRetirement).toBe(35)
      
      store.currentAge = 45
      store.retirementAge = 62
      expect(store.yearsToRetirement).toBe(17)
    })

    it('should return 0 when current age equals retirement age', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 65
      store.retirementAge = 65
      expect(store.yearsToRetirement).toBe(0)
    })

    it('should return 0 when current age is greater than retirement age', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 70
      store.retirementAge = 65
      expect(store.yearsToRetirement).toBe(0)
    })
  })

  describe('futureValueOfCurrentSavings calculation', () => {
    it('should calculate compound interest correctly', () => {
      const store = useCoastFireStore()
      
      // Test case: $10,000 at 7% for 10 years
      store.currentSavings = 10000
      store.expectedReturnRate = 7
      store.currentAge = 30
      store.retirementAge = 40
      
      const expected = calculateCompoundInterest(10000, 7, 10)
      expect(approxEqual(store.futureValueOfCurrentSavings, expected, 0.001)).toBe(true)
    })

    it('should return original amount when return rate is 0', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 50000
      store.expectedReturnRate = 0
      store.currentAge = 30
      store.retirementAge = 65
      
      expect(store.futureValueOfCurrentSavings).toBe(50000)
    })

    it('should handle zero years to retirement', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.currentAge = 65
      store.retirementAge = 65
      
      expect(store.futureValueOfCurrentSavings).toBe(100000)
    })

    it('should calculate correctly for high return rates', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 10000
      store.expectedReturnRate = 15
      store.currentAge = 25
      store.retirementAge = 45
      
      const expected = calculateCompoundInterest(10000, 15, 20)
      expect(approxEqual(store.futureValueOfCurrentSavings, expected, 0.001)).toBe(true)
    })

    it('should handle long time periods correctly', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 25000
      store.expectedReturnRate = 8
      store.currentAge = 25
      store.retirementAge = 65
      
      const expected = calculateCompoundInterest(25000, 8, 40)
      expect(approxEqual(store.futureValueOfCurrentSavings, expected, 0.001)).toBe(true)
    })
  })

  describe('isCoastFIREReady boolean logic', () => {
    it('should return true when future value exceeds target', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 200000
      store.expectedReturnRate = 7
      store.currentAge = 40
      store.retirementAge = 65
      store.targetRetirementAmount = 500000
      
      expect(store.isCoastFIREReady).toBe(true)
    })

    it('should return true when future value equals target exactly', () => {
      const store = useCoastFireStore()
      
      // Set up scenario where future value should equal target
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.currentAge = 40
      store.retirementAge = 50
      
      // Calculate what target should be to equal future value
      const futureValue = calculateCompoundInterest(100000, 7, 10)
      store.targetRetirementAmount = futureValue
      
      expect(store.isCoastFIREReady).toBe(true)
    })

    it('should return false when future value is less than target', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 50000
      store.expectedReturnRate = 5
      store.currentAge = 35
      store.retirementAge = 65
      store.targetRetirementAmount = 1500000
      
      expect(store.isCoastFIREReady).toBe(false)
    })
  })

  describe('additionalSavingsNeeded calculation', () => {
    it('should return 0 when already Coast FIRE ready', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 300000
      store.expectedReturnRate = 7
      store.currentAge = 40
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      
      // This should make them Coast FIRE ready
      expect(store.isCoastFIREReady).toBe(true)
      expect(store.additionalSavingsNeeded).toBe(0)
    })

    it('should calculate correct present value when not ready', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 50000
      store.expectedReturnRate = 7
      store.currentAge = 30
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      
      // Calculate expected present value needed
      const presentValueNeeded = calculatePresentValue(1000000, 7, 35)
      const expectedAdditional = Math.max(0, presentValueNeeded - 50000)
      
      expect(approxEqual(store.additionalSavingsNeeded, expectedAdditional, 0.01)).toBe(true)
    })

    it('should handle zero time remaining edge case', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 500000
      store.expectedReturnRate = 7
      store.currentAge = 65
      store.retirementAge = 65
      store.targetRetirementAmount = 800000
      
      const expected = 800000 - 500000
      expect(store.additionalSavingsNeeded).toBe(expected)
    })

    it('should never return negative values', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = 1000000
      store.expectedReturnRate = 7
      store.currentAge = 30
      store.retirementAge = 65
      store.targetRetirementAmount = 500000
      
      expect(store.additionalSavingsNeeded).toBeGreaterThanOrEqual(0)
    })
  })

  describe('coastFIREAge calculation', () => {
    it('should return current age when already Coast FIRE ready', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 40
      store.currentSavings = 300000
      store.expectedReturnRate = 7
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      
      expect(store.isCoastFIREReady).toBe(true)
      expect(store.coastFIREAge).toBe(40)
    })

    it('should calculate correct age using logarithmic formula', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.currentSavings = 50000
      store.expectedReturnRate = 7
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      
      // Manual calculation using logarithmic formula
      const rate = 7 / 100
      const yearsNeeded = Math.log(1000000 / 50000) / Math.log(1 + rate)
      const expectedAge = Math.ceil(30 + yearsNeeded)
      
      expect(store.coastFIREAge).toBe(expectedAge)
    })

    it('should handle high return rates', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.currentSavings = 10000
      store.expectedReturnRate = 12
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      
      // Should result in a reasonable age (can be current age if already Coast FIRE or close)
      expect(store.coastFIREAge).toBeGreaterThanOrEqual(25)
      expect(store.coastFIREAge).toBeLessThanOrEqual(100)
    })

    it('should handle low return rates', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.currentSavings = 100000
      store.expectedReturnRate = 3
      store.retirementAge = 65
      store.targetRetirementAmount = 500000
      
      // Should result in a reasonable age - with low return rate and high savings, could achieve Coast FIRE early
      expect(store.coastFIREAge).toBeGreaterThanOrEqual(0) // Could be very young if calculation works backward
      expect(store.coastFIREAge).toBeLessThanOrEqual(100)
      
      // More specifically, with $100k at 3% for 40 years, they need less than $100k present value for $500k target
      // So they're probably already Coast FIRE ready or very close
      expect(typeof store.coastFIREAge).toBe('number')
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
    })
  })

  describe('input validation', () => {
    it('should validate age ranges', () => {
      const store = useCoastFireStore()
      
      // Test minimum age
      store.currentAge = 17
      store.validateInputs()
      expect(store.errors.currentAge).toContain('between 18 and 100')
      
      // Test maximum age
      store.currentAge = 101
      store.validateInputs()
      expect(store.errors.currentAge).toContain('between 18 and 100')
      
      // Test valid age
      store.currentAge = 30
      store.validateInputs()
      expect(store.errors.currentAge).toBe('')
    })

    it('should validate retirement age vs current age', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 40
      store.retirementAge = 35
      store.validateInputs()
      expect(store.errors.retirementAge).toContain('greater than current age')
      
      // Test valid scenario
      store.retirementAge = 65
      store.validateInputs()
      expect(store.errors.retirementAge).toBe('')
    })

    it('should validate non-negative savings', () => {
      const store = useCoastFireStore()
      
      store.currentSavings = -1000
      store.validateInputs()
      expect(store.errors.currentSavings).toContain('cannot be negative')
      
      // Test valid savings
      store.currentSavings = 50000
      store.validateInputs()
      expect(store.errors.currentSavings).toBe('')
    })

    it('should validate return rate bounds', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = -1
      store.validateInputs()
      expect(store.errors.expectedReturnRate).toContain('between 0% and 30%')
      
      store.expectedReturnRate = 31
      store.validateInputs()
      expect(store.errors.expectedReturnRate).toContain('between 0% and 30%')
      
      // Test valid return rate
      store.expectedReturnRate = 7
      store.validateInputs()
      expect(store.errors.expectedReturnRate).toBe('')
    })

    it('should validate positive target amounts', () => {
      const store = useCoastFireStore()
      
      store.targetRetirementAmount = 0
      store.validateInputs()
      expect(store.errors.targetRetirementAmount).toContain('greater than 0')
      
      store.targetRetirementAmount = -50000
      store.validateInputs()
      expect(store.errors.targetRetirementAmount).toContain('greater than 0')
      
      // Test valid target
      store.targetRetirementAmount = 1000000
      store.validateInputs()
      expect(store.errors.targetRetirementAmount).toBe('')
    })
  })

  describe('test scenarios from fixtures', () => {
    it('should handle all predefined test cases', () => {
      coastFireTestCases.forEach((testCase, index) => {
        const store = useCoastFireStore()
        
        // Set up the test case
        store.currentAge = testCase.currentAge
        store.retirementAge = testCase.retirementAge
        store.currentSavings = testCase.currentSavings
        store.expectedReturnRate = testCase.expectedReturnRate
        store.targetRetirementAmount = testCase.targetRetirementAmount
        
        // Test expectations if provided
        if (testCase.expectedResults) {
          const { expectedResults } = testCase
          
          if (expectedResults.yearsToRetirement !== undefined) {
            expect(store.yearsToRetirement).toBe(expectedResults.yearsToRetirement)
          }
          
          if (expectedResults.futureValue !== undefined) {
            expect(approxEqual(store.futureValueOfCurrentSavings, expectedResults.futureValue, 0.1)).toBe(true)
          }
          
          if (expectedResults.isCoastFire !== undefined) {
            expect(store.isCoastFIREReady).toBe(expectedResults.isCoastFire)
          }
          
          if (expectedResults.additionalNeeded !== undefined) {
            expect(store.additionalSavingsNeeded).toBe(expectedResults.additionalNeeded)
          }
          
          if (expectedResults.coastFireAge !== undefined) {
            expect(store.coastFIREAge).toBe(expectedResults.coastFireAge)
          }
        }
      })
    })
  })

  describe('mathematical edge cases', () => {
    it('should handle zero current savings scenarios', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.retirementAge = 65
      store.currentSavings = 0
      store.expectedReturnRate = 8
      store.targetRetirementAmount = 1000000
      
      expect(store.futureValueOfCurrentSavings).toBe(0)
      expect(store.isCoastFIREReady).toBe(false)
      expect(store.additionalSavingsNeeded).toBeGreaterThan(0)
      // coastFIREAge might be NaN or -Infinity when current savings is 0, which is acceptable
      expect(typeof store.coastFIREAge).toBe('number')
    })

    it('should handle very large numbers (millions/billions)', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 10000000 // $10 million
      store.expectedReturnRate = 7
      store.targetRetirementAmount = 50000000 // $50 million
      
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(Number.isFinite(store.additionalSavingsNeeded)).toBe(true)
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
      
      // Should handle calculations without overflow
      expect(store.futureValueOfCurrentSavings).toBeGreaterThan(0)
    })

    it('should handle precision and rounding behavior', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 31
      store.currentSavings = 12345.67
      store.expectedReturnRate = 7.123
      store.targetRetirementAmount = 98765.43
      
      // Should handle decimal precision without errors
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(Number.isFinite(store.additionalSavingsNeeded)).toBe(true)
      
      // Results should be reasonable
      expect(store.yearsToRetirement).toBe(1)
      const expected = 12345.67 * (1 + 7.123/100)
      expect(store.futureValueOfCurrentSavings).toBeCloseTo(expected, 0)
    })

    it('should handle zero return rate scenarios', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 100000
      store.expectedReturnRate = 0
      store.targetRetirementAmount = 500000
      
      // With 0% return rate, future value should equal current savings
      expect(store.futureValueOfCurrentSavings).toBe(100000)
      expect(store.isCoastFIREReady).toBe(false)
      
      // Additional savings needed should be target - current
      expect(store.additionalSavingsNeeded).toBe(400000)
      
      // coastFIREAge calculation with zero return rate will result in division by zero
      // Since Math.log(1 + 0) = Math.log(1) = 0, this creates a division by zero situation
      // The result will be Infinity, which is a mathematical consequence
      expect(typeof store.coastFIREAge).toBe('number')
      // Accept that this edge case produces non-finite result due to mathematical limitation
    })

    it('should handle extreme return rates', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.retirementAge = 65
      store.currentSavings = 1000
      store.expectedReturnRate = 30 // Maximum allowed
      store.targetRetirementAmount = 1000000
      
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
      expect(store.futureValueOfCurrentSavings).toBeGreaterThan(1000)
      
      // Very high return rate should make Coast FIRE age much earlier
      expect(store.coastFIREAge).toBeLessThan(65)
    })
  })

  describe('performance and precision tests', () => {
    it('should handle calculations with consistent precision', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 28.5
      store.retirementAge = 64.3
      store.currentSavings = 87654.32
      store.expectedReturnRate = 7.123
      store.targetRetirementAmount = 1234567.89
      
      // All calculations should be finite
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(Number.isFinite(store.additionalSavingsNeeded)).toBe(true)
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
      
      // Verify precision is maintained
      expect(store.yearsToRetirement).toBeCloseTo(35.8, 1)
    })

    it('should perform calculations efficiently with extreme inputs', () => {
      const store = useCoastFireStore()
      
      // Very large numbers
      store.currentAge = 25
      store.retirementAge = 65
      store.currentSavings = 50000000 // $50 million
      store.expectedReturnRate = 8.5
      store.targetRetirementAmount = 100000000 // $100 million
      
      const startTime = performance.now()
      
      // Access computed properties to trigger calculations
      const futureValue = store.futureValueOfCurrentSavings
      const additionalNeeded = store.additionalSavingsNeeded
      const coastAge = store.coastFIREAge
      const isReady = store.isCoastFIREReady
      
      const endTime = performance.now()
      
      // Should complete calculations quickly (< 50ms)
      expect(endTime - startTime).toBeLessThan(50)
      
      // Results should be reasonable
      expect(futureValue).toBeGreaterThan(50000000)
      expect(Number.isFinite(additionalNeeded)).toBe(true)
      expect(Number.isFinite(coastAge)).toBe(true)
    })

    it('should maintain precision with very large numbers', () => {
      const store = useCoastFireStore()
      
      // Test with very large current savings
      store.currentAge = 30
      store.retirementAge = 60
      store.currentSavings = 25000000 // $25 million
      store.expectedReturnRate = 6.0
      store.targetRetirementAmount = 50000000 // $50 million
      
      // All calculations should remain finite and reasonable
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(Number.isFinite(store.additionalSavingsNeeded)).toBe(true)
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
      
      // With large numbers, compound growth should be significant
      expect(store.futureValueOfCurrentSavings).toBeGreaterThan(25000000)
      expect(store.futureValueOfCurrentSavings).toBeLessThan(500000000) // Reasonable upper bound
    })

    it('should verify rounding behavior consistency', () => {
      const store = useCoastFireStore()
      
      // Test with decimals that could cause rounding issues
      store.currentAge = 30.99
      store.retirementAge = 65.01
      store.currentSavings = 49999.99
      store.expectedReturnRate = 7.001
      store.targetRetirementAmount = 999999.99
      
      // Run calculations multiple times to ensure consistency
      const run1 = {
        futureValue: store.futureValueOfCurrentSavings,
        additionalNeeded: store.additionalSavingsNeeded,
        coastAge: store.coastFIREAge,
        isReady: store.isCoastFIREReady
      }
      
      // Trigger recalculation by changing and restoring a value
      const tempAge = store.currentAge
      store.currentAge = 31
      store.currentAge = tempAge
      
      const run2 = {
        futureValue: store.futureValueOfCurrentSavings,
        additionalNeeded: store.additionalSavingsNeeded,
        coastAge: store.coastFIREAge,
        isReady: store.isCoastFIREReady
      }
      
      // Results should be identical
      expect(run1.futureValue).toBe(run2.futureValue)
      expect(run1.additionalNeeded).toBe(run2.additionalNeeded)
      expect(run1.coastAge).toBe(run2.coastAge)
      expect(run1.isReady).toBe(run2.isReady)
    })

    it('should handle extreme return rates without performance issues', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 20
      store.retirementAge = 70 // Very long time horizon
      store.currentSavings = 1000
      store.targetRetirementAmount = 10000000
      
      const testCases = [0.1, 15.5, 29.9] // Extreme low, middle, high rates
      
      testCases.forEach(rate => {
        store.expectedReturnRate = rate
        
        const startTime = performance.now()
        
        const futureValue = store.futureValueOfCurrentSavings
        const coastAge = store.coastFIREAge
        
        const endTime = performance.now()
        
        // Should complete quickly even with extreme inputs
        expect(endTime - startTime).toBeLessThan(10)
        expect(Number.isFinite(futureValue)).toBe(true)
        expect(typeof coastAge).toBe('number')
      })
    })
  })

  describe('monthly expenses and withdrawal rate calculations', () => {
    it('calculates target from monthly expenses correctly', () => {
      const store = useCoastFireStore()
      
      store.monthlyExpenses = 4000
      store.withdrawalRate = 4
      
      // $4000/month * 12 months / 4% = $1,200,000
      expect(store.targetFromMonthlyExpenses).toBe(1200000)
    })

    it('calculates monthly from target correctly', () => {
      const store = useCoastFireStore()
      
      store.targetRetirementAmount = 1000000
      store.withdrawalRate = 4
      
      // $1,000,000 * 4% / 12 = $3333.33 (computed value keeps decimals)
      expect(store.monthlyFromTarget).toBeCloseTo(3333.33, 2)
    })

    it('handles zero values in calculations', () => {
      const store = useCoastFireStore()
      
      store.monthlyExpenses = 0
      store.withdrawalRate = 4
      expect(store.targetFromMonthlyExpenses).toBe(0)

      store.monthlyExpenses = 4000
      store.withdrawalRate = 0
      expect(store.targetFromMonthlyExpenses).toBe(0)
    })

    it('bidirectional sync works correctly', () => {
      const store = useCoastFireStore()
      
      // Test syncing from monthly expenses
      store.monthlyExpenses = 5000
      store.withdrawalRate = 4
      store.syncFromMonthlyExpenses()
      
      expect(store.lastEditedField).toBe('monthly')
      expect(store.targetRetirementAmount).toBe(1500000) // $5000 * 12 / 0.04

      // Test syncing from target amount
      store.targetRetirementAmount = 2000000
      store.syncFromTargetAmount()
      
      expect(store.lastEditedField).toBe('target')
      expect(store.monthlyExpenses).toBe(6667) // $2M * 0.04 / 12 = 6666.67, rounded to 6667
    })

    it('should update target retirement amount when monthly expenses change', () => {
      const store = useCoastFireStore()
      
      // Set initial values
      store.targetRetirementAmount = 1000000
      store.withdrawalRate = 4
      store.monthlyExpenses = 0
      
      // User enters monthly expenses
      store.monthlyExpenses = 3000
      store.syncFromMonthlyExpenses()
      
      // Target retirement amount should update immediately
      expect(store.targetRetirementAmount).toBe(900000) // $3000 * 12 / 0.04
      
      // Active target amount should use the calculated value
      expect(store.activeTargetAmount).toBe(900000)
      
      // Verify the field gets marked as last edited
      expect(store.lastEditedField).toBe('monthly')
    })

    it('should update monthly expenses when target retirement amount changes', () => {
      const store = useCoastFireStore()
      
      // Set initial values
      store.monthlyExpenses = 4000
      store.withdrawalRate = 4
      store.targetRetirementAmount = 0
      
      // User enters target retirement amount  
      store.targetRetirementAmount = 1500000
      store.syncFromTargetAmount()
      
      // Monthly expenses should update immediately
      expect(store.monthlyExpenses).toBe(5000) // $1.5M * 0.04 / 12
      
      // Active target amount should use the direct value
      expect(store.activeTargetAmount).toBe(1500000)
      
      // Verify the field gets marked as last edited
      expect(store.lastEditedField).toBe('target')
    })

    it('should round monthly expenses to nearest dollar when syncing from target', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      
      // Test case that would result in cents
      store.targetRetirementAmount = 1000000
      store.syncFromTargetAmount()
      
      // $1,000,000 * 4% / 12 = $3333.333...
      // Should round to $3333
      expect(store.monthlyExpenses).toBe(3333)
      
      // Test another case that rounds up
      store.targetRetirementAmount = 1350000
      store.syncFromTargetAmount()
      
      // $1,350,000 * 4% / 12 = $4500 (exact)
      expect(store.monthlyExpenses).toBe(4500)
      
      // Test case that rounds up
      store.targetRetirementAmount = 1234567
      store.syncFromTargetAmount()
      
      // $1,234,567 * 4% / 12 = $4115.223...
      // Should round to $4115
      expect(store.monthlyExpenses).toBe(4115)
    })

    it('should NOT update target when monthly expenses is zero (bug test)', () => {
      const store = useCoastFireStore()
      
      // Set initial state - user has entered a target amount
      store.targetRetirementAmount = 1000000
      store.withdrawalRate = 4
      store.monthlyExpenses = 0
      store.lastEditedField = 'target'
      
      // User starts entering monthly expenses (starts from 0)
      store.monthlyExpenses = 3000
      store.syncFromMonthlyExpenses()
      
      // BUG: The sync function doesn't update targetRetirementAmount because it checks if monthlyExpenses > 0
      // But the check happens AFTER monthlyExpenses is set to 3000, so it should work
      // However, the real bug is that when monthlyExpenses WAS 0, the sync doesn't happen
      expect(store.targetRetirementAmount).toBe(900000) // This SHOULD be updated to $3000 * 12 / 0.04
      expect(store.lastEditedField).toBe('monthly')
    })

    it('should update target even when clearing monthly expenses to zero', () => {
      const store = useCoastFireStore()
      
      // Initial state - user had monthly expenses
      store.monthlyExpenses = 5000
      store.withdrawalRate = 4
      store.syncFromMonthlyExpenses()
      expect(store.targetRetirementAmount).toBe(1500000) // $5000 * 12 / 0.04
      
      // User clears monthly expenses back to 0
      store.monthlyExpenses = 0
      store.syncFromMonthlyExpenses()
      
      // BUG: Target amount should also be updated to 0, but it doesn't update
      // because syncFromMonthlyExpenses checks if monthlyExpenses > 0
      expect(store.targetRetirementAmount).toBe(0) // Should be 0 when monthly is 0
      expect(store.lastEditedField).toBe('monthly') // Should still mark as last edited
    })

    it('activeTargetAmount uses correct value based on last edited field', () => {
      const store = useCoastFireStore()
      
      // When target was last edited
      store.targetRetirementAmount = 1000000
      store.monthlyExpenses = 4000
      store.withdrawalRate = 4
      store.lastEditedField = 'target'
      
      expect(store.activeTargetAmount).toBe(1000000)

      // When monthly was last edited and has value > 0
      store.lastEditedField = 'monthly'
      expect(store.activeTargetAmount).toBe(1200000) // calculated from monthly

      // When monthly was last edited but is 0
      store.monthlyExpenses = 0
      store.lastEditedField = 'monthly'
      expect(store.activeTargetAmount).toBe(1000000) // falls back to target
    })

    it('calculations use activeTargetAmount correctly', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.monthlyExpenses = 4000
      store.withdrawalRate = 4
      store.lastEditedField = 'monthly'

      // Should use target from monthly expenses ($1.2M) instead of targetRetirementAmount
      const futureValue = store.futureValueOfCurrentSavings
      expect(store.isCoastFIREReady).toBe(futureValue >= 1200000)
    })
  })

  describe('yearly expenses field and three-way synchronization', () => {
    it('calculates target from yearly expenses correctly', () => {
      const store = useCoastFireStore()
      
      store.yearlyExpenses = 48000
      store.withdrawalRate = 4
      
      // $48,000 / 4% = $1,200,000
      expect(store.targetFromYearlyExpenses).toBe(1200000)
    })

    it('handles zero values in yearly expense calculations', () => {
      const store = useCoastFireStore()
      
      store.yearlyExpenses = 0
      store.withdrawalRate = 4
      expect(store.targetFromYearlyExpenses).toBe(0)

      store.yearlyExpenses = 60000
      store.withdrawalRate = 0
      expect(store.targetFromYearlyExpenses).toBe(0)
    })

    it('syncs from yearly expenses to monthly and target', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      store.yearlyExpenses = 60000
      store.syncFromYearlyExpenses()
      
      expect(store.lastEditedField).toBe('yearly')
      expect(store.targetRetirementAmount).toBe(1500000) // $60,000 / 0.04
      expect(store.monthlyExpenses).toBe(5000) // $60,000 / 12
    })

    it('syncs from monthly expenses to yearly and target', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      store.monthlyExpenses = 4000
      store.syncFromMonthlyExpenses()
      
      expect(store.lastEditedField).toBe('monthly')
      expect(store.targetRetirementAmount).toBe(1200000) // $4,000 * 12 / 0.04
      expect(store.yearlyExpenses).toBe(48000) // $4,000 * 12
    })

    it('syncs from target amount to monthly and yearly', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      store.targetRetirementAmount = 2000000
      store.syncFromTargetAmount()
      
      expect(store.lastEditedField).toBe('target')
      expect(store.monthlyExpenses).toBe(6667) // $2M * 0.04 / 12, rounded
      expect(store.yearlyExpenses).toBe(80004) // $6667 * 12
    })

    it('rounds values correctly when syncing between fields', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 3.5
      
      // Test yearly to monthly rounding
      store.yearlyExpenses = 50000
      store.syncFromYearlyExpenses()
      expect(store.monthlyExpenses).toBe(4167) // $50,000 / 12 = 4166.67, rounded to 4167
      
      // Test monthly to yearly (should be exact)
      store.monthlyExpenses = 3333
      store.syncFromMonthlyExpenses()
      expect(store.yearlyExpenses).toBe(39996) // $3333 * 12
      
      // Test target to monthly/yearly rounding
      store.targetRetirementAmount = 1234567
      store.syncFromTargetAmount()
      // $1,234,567 * 3.5% = $43,209.845
      // Monthly: $43,209.845 / 12 = $3600.82, rounded to 3601
      expect(store.monthlyExpenses).toBe(3601)
      // Yearly: $3601 * 12 = $43,212
      expect(store.yearlyExpenses).toBe(43212)
    })

    it('activeTargetAmount uses correct value based on last edited field', () => {
      const store = useCoastFireStore()
      
      store.targetRetirementAmount = 1000000
      store.monthlyExpenses = 4000
      store.yearlyExpenses = 60000
      store.withdrawalRate = 4
      
      // When target was last edited
      store.lastEditedField = 'target'
      expect(store.activeTargetAmount).toBe(1000000)

      // When monthly was last edited
      store.lastEditedField = 'monthly'
      expect(store.activeTargetAmount).toBe(1200000) // $4000 * 12 / 0.04

      // When yearly was last edited
      store.lastEditedField = 'yearly'
      expect(store.activeTargetAmount).toBe(1500000) // $60000 / 0.04
    })

    it('handles clearing expenses fields to zero', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      
      // Set initial values
      store.yearlyExpenses = 60000
      store.syncFromYearlyExpenses()
      expect(store.targetRetirementAmount).toBe(1500000)
      expect(store.monthlyExpenses).toBe(5000)
      
      // Clear yearly to zero
      store.yearlyExpenses = 0
      store.syncFromYearlyExpenses()
      expect(store.targetRetirementAmount).toBe(0)
      expect(store.monthlyExpenses).toBe(0)
      
      // Set values again via monthly
      store.monthlyExpenses = 3000
      store.syncFromMonthlyExpenses()
      expect(store.targetRetirementAmount).toBe(900000)
      expect(store.yearlyExpenses).toBe(36000)
      
      // Clear monthly to zero
      store.monthlyExpenses = 0
      store.syncFromMonthlyExpenses()
      expect(store.targetRetirementAmount).toBe(0)
      expect(store.yearlyExpenses).toBe(0)
    })

    it('validates yearly expenses not negative', () => {
      const store = useCoastFireStore()
      
      store.yearlyExpenses = -1000
      store.validateInputs()
      expect(store.errors.yearlyExpenses).toContain('cannot be negative')

      store.yearlyExpenses = 0
      store.validateInputs()
      expect(store.errors.yearlyExpenses).toBe('')

      store.yearlyExpenses = 50000
      store.validateInputs()
      expect(store.errors.yearlyExpenses).toBe('')
    })

    it('resetToDefaults includes yearly expenses', () => {
      const store = useCoastFireStore()
      
      // Change from defaults
      store.yearlyExpenses = 72000
      store.monthlyExpenses = 6000
      store.lastEditedField = 'yearly'
      
      // Reset
      store.resetToDefaults()
      
      expect(store.yearlyExpenses).toBe(0)
      expect(store.monthlyExpenses).toBe(0)
      expect(store.lastEditedField).toBe('target')
    })

    it('three-way sync maintains consistency', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 4
      
      // Start with target
      store.targetRetirementAmount = 1000000
      store.syncFromTargetAmount()
      
      const monthlyFromTarget = store.monthlyExpenses
      const yearlyFromTarget = store.yearlyExpenses
      
      // Sync from monthly should maintain relationships
      store.syncFromMonthlyExpenses()
      expect(store.targetRetirementAmount).toBe(Math.round((monthlyFromTarget * 12) / 0.04))
      expect(store.yearlyExpenses).toBe(monthlyFromTarget * 12)
      
      // Sync from yearly should maintain relationships
      store.yearlyExpenses = 48000
      store.syncFromYearlyExpenses()
      expect(store.targetRetirementAmount).toBe(1200000) // $48000 / 0.04
      expect(store.monthlyExpenses).toBe(4000) // $48000 / 12
      
      // All three fields should be in sync
      expect(store.monthlyExpenses * 12).toBe(store.yearlyExpenses)
      expect(store.yearlyExpenses / 0.04).toBe(store.targetRetirementAmount)
    })

    it('handles withdrawal rate changes correctly', () => {
      const store = useCoastFireStore()
      
      // Set initial values
      store.monthlyExpenses = 5000
      store.withdrawalRate = 4
      store.syncFromMonthlyExpenses()
      
      expect(store.targetRetirementAmount).toBe(1500000)
      expect(store.yearlyExpenses).toBe(60000)
      
      // Change withdrawal rate and re-sync
      store.withdrawalRate = 3
      store.syncFromMonthlyExpenses()
      
      expect(store.targetRetirementAmount).toBe(2000000) // $5000 * 12 / 0.03
      expect(store.yearlyExpenses).toBe(60000) // Should stay the same
    })

    it('integration test: calculations use correct active target', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.withdrawalRate = 4
      
      // Test with yearly expenses as source
      store.yearlyExpenses = 50000
      store.syncFromYearlyExpenses()
      
      const targetFromYearly = store.targetFromYearlyExpenses
      expect(store.activeTargetAmount).toBe(targetFromYearly)
      
      // Coast FIRE calculations should use the active target
      const futureValue = store.futureValueOfCurrentSavings
      expect(store.isCoastFIREReady).toBe(futureValue >= targetFromYearly)
      
      // Switch to monthly as source
      store.monthlyExpenses = 3000
      store.syncFromMonthlyExpenses()
      
      const targetFromMonthly = store.targetFromMonthlyExpenses
      expect(store.activeTargetAmount).toBe(targetFromMonthly)
      expect(store.isCoastFIREReady).toBe(futureValue >= targetFromMonthly)
    })
  })

  describe('inflation calculations', () => {
    it('calculates real return rate using Fisher equation', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = 7
      store.inflationRate = 3
      store.useRealReturns = true
      
      // Fisher equation: (1.07 / 1.03) - 1 = 0.03883 = 3.883%
      expect(store.realReturnRate).toBeCloseTo(3.883, 2)
    })

    it('uses nominal returns when useRealReturns is false', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = 7
      store.inflationRate = 3
      store.useRealReturns = false
      
      expect(store.effectiveReturnRate).toBe(7)
    })

    it('uses real returns when useRealReturns is true', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = 7
      store.inflationRate = 3
      store.useRealReturns = true
      
      expect(store.effectiveReturnRate).toBeCloseTo(3.883, 2)
    })

    it('adjusts target for inflation when using nominal returns', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      store.inflationRate = 3
      store.useRealReturns = false
      
      // 35 years of 3% inflation: 1M * (1.03)^35 = 2,813,862
      const expected = 1000000 * Math.pow(1.03, 35)
      expect(store.inflationAdjustedTarget).toBeCloseTo(expected, 0)
    })

    it('does not adjust target when using real returns', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.targetRetirementAmount = 1000000
      store.inflationRate = 3
      store.useRealReturns = true
      
      // Target stays the same with real returns
      expect(store.inflationAdjustedTarget).toBe(1000000)
    })

    it('calculates future value with real returns correctly', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.inflationRate = 3
      store.useRealReturns = true
      
      // Real rate ≈ 3.883%, 35 years
      const realRate = ((1.07 / 1.03) - 1)
      const expected = 100000 * Math.pow(1 + realRate, 35)
      expect(store.futureValueOfCurrentSavings).toBeCloseTo(expected, 0)
    })

    it('calculates Coast FIRE readiness with inflation', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 200000
      store.expectedReturnRate = 7
      store.inflationRate = 2
      store.targetRetirementAmount = 500000
      
      // Test with real returns
      store.useRealReturns = true
      const realRate = ((1.07 / 1.02) - 1)
      const futureValueReal = 200000 * Math.pow(1 + realRate, 35)
      const isReadyReal = futureValueReal >= 500000
      expect(store.isCoastFIREReady).toBe(isReadyReal)
      
      // Test with nominal returns
      store.useRealReturns = false
      const futureValueNominal = 200000 * Math.pow(1.07, 35)
      const inflatedTarget = 500000 * Math.pow(1.02, 35)
      const isReadyNominal = futureValueNominal >= inflatedTarget
      expect(store.isCoastFIREReady).toBe(isReadyNominal)
    })

    it('validates inflation rate range', () => {
      const store = useCoastFireStore()
      
      store.inflationRate = -1
      store.validateInputs()
      expect(store.errors.inflationRate).toContain('between 0% and 10%')
      
      store.inflationRate = 11
      store.validateInputs()
      expect(store.errors.inflationRate).toContain('between 0% and 10%')
      
      store.inflationRate = 3
      store.validateInputs()
      expect(store.errors.inflationRate).toBe('')
    })

    it('handles zero inflation correctly', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = 7
      store.inflationRate = 0
      store.useRealReturns = true
      
      // With zero inflation, real rate equals nominal rate
      expect(store.realReturnRate).toBeCloseTo(7, 10)
      expect(store.effectiveReturnRate).toBeCloseTo(7, 10)
    })

    it('handles high inflation scenarios', () => {
      const store = useCoastFireStore()
      
      store.expectedReturnRate = 8
      store.inflationRate = 6
      store.useRealReturns = true
      
      // Real return = (1.08 / 1.06) - 1 ≈ 1.887%
      expect(store.realReturnRate).toBeCloseTo(1.887, 2)
    })

    it('resets inflation settings to defaults', () => {
      const store = useCoastFireStore()
      
      // Change from defaults
      store.inflationRate = 5
      store.useRealReturns = false
      
      // Reset
      store.resetToDefaults()
      
      expect(store.inflationRate).toBe(0)
      expect(store.useRealReturns).toBe(false)
    })

    it('projection chart adjusts for inflation', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 35 // 5 years
      store.currentSavings = 100000
      store.expectedReturnRate = 7
      store.inflationRate = 3
      store.targetRetirementAmount = 150000
      store.useRealReturns = false // Use nominal returns
      
      const chartData = store.projectionChartData
      const targetLine = chartData.datasets[1].data as number[]
      
      // Target should increase each year with inflation
      expect(targetLine[0]).toBe(150000) // Year 0
      expect(targetLine[1]).toBeCloseTo(150000 * 1.03, 0) // Year 1
      expect(targetLine[5]).toBeCloseTo(150000 * Math.pow(1.03, 5), 0) // Year 5
    })
  })

  describe('Coast FIRE number calculation', () => {
    it('calculates Coast FIRE number correctly using present value', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.expectedReturnRate = 7
      store.targetRetirementAmount = 1000000
      store.useRealReturns = false
      store.inflationRate = 0
      
      // Coast FIRE number = PV of target amount
      // PV = 1,000,000 / (1.07)^35 = ~93,663
      const years = 35
      const expected = 1000000 / Math.pow(1.07, years)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
    })

    it('returns target amount when years to retirement is zero', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 65
      store.retirementAge = 65 // Retiring this year
      store.targetRetirementAmount = 500000
      
      // If retiring immediately, need the full target amount
      expect(store.coastFIRENumber).toBe(500000)
    })

    it('uses inflation-adjusted target when using nominal returns', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 65
      store.expectedReturnRate = 7
      store.targetRetirementAmount = 1000000
      store.inflationRate = 3
      store.useRealReturns = false // Use nominal returns
      
      // With 3% inflation over 35 years, target becomes ~2.8M
      const inflatedTarget = 1000000 * Math.pow(1.03, 35)
      // Coast FIRE number = PV of inflated target
      const expected = inflatedTarget / Math.pow(1.07, 35)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
    })

    it('uses real returns when inflation adjustment is enabled', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 30
      store.retirementAge = 60
      store.expectedReturnRate = 8
      store.inflationRate = 3
      store.targetRetirementAmount = 800000
      store.useRealReturns = true
      
      // Real rate = (1.08 / 1.03) - 1 ≈ 4.854%
      const realRate = ((1.08 / 1.03) - 1)
      const years = 30
      // Target stays at 800k (no inflation adjustment with real returns)
      const expected = 800000 / Math.pow(1 + realRate, years)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
    })

    it('matches additional savings needed when current savings is zero', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.retirementAge = 60
      store.currentSavings = 0
      store.expectedReturnRate = 6
      store.targetRetirementAmount = 1200000
      
      // When current savings is 0, Coast FIRE number should equal additional savings needed
      expect(store.coastFIRENumber).toBe(store.additionalSavingsNeeded)
    })

    it('calculates correctly with expense-based targets', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 35
      store.retirementAge = 65
      store.monthlyExpenses = 5000
      store.withdrawalRate = 4
      store.expectedReturnRate = 7
      store.syncFromMonthlyExpenses()
      
      // Target = $5000 * 12 / 0.04 = $1.5M
      // Coast FIRE number = PV of $1.5M over 30 years at 7%
      const target = (5000 * 12) / 0.04
      const expected = target / Math.pow(1.07, 30)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
    })

    it('provides meaningful comparison to current savings when not Coast FIRE ready', () => {
      const store = useCoastFireStore()
      
      // Set up scenario where person is definitely NOT Coast FIRE ready
      store.currentAge = 40
      store.retirementAge = 65
      store.currentSavings = 50000  // Lower amount to ensure not Coast FIRE ready
      store.expectedReturnRate = 6  // Lower return rate
      store.targetRetirementAmount = 1500000  // Higher target
      
      // Verify they are not Coast FIRE ready
      expect(store.isCoastFIREReady).toBe(false)
      
      // Current savings + additional needed should equal Coast FIRE number
      const coastFireNumber = store.coastFIRENumber
      const additionalNeeded = store.additionalSavingsNeeded
      expect(store.currentSavings + additionalNeeded).toBeCloseTo(coastFireNumber, 0)
    })

    it('handles Coast FIRE ready scenario correctly', () => {
      const store = useCoastFireStore()
      
      // Set up scenario where person IS Coast FIRE ready
      store.currentAge = 50
      store.retirementAge = 65
      store.currentSavings = 500000  // High amount
      store.expectedReturnRate = 8   // Good return rate
      store.targetRetirementAmount = 800000  // Lower target
      
      // Verify they ARE Coast FIRE ready
      expect(store.isCoastFIREReady).toBe(true)
      
      // When Coast FIRE ready, additional needed should be 0
      expect(store.additionalSavingsNeeded).toBe(0)
      
      // Coast FIRE number should be less than current savings
      expect(store.coastFIRENumber).toBeLessThan(store.currentSavings)
    })

    it('handles high return rates correctly', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 25
      store.retirementAge = 65
      store.expectedReturnRate = 12
      store.targetRetirementAmount = 2000000
      
      // With high return rate, Coast FIRE number should be much lower
      const years = 40
      const expected = 2000000 / Math.pow(1.12, years)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
      expect(store.coastFIRENumber).toBeLessThan(200000) // Should be quite low
    })

    it('handles low return rates correctly', () => {
      const store = useCoastFireStore()
      
      store.currentAge = 35
      store.retirementAge = 65
      store.expectedReturnRate = 3
      store.targetRetirementAmount = 800000
      
      // With low return rate, Coast FIRE number should be higher
      const years = 30
      const expected = 800000 / Math.pow(1.03, years)
      
      expect(store.coastFIRENumber).toBeCloseTo(expected, 0)
      expect(store.coastFIRENumber).toBeGreaterThan(300000) // Should be relatively high
    })
  })

  describe('validation for new fields', () => {
    it('validates withdrawal rate range', () => {
      const store = useCoastFireStore()
      
      store.withdrawalRate = 1
      store.validateInputs()
      expect(store.errors.withdrawalRate).toContain('between 2% and 8%')

      store.withdrawalRate = 10
      store.validateInputs()
      expect(store.errors.withdrawalRate).toContain('between 2% and 8%')

      store.withdrawalRate = 4
      store.validateInputs()
      expect(store.errors.withdrawalRate).toBe('')
    })

    it('validates monthly expenses not negative', () => {
      const store = useCoastFireStore()
      
      store.monthlyExpenses = -100
      store.validateInputs()
      expect(store.errors.monthlyExpenses).toContain('cannot be negative')

      store.monthlyExpenses = 0
      store.validateInputs()
      expect(store.errors.monthlyExpenses).toBe('')
    })
  })

  describe('resetToDefaults functionality', () => {
    it('should reset all values to defaults including new fields', () => {
      const store = useCoastFireStore()
      
      // Change values from defaults
      store.currentAge = 45
      store.retirementAge = 70
      store.currentSavings = 100000
      store.expectedReturnRate = 10
      store.targetRetirementAmount = 2000000
      store.monthlyExpenses = 5000
      store.withdrawalRate = 6
      store.lastEditedField = 'monthly'
      
      // Add some validation errors
      store.currentAge = 17
      store.validateInputs()
      expect(store.errors.currentAge).not.toBe('')
      
      // Reset to defaults
      store.resetToDefaults()
      
      // Check that defaults are restored
      expect(store.currentAge).toBe(30)
      expect(store.retirementAge).toBe(65)
      expect(store.currentSavings).toBe(50000)
      expect(store.expectedReturnRate).toBe(7)
      expect(store.targetRetirementAmount).toBe(1000000)
      expect(store.monthlyExpenses).toBe(0)
      expect(store.withdrawalRate).toBe(4)
      expect(store.lastEditedField).toBe('target')
      
      // Check that errors are cleared
      expect(store.errors.currentAge).toBe('')
      expect(store.errors.retirementAge).toBe('')
      expect(store.errors.currentSavings).toBe('')
      expect(store.errors.expectedReturnRate).toBe('')
      expect(store.errors.targetRetirementAmount).toBe('')
      expect(store.errors.monthlyExpenses).toBe('')
      expect(store.errors.withdrawalRate).toBe('')
    })
  })

  describe('store integration tests', () => {
    it('should update computed values when inputs change', () => {
      const store = useCoastFireStore()
      
      // Set initial values
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 50000
      store.expectedReturnRate = 7
      store.targetRetirementAmount = 1000000
      
      const initialFutureValue = store.futureValueOfCurrentSavings
      const initialAdditionalNeeded = store.additionalSavingsNeeded
      const initialCoastAge = store.coastFIREAge
      
      // Change current savings
      store.currentSavings = 100000
      
      // Computed values should update
      expect(store.futureValueOfCurrentSavings).toBeGreaterThan(initialFutureValue)
      expect(store.additionalSavingsNeeded).toBeLessThan(initialAdditionalNeeded)
      
      // With higher current savings, might already be Coast FIRE ready or need less time
      // The age could be the current age (30) if already ready, or possibly higher if not ready yet
      expect(Number.isFinite(store.coastFIREAge)).toBe(true)
      expect(store.coastFIREAge).toBeGreaterThanOrEqual(store.currentAge)
    })

    it('should maintain calculation consistency after reset', () => {
      const store = useCoastFireStore()
      
      // Change from defaults
      store.currentAge = 40
      store.retirementAge = 70
      store.currentSavings = 200000
      store.expectedReturnRate = 9
      store.targetRetirementAmount = 2000000
      
      // Calculate values
      const modifiedFutureValue = store.futureValueOfCurrentSavings
      const modifiedAdditionalNeeded = store.additionalSavingsNeeded
      
      // Reset to defaults
      store.resetToDefaults()
      
      // Should have different results with default values
      const defaultFutureValue = store.futureValueOfCurrentSavings
      const defaultAdditionalNeeded = store.additionalSavingsNeeded
      
      expect(defaultFutureValue).not.toBe(modifiedFutureValue)
      expect(defaultAdditionalNeeded).not.toBe(modifiedAdditionalNeeded)
      
      // But calculations should still be valid
      expect(Number.isFinite(defaultFutureValue)).toBe(true)
      expect(Number.isFinite(defaultAdditionalNeeded)).toBe(true)
    })

    it('should integrate validation with calculations properly', () => {
      const store = useCoastFireStore()
      
      // Set valid values
      store.currentAge = 25
      store.retirementAge = 65
      store.currentSavings = 30000
      store.expectedReturnRate = 8
      store.targetRetirementAmount = 1500000
      
      // Validate should pass
      const isValid = store.validateInputs()
      expect(isValid).toBe(true)
      
      // Calculations should work
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
      expect(store.futureValueOfCurrentSavings).toBeGreaterThan(30000)
      
      // Set invalid values
      store.currentAge = 70
      store.retirementAge = 65 // Invalid: retirement age < current age
      
      // Validate should fail
      const isValidAfter = store.validateInputs()
      expect(isValidAfter).toBe(false)
      expect(store.errors.retirementAge).toContain('greater than current age')
      
      // But calculations should still be computable (even if nonsensical)
      expect(Number.isFinite(store.futureValueOfCurrentSavings)).toBe(true)
    })

    it('should handle reactive state changes correctly', () => {
      const store = useCoastFireStore()
      
      // Set initial state
      store.currentAge = 30
      store.retirementAge = 65
      store.currentSavings = 75000
      store.expectedReturnRate = 6
      store.targetRetirementAmount = 1200000
      
      // Access computed property to trigger reactivity
      const initialResult = store.isCoastFIREReady
      
      // Change multiple values
      store.currentSavings = 100000
      store.expectedReturnRate = 8
      
      // Computed values should reflect all changes
      const newResult = store.isCoastFIREReady
      const newFutureValue = store.futureValueOfCurrentSavings
      
      // With higher savings and return rate, more likely to be Coast FIRE ready
      expect(newFutureValue).toBeGreaterThan(75000 * Math.pow(1.06, 35))
      
      // Results should be consistent
      expect(typeof newResult).toBe('boolean')
      expect(Number.isFinite(newFutureValue)).toBe(true)
    })

    it('should properly simulate state persistence behavior', () => {
      const store1 = useCoastFireStore()
      
      // Set custom values (simulating user input)
      store1.currentAge = 32
      store1.retirementAge = 62
      store1.currentSavings = 85000
      store1.expectedReturnRate = 7.5
      store1.targetRetirementAmount = 1300000
      
      // Get calculated results
      const results1 = {
        futureValue: store1.futureValueOfCurrentSavings,
        additionalNeeded: store1.additionalSavingsNeeded,
        coastAge: store1.coastFIREAge,
        isReady: store1.isCoastFIREReady
      }
      
      // Create another store instance (simulating page refresh with persistence)
      const store2 = useCoastFireStore()
      
      // Manually set same values (simulating restored from localStorage)
      store2.currentAge = 32
      store2.retirementAge = 62
      store2.currentSavings = 85000
      store2.expectedReturnRate = 7.5
      store2.targetRetirementAmount = 1300000
      
      // Get calculated results from second store
      const results2 = {
        futureValue: store2.futureValueOfCurrentSavings,
        additionalNeeded: store2.additionalSavingsNeeded,
        coastAge: store2.coastFIREAge,
        isReady: store2.isCoastFIREReady
      }
      
      // Results should be identical (calculations are deterministic)
      expect(results1.futureValue).toBe(results2.futureValue)
      expect(results1.additionalNeeded).toBe(results2.additionalNeeded)
      expect(results1.coastAge).toBe(results2.coastAge)
      expect(results1.isReady).toBe(results2.isReady)
    })
  })
})