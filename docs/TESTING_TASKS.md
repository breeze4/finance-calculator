# Unit Testing Tasks for Mathematical Calculations

## Setup Tasks
- [x] Install testing framework (Vitest recommended for Vite projects)
- [x] Configure test environment and test scripts in package.json
- [x] Create test directory structure (`tests/` or `__tests__/`)
- [x] Set up test utilities and helpers

## Coast FIRE Calculator Tests (`tests/coastFire.test.ts`)

### Basic Calculation Tests
- [x] **Test yearsToRetirement calculation**
  - Normal case: current age < retirement age
  - Edge case: current age = retirement age (should return 0)
  - Edge case: current age > retirement age (should return 0 due to max function)

- [x] **Test futureValueOfCurrentSavings calculation**
  - Standard compound interest scenarios
  - Zero return rate (should equal current savings)
  - High return rate scenarios
  - Long time periods (30+ years)
  - Short time periods (1-5 years)

- [x] **Test isCoastFIREReady boolean logic**
  - Case where future value exceeds target (should be true)
  - Case where future value equals target exactly (should be true)
  - Case where future value is less than target (should be false)

- [x] **Test additionalSavingsNeeded calculation**
  - When already Coast FIRE ready (should return 0)
  - When not ready - verify present value formula
  - Edge case: zero time remaining (should return target - current)
  - Various interest rates and time periods

- [x] **Test coastFIREAge calculation**
  - When already Coast FIRE ready (should return current age)
  - When not ready - verify logarithmic formula
  - Edge cases with very high/low return rates
  - Verify ceiling function (should round up)

### Input Validation Tests
- [x] **Test input bounds and validation**
  - Age validation (18-100 range)
  - Retirement age > current age
  - Non-negative savings amounts
  - Return rate bounds (0-30%)
  - Positive target amounts

### Edge Cases and Error Handling
- [x] **Test mathematical edge cases**
  - Zero current savings scenarios  
  - Zero return rate scenarios
  - Very large numbers (millions/billions)
  - Precision/rounding behavior

## Mortgage Payoff Calculator Tests (`tests/mortgagePayoff.test.ts`)

### Basic Calculation Tests
- [x] **Test monthlyInterestRate calculation**
  - Standard annual rates (4%, 5%, 6%)
  - Zero interest rate
  - High interest rates (10%+)

- [x] **Test payoff time calculations (iterative logic)**
  - Standard mortgage scenarios (30-year, 15-year)
  - With extra monthly payments
  - With lump sum payments
  - With both extra monthly and lump sum
  - Verify iteration logic stops when balance reaches zero

- [x] **Test total interest calculations**
  - Verify interest accumulation over loan term
  - Compare base scenario vs accelerated payoff
  - Ensure interest calculation matches payoff time calculation

- [x] **Test savings calculations**
  - monthsSaved = base - accelerated
  - interestSaved = base interest - accelerated interest
  - Verify savings are always positive or zero

### Investment Comparison Tests
- [x] **Test investment value calculations**
  - Lump sum future value (compound interest)
  - Monthly payment annuity future value
  - Combined lump sum + annuity scenarios
  - Various return rates and time periods

- [x] **Test investment profit and tax calculations**
  - Total invested = lump sum + (monthly × months)
  - Profit = gross return - total invested
  - After-tax calculations with various tax rates
  - Edge case: investment loses money (negative profit)

- [x] **Test strategy recommendation logic**
  - Cases where investing is better
  - Cases where mortgage payoff is better
  - Edge case where they're approximately equal

### Amortization Logic Tests
- [x] **Test iterative amortization algorithm**
  - Verify monthly interest charges
  - Verify principal payments
  - Verify balance reduction each month
  - Ensure algorithm terminates correctly
  - Test with edge cases (very small balances)

### Input Validation Tests
- [x] **Test mortgage input validation**
  - Non-negative principal amounts
  - Reasonable years left (0-30)
  - Interest rate bounds (0-20%)
  - Positive monthly payments
  - Non-negative extra payments

## Test Data and Scenarios

### Coast FIRE Test Cases
- [ ] **Create test fixtures with known outcomes**
  - Basic case: $50k, 7% return, 35 years → expected future value
  - Coast FIRE ready case: large current savings
  - Coast FIRE not ready case: small current savings
  - Edge cases for boundary testing

### Mortgage Test Cases  
- [ ] **Create realistic mortgage scenarios**
  - Standard 30-year fixed mortgage
  - 15-year mortgage scenarios
  - Various extra payment scenarios
  - Investment comparison scenarios with known outcomes

## Testing Infrastructure
- [x] **Set up continuous testing**
  - Add test command to package.json
  - Configure test coverage reporting
  - Set up pre-commit hooks to run tests
  - Document testing procedures in README

## Performance and Precision Tests
- [x] **Test calculation precision**
  - Verify rounding behavior is consistent
  - Test with very large numbers
  - Test calculation performance with extreme inputs
  - Verify no infinite loops in iterative calculations

## Integration Tests
- [x] **Test store integration**
  - Test that computed values update when inputs change
  - Test resetToDefaults functionality
  - Test state persistence (that calculations work after restore)
  - Test validation integration with calculations

## Documentation Tests
- [ ] **Verify mathematical documentation**
  - Cross-reference MATH.md formulas with actual code
  - Add inline comments to complex calculations
  - Document any assumptions or limitations in tests