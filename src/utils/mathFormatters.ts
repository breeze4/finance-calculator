/**
 * Mathematical formatting utilities for tooltips
 * Provides functions to format formulas, equations, and mathematical expressions
 */

export interface FormulaValues {
  [key: string]: number | string
}

/**
 * Format a formula template with actual values
 * @param template - Formula template with placeholders like {value}
 * @param values - Object with values to substitute
 * @returns Formatted formula string
 */
export function formatFormula(template: string, values: FormulaValues): string {
  let formatted = template
  
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    let formattedValue: string
    
    if (typeof value === 'number') {
      const keyLower = key.toLowerCase()
      
      // Order matters - check more specific patterns first
      if (keyLower.includes('age') || (keyLower.includes('years') && !keyLower.includes('rate'))) {
        formattedValue = Math.round(value).toString()
      } else if (keyLower.includes('rate') || keyLower.includes('percentage')) {
        formattedValue = formatPercentage(value)
      } else if (keyLower.includes('currency') || 
                 keyLower.includes('amount') || 
                 keyLower.includes('savings') ||
                 (keyLower.includes('target') && !keyLower.includes('age')) ||
                 keyLower.includes('expenses')) {
        formattedValue = formatCurrency(value)
      } else {
        // For numeric values that shouldn't be formatted as currency
        formattedValue = formatNumber(value)
      }
    } else {
      formattedValue = String(value)
    }
    
    formatted = formatted.replace(
      new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
      formattedValue
    )
  })
  
  return formatted
}

/**
 * Format a number as currency
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value)
}

/**
 * Format a number as percentage
 * @param value - Numeric value (e.g., 7 for 7%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format a regular number with proper locale formatting
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value)
}

/**
 * Format exponential notation (base^exponent)
 * @param base - Base number
 * @param exponent - Exponent number
 * @returns HTML string with superscript
 */
export function formatExponent(base: number | string, exponent: number | string): string {
  const formattedBase = typeof base === 'number' ? formatNumber(base, 2) : base
  const formattedExp = typeof exponent === 'number' ? formatNumber(exponent, 0) : exponent
  return `${formattedBase}<sup>${formattedExp}</sup>`
}

/**
 * Format a complete equation (left operator right = result)
 * @param left - Left side of equation
 * @param operator - Mathematical operator
 * @param right - Right side of equation
 * @param result - Result of the equation
 * @returns Formatted equation string
 */
export function formatEquation(left: string, operator: string, right: string, result: string): string {
  return `${left} ${operator} ${right} = ${result}`
}

/**
 * Format compound interest calculation steps
 * @param principal - Initial amount
 * @param rate - Interest rate (as decimal, e.g., 0.07 for 7%)
 * @param years - Number of years
 * @param showSteps - Whether to show intermediate steps
 * @returns Array of calculation step strings
 */
export function formatCompoundInterestSteps(
  principal: number, 
  rate: number, 
  years: number, 
  showSteps: boolean = true
): string[] {
  const steps: string[] = []
  const ratePercent = rate * 100
  const multiplier = Math.pow(1 + rate, years)
  const result = principal * multiplier
  
  steps.push(`FV = PV × (1 + r)<sup>${years}</sup>`)
  
  if (showSteps) {
    steps.push(`FV = ${formatCurrency(principal)} × (1 + ${formatPercentage(ratePercent)})<sup>${years}</sup>`)
    steps.push(`FV = ${formatCurrency(principal)} × (${formatNumber(1 + rate, 3)})<sup>${years}</sup>`)
    steps.push(`FV = ${formatCurrency(principal)} × ${formatNumber(multiplier, 3)}`)
  }
  
  steps.push(`FV = ${formatCurrency(result)}`)
  
  return steps
}

/**
 * Format present value calculation steps
 * @param futureValue - Future value amount
 * @param rate - Interest rate (as decimal)
 * @param years - Number of years
 * @param showSteps - Whether to show intermediate steps
 * @returns Array of calculation step strings
 */
export function formatPresentValueSteps(
  futureValue: number,
  rate: number,
  years: number,
  showSteps: boolean = true
): string[] {
  const steps: string[] = []
  const ratePercent = rate * 100
  const divisor = Math.pow(1 + rate, years)
  const result = futureValue / divisor
  
  steps.push(`PV = FV ÷ (1 + r)<sup>${years}</sup>`)
  
  if (showSteps) {
    steps.push(`PV = ${formatCurrency(futureValue)} ÷ (1 + ${formatPercentage(ratePercent)})<sup>${years}</sup>`)
    steps.push(`PV = ${formatCurrency(futureValue)} ÷ (${formatNumber(1 + rate, 3)})<sup>${years}</sup>`)
    steps.push(`PV = ${formatCurrency(futureValue)} ÷ ${formatNumber(divisor, 3)}`)
  }
  
  steps.push(`PV = ${formatCurrency(result)}`)
  
  return steps
}

/**
 * Format Fisher equation calculation steps
 * @param nominalRate - Nominal interest rate (as decimal)
 * @param inflationRate - Inflation rate (as decimal)
 * @param showSteps - Whether to show intermediate steps
 * @returns Array of calculation step strings
 */
export function formatFisherEquationSteps(
  nominalRate: number,
  inflationRate: number,
  showSteps: boolean = true
): string[] {
  const steps: string[] = []
  const nominalPercent = nominalRate * 100
  const inflationPercent = inflationRate * 100
  const realRate = ((1 + nominalRate) / (1 + inflationRate)) - 1
  const realPercent = realRate * 100
  
  steps.push(`Real Rate = (1 + nominal) ÷ (1 + inflation) - 1`)
  
  if (showSteps) {
    steps.push(`Real Rate = (1 + ${formatPercentage(nominalPercent)}) ÷ (1 + ${formatPercentage(inflationPercent)}) - 1`)
    steps.push(`Real Rate = ${formatNumber(1 + nominalRate, 3)} ÷ ${formatNumber(1 + inflationRate, 3)} - 1`)
    steps.push(`Real Rate = ${formatNumber((1 + nominalRate) / (1 + inflationRate), 6)} - 1`)
  }
  
  steps.push(`Real Rate = ${formatPercentage(realPercent, 1)}`)
  
  return steps
}

/**
 * Format withdrawal rate calculation (4% rule)
 * @param targetAmount - Target retirement amount
 * @param withdrawalRate - Withdrawal rate (as percentage, e.g., 4 for 4%)
 * @param isMonthly - Whether to calculate monthly (true) or annual (false)
 * @param showSteps - Whether to show intermediate steps
 * @returns Array of calculation step strings
 */
export function formatWithdrawalSteps(
  targetAmount: number,
  withdrawalRate: number,
  isMonthly: boolean = true,
  showSteps: boolean = true
): string[] {
  const steps: string[] = []
  const annualAmount = targetAmount * (withdrawalRate / 100)
  const monthlyAmount = annualAmount / 12
  
  if (isMonthly) {
    steps.push(`Monthly = (Target × Rate) ÷ 12`)
    if (showSteps) {
      steps.push(`Monthly = (${formatCurrency(targetAmount)} × ${formatPercentage(withdrawalRate)}) ÷ 12`)
      steps.push(`Monthly = ${formatCurrency(annualAmount)} ÷ 12`)
    }
    steps.push(`Monthly = ${formatCurrency(monthlyAmount)}`)
  } else {
    steps.push(`Annual = Target × Rate`)
    if (showSteps) {
      steps.push(`Annual = ${formatCurrency(targetAmount)} × ${formatPercentage(withdrawalRate)}`)
    }
    steps.push(`Annual = ${formatCurrency(annualAmount)}`)
  }
  
  return steps
}

/**
 * Format logarithmic time calculation (for Coast FIRE age)
 * @param futureValue - Target future value
 * @param presentValue - Current savings
 * @param rate - Growth rate (as decimal)
 * @param currentAge - Current age
 * @param showSteps - Whether to show intermediate steps
 * @returns Array of calculation step strings
 */
export function formatLogarithmicTimeSteps(
  futureValue: number,
  presentValue: number,
  rate: number,
  currentAge: number,
  showSteps: boolean = true
): string[] {
  const steps: string[] = []
  const ratePercent = rate * 100
  const ratio = futureValue / presentValue
  const years = Math.log(ratio) / Math.log(1 + rate)
  const targetAge = currentAge + years
  
  steps.push(`t = ln(FV ÷ PV) ÷ ln(1 + r)`)
  
  if (showSteps) {
    steps.push(`t = ln(${formatCurrency(futureValue)} ÷ ${formatCurrency(presentValue)}) ÷ ln(1 + ${formatPercentage(ratePercent)})`)
    steps.push(`t = ln(${formatNumber(ratio, 3)}) ÷ ln(${formatNumber(1 + rate, 3)})`)
    steps.push(`t = ${formatNumber(Math.log(ratio), 3)} ÷ ${formatNumber(Math.log(1 + rate), 6)}`)
    steps.push(`t = ${formatNumber(years, 1)} years`)
  }
  
  steps.push(`Coast FIRE Age = ${currentAge} + ${formatNumber(years, 1)} = ${formatNumber(targetAge, 1)} years old`)
  
  return steps
}