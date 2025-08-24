/**
 * Input Validation Functions
 * 
 * Pure functions for validating user inputs across the finance calculator.
 * All functions return null for valid inputs or error message strings for invalid inputs.
 */

/**
 * Interface for validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Interface for Coast FIRE input validation
 */
export interface CoastFireInputs {
  currentAge: number
  retirementAge: number
  currentSavings: number
  expectedReturnRate: number
  targetRetirementAmount: number
  monthlyExpenses: number
  yearlyExpenses: number
  withdrawalRate: number
  inflationRate: number
}

/**
 * Interface for Mortgage input validation
 */
export interface MortgageInputs {
  principal: number
  yearsLeft: number
  interestRate: number
  monthlyPayment: number
  additionalMonthlyPayment: number
  lumpSumPayment: number
  investmentReturnRate: number
  investmentTaxRate: number
}

/**
 * Validate a numeric value is within a specified range
 * 
 * @param value - Value to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateNumericRange(25, 18, 100, 'age') // null (valid)
 * validateNumericRange(15, 18, 100, 'age') // 'age must be between 18 and 100'
 */
export function validateNumericRange(
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  
  return null
}

/**
 * Validate that a value is not negative
 * 
 * @param value - Value to validate
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateNonNegative(1000, 'savings') // null (valid)
 * validateNonNegative(-500, 'savings') // 'savings cannot be negative'
 */
export function validateNonNegative(value: number, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  
  if (value < 0) {
    return `${fieldName} cannot be negative`
  }
  
  return null
}

/**
 * Validate that a value is positive (greater than 0)
 * 
 * @param value - Value to validate
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validatePositive(1000, 'target amount') // null (valid)
 * validatePositive(0, 'target amount') // 'target amount must be greater than 0'
 */
export function validatePositive(value: number, fieldName: string): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  
  if (value <= 0) {
    return `${fieldName} must be greater than 0`
  }
  
  return null
}

/**
 * Validate age range (18-100)
 * 
 * @param age - Age value to validate
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateAge(30, 'current age') // null (valid)
 * validateAge(15, 'current age') // 'current age must be between 18 and 100'
 */
export function validateAge(age: number, fieldName: string): string | null {
  return validateNumericRange(age, 18, 100, fieldName)
}

/**
 * Validate percentage rate (0-30%)
 * 
 * @param rate - Rate value to validate as percentage (e.g., 7 for 7%)
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateReturnRate(7, 'return rate') // null (valid)
 * validateReturnRate(35, 'return rate') // 'return rate must be between 0% and 30%'
 */
export function validateReturnRate(rate: number, fieldName: string): string | null {
  const error = validateNumericRange(rate, 0, 30, fieldName)
  if (error) {
    return error.replace('between 0 and 30', 'between 0% and 30%')
  }
  return null
}

/**
 * Validate withdrawal rate (2-8%)
 * 
 * @param rate - Withdrawal rate to validate as percentage
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateWithdrawalRate(4, 'withdrawal rate') // null (valid)
 * validateWithdrawalRate(10, 'withdrawal rate') // 'withdrawal rate should be between 2% and 8%'
 */
export function validateWithdrawalRate(rate: number, fieldName: string): string | null {
  const error = validateNumericRange(rate, 2, 8, fieldName)
  if (error) {
    return error.replace('must be between 2 and 8', 'should be between 2% and 8%')
  }
  return null
}

/**
 * Validate inflation rate (0-10%)
 * 
 * @param rate - Inflation rate to validate as percentage
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateInflationRate(3, 'inflation rate') // null (valid)
 * validateInflationRate(15, 'inflation rate') // 'inflation rate should be between 0% and 10%'
 */
export function validateInflationRate(rate: number, fieldName: string): string | null {
  const error = validateNumericRange(rate, 0, 10, fieldName)
  if (error) {
    return error.replace('must be between 0 and 10', 'should be between 0% and 10%')
  }
  return null
}

/**
 * Validate tax rate (0-50%)
 * 
 * @param rate - Tax rate to validate as percentage
 * @param fieldName - Name of field for error message
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateTaxRate(20, 'tax rate') // null (valid)
 * validateTaxRate(60, 'tax rate') // 'tax rate must be between 0% and 50%'
 */
export function validateTaxRate(rate: number, fieldName: string): string | null {
  const error = validateNumericRange(rate, 0, 50, fieldName)
  if (error) {
    return error.replace('between 0 and 50', 'between 0% and 50%')
  }
  return null
}

/**
 * Validate that retirement age is greater than current age
 * 
 * @param currentAge - Current age
 * @param retirementAge - Retirement age
 * @returns null if valid, error message if invalid
 * 
 * @example
 * validateRetirementAge(30, 65) // null (valid)
 * validateRetirementAge(40, 35) // 'Retirement age must be greater than current age'
 */
export function validateRetirementAge(currentAge: number, retirementAge: number): string | null {
  if (typeof currentAge !== 'number' || isNaN(currentAge)) {
    return 'Current age must be a valid number'
  }
  
  if (typeof retirementAge !== 'number' || isNaN(retirementAge)) {
    return 'Retirement age must be a valid number'
  }
  
  if (retirementAge <= currentAge) {
    return 'Retirement age must be greater than current age'
  }
  
  return null
}

/**
 * Validate all Coast FIRE inputs
 * 
 * @param inputs - Coast FIRE input values to validate
 * @returns ValidationResult with overall validity and individual field errors
 * 
 * @example
 * validateCoastFireInputs({currentAge: 30, retirementAge: 65, ...})
 * // {isValid: true, errors: {}}
 */
export function validateCoastFireInputs(inputs: CoastFireInputs): ValidationResult {
  const errors: Record<string, string> = {}
  
  // Individual field validations
  const currentAgeError = validateAge(inputs.currentAge, 'Current age')
  if (currentAgeError) errors.currentAge = currentAgeError
  
  const retirementAgeError = validateAge(inputs.retirementAge, 'Retirement age')
  if (retirementAgeError) errors.retirementAge = retirementAgeError
  
  const currentSavingsError = validateNonNegative(inputs.currentSavings, 'Current savings')
  if (currentSavingsError) errors.currentSavings = currentSavingsError
  
  const returnRateError = validateReturnRate(inputs.expectedReturnRate, 'Return rate')
  if (returnRateError) errors.expectedReturnRate = returnRateError
  
  const targetError = validatePositive(inputs.targetRetirementAmount, 'Target retirement amount')
  if (targetError) errors.targetRetirementAmount = targetError
  
  const monthlyExpensesError = validateNonNegative(inputs.monthlyExpenses, 'Monthly expenses')
  if (monthlyExpensesError) errors.monthlyExpenses = monthlyExpensesError
  
  const yearlyExpensesError = validateNonNegative(inputs.yearlyExpenses, 'Yearly expenses')
  if (yearlyExpensesError) errors.yearlyExpenses = yearlyExpensesError
  
  const withdrawalRateError = validateWithdrawalRate(inputs.withdrawalRate, 'Withdrawal rate')
  if (withdrawalRateError) errors.withdrawalRate = withdrawalRateError
  
  const inflationRateError = validateInflationRate(inputs.inflationRate, 'Inflation rate')
  if (inflationRateError) errors.inflationRate = inflationRateError
  
  // Cross-field validation
  const retirementAgeComparisonError = validateRetirementAge(inputs.currentAge, inputs.retirementAge)
  if (retirementAgeComparisonError && !errors.retirementAge) {
    errors.retirementAge = retirementAgeComparisonError
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate all Mortgage inputs
 * 
 * @param inputs - Mortgage input values to validate
 * @returns ValidationResult with overall validity and individual field errors
 * 
 * @example
 * validateMortgageInputs({principal: 300000, yearsLeft: 25, ...})
 * // {isValid: true, errors: {}}
 */
export function validateMortgageInputs(inputs: MortgageInputs): ValidationResult {
  const errors: Record<string, string> = {}
  
  const principalError = validatePositive(inputs.principal, 'Principal')
  if (principalError) errors.principal = principalError
  
  const yearsLeftError = validateNumericRange(inputs.yearsLeft, 0.1, 50, 'Years left')
  if (yearsLeftError) errors.yearsLeft = yearsLeftError
  
  const interestRateError = validateNumericRange(inputs.interestRate, 0, 15, 'Interest rate')
  if (interestRateError) {
    errors.interestRate = interestRateError.replace('between 0 and 15', 'between 0% and 15%')
  }
  
  const monthlyPaymentError = validatePositive(inputs.monthlyPayment, 'Monthly payment')
  if (monthlyPaymentError) errors.monthlyPayment = monthlyPaymentError
  
  const additionalPaymentError = validateNonNegative(inputs.additionalMonthlyPayment, 'Additional monthly payment')
  if (additionalPaymentError) errors.additionalMonthlyPayment = additionalPaymentError
  
  const lumpSumError = validateNonNegative(inputs.lumpSumPayment, 'Lump sum payment')
  if (lumpSumError) errors.lumpSumPayment = lumpSumError
  
  const investmentReturnError = validateReturnRate(inputs.investmentReturnRate, 'Investment return rate')
  if (investmentReturnError) errors.investmentReturnRate = investmentReturnError
  
  const taxRateError = validateTaxRate(inputs.investmentTaxRate, 'Investment tax rate')
  if (taxRateError) errors.investmentTaxRate = taxRateError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}