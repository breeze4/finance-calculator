# Mathematical Formulas Used in Finance Calculator

## Coast FIRE Calculator

### Core Calculations

#### 1. Years to Retirement
```
yearsToRetirement = max(0, retirementAge - currentAge)
```

#### 2. Future Value of Current Savings
**Compound Interest Formula:**
```
FV = PV × (1 + r)^t

Where:
- FV = Future Value
- PV = Present Value (current savings)
- r = Annual return rate (as decimal)
- t = Time in years (yearsToRetirement)
```

#### 3. Coast FIRE Ready Check
```
isCoastFIREReady = futureValueOfCurrentSavings >= targetRetirementAmount
```

#### 4. Additional Savings Needed
**Present Value Formula (reverse compound interest):**
```
If Coast FIRE ready: additionalSavingsNeeded = 0

If not ready:
PV_needed = targetRetirementAmount ÷ (1 + r)^t
additionalSavingsNeeded = max(0, PV_needed - currentSavings)

Where:
- PV_needed = Present value needed today to reach target
- r = Annual return rate (as decimal) 
- t = Years to retirement
```

#### 5. Coast FIRE Age Calculation
**Logarithmic Formula:**
```
If already Coast FIRE ready: coastFIREAge = currentAge

If not ready:
yearsNeeded = ln(targetRetirementAmount ÷ currentSavings) ÷ ln(1 + r)
coastFIREAge = ceil(currentAge + yearsNeeded)

Where:
- ln = natural logarithm
- r = Annual return rate (as decimal)
- ceil = round up to nearest integer
```

## Mortgage Payoff Calculator

### Core Calculations

#### 1. Monthly Interest Rate
```
monthlyInterestRate = annualInterestRate ÷ 100 ÷ 12
```

#### 2. Total Months
```
totalMonths = yearsLeft × 12
```

#### 3. Payoff Time Calculation (Iterative)
**Amortization Formula (iterative approach):**
```
For each month until balance = 0:
  interestCharge = currentBalance × monthlyInterestRate
  principalPayment = monthlyPayment - interestCharge
  newBalance = currentBalance - principalPayment
  
totalMonths = number of iterations until balance <= 0
```

#### 4. Total Interest Calculation (Iterative)
```
totalInterest = 0
For each month until balance = 0:
  interestCharge = currentBalance × monthlyInterestRate
  totalInterest += interestCharge
  principalPayment = monthlyPayment - interestCharge
  newBalance = currentBalance - principalPayment
```

#### 5. Savings Calculations
```
monthsSaved = basePayoffMonths - acceleratedPayoffMonths
interestSaved = baseTotalInterest - acceleratedTotalInterest
```

### Investment Comparison Calculations

#### 6. Investment Value (Future Value of Annuity + Lump Sum)
**Future Value of Lump Sum:**
```
FV_lump = lumpSum × (1 + monthlyReturn)^months

Where:
- monthlyReturn = annualReturn ÷ 100 ÷ 12
- months = acceleratedPayoffMonths
```

**Future Value of Annuity (Monthly Payments):**
```
FV_annuity = monthlyPayment × [((1 + r)^n - 1) ÷ r]

Where:
- r = monthlyReturn
- n = months (acceleratedPayoffMonths)
```

**Total Investment Value:**
```
investmentGrossReturn = FV_lump + FV_annuity
```

#### 7. Investment Profit and Taxes
```
totalInvested = lumpSum + (monthlyPayment × months)
investmentProfit = investmentGrossReturn - totalInvested
investmentTaxes = investmentProfit × (taxRate ÷ 100)
investmentNetReturn = investmentGrossReturn - investmentTaxes
```

#### 8. Strategy Recommendation
```
if (investmentNetReturn > (principal + interestSaved)):
    betterStrategy = 'invest'
else:
    betterStrategy = 'payoff'
```

## Key Mathematical Concepts

### Compound Interest
The foundation of the Coast FIRE calculator, showing how money grows exponentially over time.

### Amortization
Used in mortgage calculations to determine how loan payments are split between principal and interest over time.

### Present Value vs Future Value
- **Present Value**: What a future amount is worth today
- **Future Value**: What a current amount will be worth in the future

### Logarithmic Growth
Used to solve for time in compound interest equations when target amount is known.

### Annuity Calculations
Used for investment scenarios involving regular monthly payments.

## Assumptions and Limitations

### Coast FIRE Calculator
- Assumes constant annual return rate (no market volatility)
- Does not account for inflation
- Assumes no additional contributions after reaching Coast FIRE
- Does not include fees or taxes on investment returns

### Mortgage Calculator
- Uses simple amortization (no PMI, property taxes, or insurance)
- Investment returns assumed to be constant
- Tax rate applied as simple capital gains (long-term)
- Does not account for opportunity cost of down payment
- Assumes investments are held until mortgage payoff completion