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
├── components/charts/     # Reusable chart components
├── stores/                # Pinia stores (coastFire.ts, mortgagePayoff.ts)
├── views/                 # Page components (calculators)
├── types/                 # TypeScript interfaces
└── router/               # Route definitions
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
- Store calculation logic (96 tests)
- Edge cases (zero values, high rates)
- Validation logic

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

## Future Enhancements
- Chart zoom/pan interactions
- CSV/PNG export functionality
- Additional calculators (retirement withdrawal, investment allocation)
- Mobile app version