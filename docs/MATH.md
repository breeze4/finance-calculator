# Mathematical Formulas Used in Finance Calculator

## Coast FIRE Calculator

### Core Calculations

#### 1. Years to Retirement
**Source:** `src/stores/coastFire.ts:101-103`
```javascript
yearsToRetirement = Math.max(0, retirementAge - currentAge)
```

#### 2. Future Value of Current Savings
**Source:** `src/stores/coastFire.ts:105-109`
```javascript
rate = expectedReturnRate / 100
years = yearsToRetirement
futureValueOfCurrentSavings = currentSavings * Math.pow(1 + rate, years)
```
**Mathematical Formula:**
```
FV = PV × (1 + r)^t

Where:
- FV = Future Value
- PV = Present Value (currentSavings)
- r = Annual return rate as decimal (expectedReturnRate / 100)
- t = Time in years (yearsToRetirement)
```

#### 3. Coast FIRE Ready Check
**Source:** `src/stores/coastFire.ts:111-113`
```javascript
isCoastFIREReady = futureValueOfCurrentSavings >= activeTargetAmount
```
Note: `activeTargetAmount` is either the direct target amount or calculated from monthly expenses.

#### 4. Additional Savings Needed
**Source:** `src/stores/coastFire.ts:115-123`
```javascript
if (isCoastFIREReady) return 0

rate = expectedReturnRate / 100
years = yearsToRetirement
target = activeTargetAmount

if (years === 0) return target - currentSavings

presentValue = target / Math.pow(1 + rate, years)
additionalSavingsNeeded = Math.max(0, presentValue - currentSavings)
```
**Mathematical Formula:**
```
If Coast FIRE ready: additionalSavingsNeeded = 0

If years to retirement = 0: additionalSavingsNeeded = target - currentSavings

Otherwise:
PV_needed = target ÷ (1 + r)^t
additionalSavingsNeeded = max(0, PV_needed - currentSavings)

Where:
- PV_needed = Present value needed today to reach target
- r = Annual return rate as decimal (expectedReturnRate / 100) 
- t = Years to retirement
```

#### 5. Coast FIRE Age Calculation
**Source:** `src/stores/coastFire.ts:176-183`
```javascript
if (isCoastFIREReady) return currentAge

rate = effectiveReturnRate / 100
target = inflationAdjustedTarget
yearsNeeded = Math.log(target / currentSavings) / Math.log(1 + rate)
coastFIREAge = Math.ceil(currentAge + yearsNeeded)
```
**Mathematical Formula:**
```
If already Coast FIRE ready: coastFIREAge = currentAge

If not ready:
yearsNeeded = ln(target ÷ currentSavings) ÷ ln(1 + r)
coastFIREAge = ceiling(currentAge + yearsNeeded)

Where:
- ln = natural logarithm (Math.log in JavaScript)
- r = Effective return rate as decimal (real or nominal based on inflation setting)
- target = Inflation-adjusted target amount
- ceiling = round up to nearest integer (Math.ceil)
```

#### 6. Coast FIRE Number at Current Age
**Source:** `src/stores/coastFire.ts:185-199`
```javascript
rate = effectiveReturnRate / 100
years = yearsToRetirement
target = inflationAdjustedTarget

if (years === 0) return target

coastFIRENumber = target / Math.pow(1 + rate, years)
```
**Mathematical Formula:**
```
If years to retirement = 0: coastFIRENumber = target

Otherwise:
coastFIRENumber = target ÷ (1 + r)^t

Where:
- r = Effective return rate as decimal (real or nominal based on inflation setting)
- t = Years to retirement
- target = Inflation-adjusted target amount

This calculates the present value of the target amount - the exact amount 
you need saved at your current age to coast to your retirement goal.
```

### Additional Calculations

#### 7. Target from Monthly Expenses
**Source:** `src/stores/coastFire.ts:179-182`
```javascript
if (monthlyExpenses <= 0 || withdrawalRate <= 0) return 0
targetFromMonthlyExpenses = (monthlyExpenses * 12) / (withdrawalRate / 100)
```
**Mathematical Formula:**
```
target = (monthlyExpenses × 12) ÷ (withdrawalRate ÷ 100)

This uses the 4% rule (or specified withdrawal rate) to calculate
the total needed based on annual expenses.
```

#### 8. Monthly from Target Amount
**Source:** `src/stores/coastFire.ts:184-187`
```javascript
if (targetRetirementAmount <= 0 || withdrawalRate <= 0) return 0
monthlyFromTarget = (targetRetirementAmount * (withdrawalRate / 100)) / 12
```
**Mathematical Formula:**
```
monthlySpending = (targetAmount × (withdrawalRate ÷ 100)) ÷ 12

Calculates monthly spending available from a given portfolio size.
```

## Mortgage Payoff Calculator

### Core Calculations

#### 1. Monthly Interest Rate
**Source:** `src/stores/mortgagePayoff.ts:28`
```javascript
monthlyInterestRate = interestRate / 100 / 12
```

#### 2. Total Months
**Source:** `src/stores/mortgagePayoff.ts:29`
```javascript
totalMonths = yearsLeft * 12
```

#### 3. Payoff Time Calculation (Iterative)
**Source:** `src/stores/mortgagePayoff.ts:31-47`
```javascript
function calculatePayoffTime(extraMonthly, lumpSum) {
  balance = principal - lumpSum
  months = 0
  payment = monthlyPayment + extraMonthly
  rate = monthlyInterestRate
  
  while (balance > 0 && months < totalMonths * 2) {
    interestCharge = balance * rate
    principalPayment = payment - interestCharge
    balance -= principalPayment
    months++
    
    if (balance < 0) balance = 0
  }
  
  return months
}
```
**Mathematical Formula:**
```
Initial: balance = principal - lumpSum

For each month until balance = 0:
  interestCharge = balance × monthlyInterestRate
  principalPayment = (monthlyPayment + extraMonthly) - interestCharge
  balance = balance - principalPayment
  months = months + 1
  
Payoff time = total months counted
```

#### 4. Total Interest Calculation (Iterative)
**Source:** `src/stores/mortgagePayoff.ts:49-67`
```javascript
function calculateTotalInterest(extraMonthly, lumpSum) {
  balance = principal - lumpSum
  totalInterest = 0
  months = 0
  payment = monthlyPayment + extraMonthly
  rate = monthlyInterestRate
  
  while (balance > 0 && months < totalMonths * 2) {
    interestCharge = balance * rate
    totalInterest += interestCharge
    principalPayment = payment - interestCharge
    balance -= principalPayment
    months++
    
    if (balance < 0) balance = 0
  }
  
  return totalInterest
}
```

#### 5. Savings Calculations
**Source:** `src/stores/mortgagePayoff.ts:79-80`
```javascript
monthsSaved = basePayoffMonths - acceleratedPayoffMonths
interestSaved = baseTotalInterest - acceleratedTotalInterest
```

### Investment Comparison Calculations

#### 6. Investment Value Calculation
**Source:** `src/stores/mortgagePayoff.ts:82-95`
```javascript
function calculateInvestmentValue() {
  months = acceleratedPayoffMonths
  monthlyReturn = investmentReturnRate / 100 / 12
  
  // Future value of lump sum
  investmentValue = lumpSumPayment * Math.pow(1 + monthlyReturn, months)
  
  // Future value of monthly payments (annuity)
  if (additionalMonthlyPayment > 0) {
    futureValue = additionalMonthlyPayment * 
      ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
    investmentValue += futureValue
  }
  
  return investmentValue
}
```
**Mathematical Formulas:**
```
Future Value of Lump Sum:
FV_lump = lumpSum × (1 + r)^n

Future Value of Annuity (Monthly Payments):
FV_annuity = monthlyPayment × [((1 + r)^n - 1) ÷ r]

Total Investment Value:
investmentGrossReturn = FV_lump + FV_annuity

Where:
- r = monthlyReturn = annualReturn ÷ 100 ÷ 12
- n = months = acceleratedPayoffMonths
```

#### 7. Investment Profit and Taxes
**Source:** `src/stores/mortgagePayoff.ts:99-106`
```javascript
// Total amount invested
totalInvested = lumpSumPayment + (additionalMonthlyPayment * acceleratedPayoffMonths)

// Profit calculation
investmentProfit = investmentGrossReturn - totalInvested

// Tax calculation
investmentTaxes = investmentProfit * (investmentTaxRate / 100)

// Net return after taxes
investmentNetReturn = investmentGrossReturn - investmentTaxes
```

#### 8. Strategy Recommendation
**Source:** `src/stores/mortgagePayoff.ts:108-117`
```javascript
betterStrategy = computed(() => {
  // Total invested amount
  totalInvested = lumpSumPayment + (additionalMonthlyPayment * acceleratedPayoffMonths)
  
  // Net benefit from investment (what you gain after taxes)
  investmentNetBenefit = investmentNetReturn - totalInvested
  
  // If investment profit (after tax) > interest saved, invest is better
  return investmentNetBenefit > interestSaved ? 'invest' : 'payoff'
})
```
**Decision Logic:**
```
investmentNetBenefit = (investmentGrossReturn - investmentTaxes) - totalInvested

if (investmentNetBenefit > interestSaved):
    betterStrategy = 'invest'
else:
    betterStrategy = 'payoff'
```

## Chart Data Calculations

### Coast FIRE Projection Chart
**Source:** `src/stores/coastFire.ts:134-177`
```javascript
// For each year from current age to retirement:
for (let i = 0; i <= years; i++) {
  age = currentAge + i
  projectedValue = currentSavings * Math.pow(1 + rate, i)
  // Target value remains constant at activeTargetAmount
}
```

### Mortgage Balance Chart
**Source:** `src/stores/mortgagePayoff.ts:119-182`
```javascript
// Standard and accelerated balance calculations
// For each month:
if (balance > 0) {
  interestCharge = balance * monthlyInterestRate
  principalPayment = payment - interestCharge
  balance = Math.max(0, balance - principalPayment)
}
```

## Key Mathematical Concepts

### Compound Interest
The foundation of the Coast FIRE calculator, showing how money grows exponentially over time.
- Formula: FV = PV × (1 + r)^t
- Used for projecting retirement savings growth

### Amortization
Used in mortgage calculations to determine how loan payments are split between principal and interest over time.
- Each payment consists of interest (balance × rate) and principal reduction
- Balance decreases over time, shifting more payment toward principal

### Present Value vs Future Value
- **Present Value (PV)**: What a future amount is worth today
  - Formula: PV = FV ÷ (1 + r)^t
  - Used to calculate how much you need today for Coast FIRE
- **Future Value (FV)**: What a current amount will be worth in the future
  - Formula: FV = PV × (1 + r)^t
  - Used to project savings growth

### Logarithmic Solving for Time
Used to solve for time in compound interest equations when target amount is known.
- Formula: t = ln(FV ÷ PV) ÷ ln(1 + r)
- Used to calculate when you'll reach Coast FIRE

### Annuity Calculations
Used for investment scenarios involving regular monthly payments.
- Future Value of Annuity: FV = PMT × [((1 + r)^n - 1) ÷ r]
- Represents the value of regular contributions compounded over time

## Assumptions and Limitations

### Coast FIRE Calculator
- Assumes constant annual return rate (no market volatility)
- Does not account for inflation in calculations
- Assumes no additional contributions after reaching Coast FIRE
- Does not include investment fees or taxes on returns during accumulation
- Uses simple compound interest without considering:
  - Dollar-cost averaging effects
  - Rebalancing costs
  - Sequence of returns risk

### Mortgage Calculator
- Uses simple amortization without additional costs:
  - No PMI (Private Mortgage Insurance)
  - No property taxes
  - No homeowner's insurance
  - No HOA fees
- Investment returns assumed to be constant (no volatility)
- Tax calculation is simplified:
  - Applies single rate to all gains
  - Assumes long-term capital gains rate
  - Does not consider tax-loss harvesting
  - Does not account for state taxes
- Does not account for:
  - Opportunity cost of down payment
  - Mortgage interest tax deduction benefits
  - Investment fees or expense ratios
  - Emergency fund considerations
- Assumes investments are held until mortgage payoff completion

## Implementation Notes

### JavaScript Math Functions Used
- `Math.pow(base, exponent)`: For compound interest calculations
- `Math.log(x)`: Natural logarithm for time calculations
- `Math.ceil(x)`: Rounding up for age calculations
- `Math.max(a, b)`: Ensuring non-negative values
- `Math.floor(x)`: For year/month conversions

### Precision Considerations
- Monthly rates are calculated as annual rate / 100 / 12
- All currency values are stored as numbers (potential for floating-point errors)
- Chart data points are calculated at discrete intervals (monthly or yearly)

### Edge Cases Handled
- Division by zero prevented in annuity calculations (checks for monthlyReturn > 0)
- Negative balances prevented in mortgage calculations (Math.max(0, balance))
- Maximum iteration limits in mortgage calculations (totalMonths * 2)
- Zero or negative input validation in UI components