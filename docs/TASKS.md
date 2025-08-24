# Finance Calculator - Development Tasks

## Phase 1: Core Application Structure
- [x] Remove the default Vite/Vue boilerplate content from App.vue and create a minimal working app with just a title
- [x] Set up Vue Router by installing dependencies and creating router configuration file
- [x] Create a basic navigation bar component with placeholder links
- [x] Create empty page components for Home, CoastFIRE, and MortgagePayoff calculators
- [x] Wire up router to navigate between the three pages
- [x] Add basic styling for the navigation bar and page layout

## Phase 2: State Management Setup
- [x] Install and configure Pinia for state management
- [x] Create a store module for CoastFIRE calculator state
- [x] Create a store module for Mortgage Payoff calculator state
- [x] Add localStorage persistence plugin to Pinia to save state between sessions
- [x] Test that state persists on page refresh

## Phase 3: Coast FIRE Calculator
- [x] Create basic form structure for Coast FIRE calculator inputs
- [x] Add input fields for current age, retirement age, current savings, expected return rate
- [x] Connect form inputs to Pinia store with two-way binding
- [x] Implement Coast FIRE calculation logic
- [x] Display calculation results below the form
- [x] Add reset to defaults button that clears the stored state
- [x] Style the calculator form and results display

## Phase 4: Mortgage Payoff Calculator - Basic Features
- [x] Create form structure for mortgage calculator inputs
- [x] Add input fields for principal, years left, interest rate, monthly P&I payment
- [x] Add input fields for additional monthly payment and one-time lump sum payment
- [x] Connect all inputs to Pinia store with two-way binding
- [x] Implement mortgage amortization calculation logic without extra payments
- [x] Implement calculation with additional monthly and lump sum payments
- [x] Display comparison of payoff time and interest saved
- [x] Add reset to defaults button for mortgage calculator

## Phase 5: Mortgage Payoff Calculator - Investment Comparison
- [x] Add collapsible section for investment comparison scenario
- [x] Add input fields for investment return rate and tax rate
- [x] Implement investment growth calculation for the same payment amounts
- [x] Calculate after-tax investment returns
- [x] Create comparison display showing mortgage payoff vs investment returns
- [x] Add visualization chart comparing the two scenarios over time

## Phase 6: Polish and User Experience
- [x] Add input validation and error messages for all calculator fields
- [x] Improve responsive design for mobile devices
- [x] Add tooltips or help text to explain calculator inputs
- [x] Create a home page with descriptions of each calculator
- [x] Add loading states and smooth transitions between pages
- [x] Perform final testing of all calculators and state persistence

## Phase 7: Graphing Implementation

### Setup and Infrastructure
- [ ] Install Chart.js and vue-chartjs dependencies (chart.js, vue-chartjs, and necessary plugins)
- [ ] Create src/components/charts/ directory structure
- [ ] Set up TypeScript interfaces for chart data types

### Base Chart Components
- [ ] Create LineChart.vue base component with responsive wrapper and TypeScript props
- [ ] Create AreaChart.vue base component extending LineChart with area fill
- [ ] Create StackedAreaChart.vue component with stacked dataset support

### Coast FIRE Calculator Charts
- [ ] Add chart data computed properties to coastFire store (projection data points)
- [ ] Implement CoastFireProjectionChart.vue with savings growth projection
- [ ] Integrate Coast FIRE chart into CoastFireCalculator.vue below results panel

### Mortgage Calculator - Balance Chart
- [ ] Add balance chart data to mortgagePayoff store (monthly balance calculations)
- [ ] Implement MortgageBalanceChart.vue with principal balance comparison
- [ ] Integrate balance chart into MortgagePayoffCalculator.vue results section

### Mortgage Calculator - Interest Chart
- [ ] Add interest chart data to mortgagePayoff store (cumulative interest)
- [ ] Implement MortgageComparisonChart.vue with stacked principal/interest view

### Investment Comparison Chart
- [ ] Add investment comparison data calculations to store
- [ ] Implement InvestmentComparisonChart.vue with payoff vs investment comparison
- [ ] Integrate investment chart (show only when comparison is enabled)

### Polish and Optimization
- [ ] Add chart interaction features (zoom/pan, touch gestures, legend toggle)
- [ ] Implement export features (download as image, CSV export, print styles)
- [ ] Performance optimization (data decimation, lazy loading, render optimization)

### Testing and Validation
- [ ] Test all charts with edge cases and extreme values
- [ ] Verify responsive behavior on mobile devices
- [ ] Run pnpm build and fix any TypeScript errors
- [ ] Run pnpm test and fix any failing tests