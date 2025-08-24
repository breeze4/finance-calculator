# Finance Calculator - Technical Specification

Vue 3 + TypeScript personal finance calculator app with Coast FIRE and mortgage analysis tools.

## Architecture

### Tech Stack
- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build**: Vite
- **Type Safety**: TypeScript with vue-tsc
- **State**: Pinia with localStorage persistence
- **Routing**: vue-router
- **Charts**: Chart.js with vue-chartjs wrapper

### Project Structure
```
src/
├── components/
│   ├── charts/           # Reusable chart components (LineChart, AreaChart)
│   └── MathTooltip.vue   # Mathematical tooltip component ✅
├── utils/
│   └── mathFormatters.ts # Mathematical formatting utilities ✅
├── stores/               # Pinia stores (coastFire.ts, mortgagePayoff.ts)
├── views/                # Page components (calculators)
├── types/                # TypeScript interfaces
└── router/              # Route definitions
```

## Calculators

### Coast FIRE Calculator
**Purpose**: Calculate when you can stop saving and let compound interest reach retirement goal.

**Store**: `useCoastFireStore()`
- Inputs: 
  - currentAge, retirementAge, currentSavings, expectedReturnRate
  - targetRetirementAmount (total amount needed)
  - monthlyExpenses (desired monthly spending in retirement)
  - yearlyExpenses (desired yearly spending in retirement)
  - withdrawalRate (safe withdrawal rate, default 4%)
  - inflationRate (expected inflation rate, default 3%)
  - useRealReturns (toggle: true for inflation-adjusted returns, false for nominal)
- Computeds: 
  - `futureValueOfCurrentSavings`: Projection at retirement age
  - `isCoastFIREReady`: Boolean if current savings sufficient
  - `additionalSavingsNeeded`: Amount needed now to coast
  - `coastFIREAge`: Age when coast-ready with current savings
  - `projectionChartData`: Chart.js dataset for visualization
  - `targetFromMonthlyExpenses`: Total needed based on monthly expenses
  - `monthlyFromTarget`: Monthly available based on total target

**Calculations**:
```typescript
// Basic compound interest
FV = PV * (1 + r)^n  // Future value
PV = FV / (1 + r)^n  // Present value needed

// Inflation adjustment
realReturnRate = (1 + nominalReturn) / (1 + inflation) - 1  // Fisher equation
inflationAdjustedTarget = targetAmount * (1 + inflation)^yearsToRetirement  // Future value in today's dollars

// Expense-based planning:
targetAmount = (monthlyExpenses * 12) / (withdrawalRate / 100)
monthlyExpenses = (targetAmount * withdrawalRate / 100) / 12
```

**Bidirectional Input Sync**:
- When user enters `monthlyExpenses`: Calculate and update `targetRetirementAmount`
- When user enters `targetRetirementAmount`: Calculate and update `monthlyExpenses`
- Either field can drive the calculation, last edited field takes precedence

**Mathematical Tooltips System** ✅ IMPLEMENTED:
All calculated fields display educational mathematical tooltips showing:
- The exact formula used with proper mathematical notation
- Current input values substituted with clean formatting
- Step-by-step calculation breakdown with intermediate results
- Educational explanations of financial concepts

**Tooltip Implementation** ✅ COMPLETED:
- **Component**: `MathTooltip.vue` - Reusable Vue component with professional styling
- **Utilities**: `mathFormatters.ts` - 13+ formatting functions for mathematical expressions
- **Store Integration**: Dynamic content based on current store values with computed `tooltipData`
- **Responsive Design**: Desktop hover behavior, mobile modal display
- **Mathematical Notation**: HTML superscripts, monospace fonts, proper alignment
- **Performance**: Pure CSS hover with smooth animations, no JavaScript event listeners
- **Accessibility**: Help cursor indicators, clear visual feedback

**Active Mathematical Tooltips** ✅ IMPLEMENTED:

**Result Fields with Educational Tooltips**:
1. **Years to Retirement** ✅
   - Formula: `retirementAge - currentAge`
   - Example: "65 - 30 = 35 years"
   - Explanation: Time available for compound growth

2. **Real Return Rate** ✅ (when inflation > 0)
   - Formula: Fisher equation `(1 + nominal) ÷ (1 + inflation) - 1`
   - Example: "(1 + 7.0%) ÷ (1 + 3.0%) - 1 = 1.068 - 1 = 3.9%"
   - Educational: Explains why 7% - 3% ≠ 4% (addresses user's original question)

3. **Future Value of Current Savings** ✅
   - Formula: `FV = PV × (1 + r)^t`
   - Example: "$50,000 × (1 + 4.9%)^35 = $50,000 × 1.693 = $384,659"
   - Clean formatting: Rates to 1 decimal, multipliers to 3 decimals, amounts to whole dollars

4. **Coast FIRE Number at Current Age** ✅
   - Formula: `Coast FIRE Number = Target ÷ (1 + r)^t`
   - Example: "$2,400,000 ÷ (1 + 4.9%)^35 = $2,400,000 ÷ 1.693 = $1,417,781"
   - Explanation: Present value calculation - exact amount needed today

5. **Additional Savings Needed Now** ✅
   - Formula: `Additional Needed = Coast FIRE Number - Current Savings`
   - Example: "$1,417,781 - $50,000 = $1,367,781"
   - Educational: Gap analysis for immediate Coast FIRE readiness

6. **Coast FIRE Ready Status** ✅
   - Logic: Comparison between future value and target
   - Example: "Future Value: $384,659 vs Target: $2,400,000 = Not Ready"
   - Clear explanation of ready/not ready determination

7. **Monthly Spending Available** ✅ (when shown)
   - Formula: `Monthly = (Target × Withdrawal Rate) ÷ 12`
   - Example: "($1,000,000 × 4.0%) ÷ 12 = $40,000 ÷ 12 = $3,333"
   - Educational: Safe withdrawal rate (4% rule) application

**Technical Features** ✅ IMPLEMENTED:
- **Smart Value Detection**: Auto-formats currencies, percentages, ages based on field names
- **Precision Control**: All percentages rounded to 1 decimal place maximum
- **Template System**: Dynamic placeholder substitution with `{fieldName}` syntax  
- **Mathematical Accuracy**: All formulas verified against `docs/MATH.md`
- **Test Coverage**: 25+ unit tests for formatting utilities
- **Performance**: Lightweight, cached computations, smooth animations

### Mortgage Payoff Calculator
**Purpose**: Compare accelerated payoff vs investment strategies.

**Store**: `useMortgagePayoffStore()`
- Inputs: principal, yearsLeft, interestRate, monthlyPayment, additionalMonthlyPayment, lumpSumPayment
- Investment inputs: investmentReturnRate, investmentTaxRate
- Computeds:
  - `basePayoffMonths` / `acceleratedPayoffMonths`: Time to payoff
  - `baseTotalInterest` / `acceleratedTotalInterest`: Total interest paid
  - `interestSaved`: Difference in interest
  - `investmentNetReturn`: After-tax investment value
  - `betterStrategy`: 'payoff' or 'invest' recommendation

**Amortization Logic**:
```typescript
// Monthly loop until balance = 0
interestCharge = balance * monthlyRate
principalPayment = payment - interestCharge
balance -= principalPayment
```

## Chart Implementation

### Base Components
All in `src/components/charts/`:

**LineChart.vue**
- Wraps Chart.js Line component
- Default currency formatting for tooltips
- Responsive container handling

**AreaChart.vue**
- Extends LineChart with `fill: true`
- Gradient/solid fill options
- Used for projection visualizations

**StackedAreaChart.vue**
- Sets `fill: '-1'` for stacking
- Used for cumulative comparisons

### Chart Data Generation

Data computed in stores, structured as:
```typescript
{
  labels: string[],  // X-axis labels
  datasets: [{
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string,
    fill: boolean | string
  }]
}
```

### Implemented Charts

**Coast FIRE**:
- `projectionChartData`: Savings growth from current age to retirement
- `requiredSavingsByAge`: Amount needed at different starting ages

**Mortgage**:
- `balanceChartData`: Principal balance over time (standard vs accelerated)
- `interestComparisonChartData`: Cumulative interest comparison
- `investmentComparisonChartData`: Mortgage equity vs investment value

## State Persistence

Using pinia-plugin-persistedstate:
```typescript
persist: {
  key: 'coastFire',  // or 'mortgagePayoff'
  storage: localStorage
}
```

Stores maintain user inputs between sessions with reset functionality.

## Validation

Input validation in stores:
- Age ranges: 18-100
- Return rates: 0-30%
- Negative value checks
- Retirement > current age validation

Error display via computed `errors` object in stores.

## Build & Testing

**Commands**:
- `pnpm dev`: Vite dev server
- `pnpm build`: TypeScript check + production build
- `pnpm test`: Vitest unit tests

**Test Coverage**:
- Store calculation logic (89 tests)
- Mathematical formatting utilities (25 tests)  
- Mortgage payoff calculations (57 tests)
- Edge cases (zero values, high rates)
- Validation logic
- **Total**: 171 tests passing ✅

## Color Palette
- Primary: `#409eff` (blue)
- Success: `#27ae60` (green)  
- Error: `#e74c3c` (red)
- Neutral: `#95a5a6` (gray)
- Grid: `#f0f0f0` (light gray)

## Performance Considerations
- Chart data limited to reasonable time periods
- Debounced recalculations (300ms considered, not yet implemented)
- Lazy loading for charts (planned)
- Max 100 data points per series (planned)

## Math Library Architecture

### Purpose
Extract all pure mathematical logic from Vue stores into a stateless functional library that can be thoroughly unit tested. This separation improves:
- **Testability**: Pure functions with predictable inputs/outputs
- **Reusability**: Math functions can be used across multiple components
- **Maintainability**: Clear separation between business logic and UI state
- **Reliability**: Comprehensive unit test coverage of core calculations

### Structure
```
src/utils/math/
├── coastFire.ts          # Coast FIRE calculations
├── mortgage.ts           # Mortgage amortization & investment calculations  
├── compound.ts           # Compound interest utilities
├── validation.ts         # Input validation functions
├── charts.ts            # Chart data generation utilities
└── index.ts             # Barrel export for clean imports
```

### Design Principles
1. **Pure Functions**: No side effects, deterministic outputs
2. **Single Responsibility**: Each function has one clear purpose
3. **Input Validation**: Functions handle edge cases gracefully
4. **Type Safety**: Strong TypeScript interfaces for all parameters
5. **Documentation**: JSDoc comments explaining formulas and usage
6. **Test Coverage**: Each function has comprehensive unit tests

### API Design

**Coast FIRE Functions:**
```typescript
// Core compound interest calculations
export function calculateFutureValue(principal: number, rate: number, years: number): number
export function calculatePresentValue(futureValue: number, rate: number, years: number): number
export function calculateTimeToTarget(principal: number, target: number, rate: number): number

// Coast FIRE specific calculations  
export function calculateCoastFireNumber(target: number, rate: number, years: number): number
export function calculateAdditionalSavingsNeeded(current: number, target: number, rate: number, years: number): number
export function isCoastFireReady(current: number, target: number, rate: number, years: number): boolean

// Fisher equation for inflation adjustment
export function calculateRealReturnRate(nominalRate: number, inflationRate: number): number
export function adjustTargetForInflation(target: number, inflationRate: number, years: number): number

// Expense-based calculations
export function calculateTargetFromExpenses(annualExpenses: number, withdrawalRate: number): number
export function calculateExpensesFromTarget(target: number, withdrawalRate: number): number
```

**Mortgage Functions:**
```typescript
// Basic mortgage calculations
export function calculateMonthlyRate(annualRate: number): number
export function calculatePayoffTime(principal: number, monthlyPayment: number, rate: number, lumpSum?: number): number
export function calculateTotalInterest(principal: number, monthlyPayment: number, rate: number, lumpSum?: number): number

// Investment comparison
export function calculateInvestmentValue(lumpSum: number, monthlyAmount: number, rate: number, months: number): number
export function calculateAfterTaxReturn(grossReturn: number, taxRate: number, totalInvested: number): number
export function determineBetterStrategy(interestSaved: number, investmentNetBenefit: number): 'payoff' | 'invest'

// Amortization schedule generation
export interface PaymentDetail {
  month: number;
  balance: number;
  interestPayment: number;
  principalPayment: number;
}
export function generateAmortizationSchedule(principal: number, rate: number, payment: number): PaymentDetail[]
```

**Chart Data Functions:**
```typescript
export function generateProjectionChartData(currentSavings: number, rate: number, years: number, target: number): ChartData
export function generateBalanceChartData(principal: number, basePayment: number, extraPayment: number, rate: number): ChartData
export function generateInterestComparisonData(principal: number, basePayment: number, extraPayment: number, rate: number): ChartData
```

**Validation Functions:**
```typescript
export function validateCoastFireInputs(inputs: CoastFireInputs): ValidationResult
export function validateMortgageInputs(inputs: MortgageInputs): ValidationResult
export function validateNumericRange(value: number, min: number, max: number, fieldName: string): string | null
```

### Migration Strategy
1. Create math library with comprehensive tests
2. Update stores to use math functions instead of inline calculations
3. Ensure all existing tests continue to pass
4. Add additional tests for edge cases now that math is isolated
5. Refactor tooltip calculations to use math library functions

### Benefits After Implementation
- **Reduced Store Complexity**: Stores focus on state management, not calculations
- **Improved Test Coverage**: Math logic tested in isolation with better edge case coverage
- **Better Performance**: Pure functions can be memoized if needed
- **Enhanced Reliability**: Mathematical formulas centralized and thoroughly validated
- **Future Extensibility**: Easy to add new calculators using existing math functions

## Future Enhancements
- Chart zoom/pan interactions
- CSV/PNG export functionality
- Additional calculators (retirement withdrawal, investment allocation)
- Mobile app version