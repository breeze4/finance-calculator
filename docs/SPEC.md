# Finance calculator

Collection of tools to do various projections and comparisons to optimize personal finance

## App structure

Main page with a simple navbar that allows going between calculators



## Calculators

Each of these will be on a separate page and should store its last entered state so that next time it will be pre-populated with the last used values.

There should also be a "reset to defaults" button for each to go back to the defaults.

### Coast FIRE calculator

### Mortgage payoff calculator

Features:
* Enter current mortgage data (principal, years left, interest rate, base monthly payment of Principal + Interest)
* Enter monthly additional principal payment
* Enter one-time lump sum principal payment
* See numbers comparing how much faster the loan will be paid off (in years and months), how much interest is saved
* Optionally enter an investment scenario of the same monthly and lump sum payments and invest in X% yield accounts, that calculates estimated return and taxes (have an input for the withdrawl tax rate, default to 20% for long term cap gains). The investment should be calculated through the time it takes to pay off the mortgage with the faster time due to the monthly and lump-sum payments.
* Compare the mortgage payoff with the investments to compare which yields more returns over time

## Graphs

### Overview
Interactive, responsive graphs to visualize financial data and projections for both calculators. Using Chart.js with vue-chartjs wrapper for Vue 3 compatibility.

### Graph Library
- **Chart.js** with **vue-chartjs** wrapper
- Lightweight, performant, responsive
- TypeScript support
- Supports line, area, and stacked charts

### Graph Components Structure

#### Shared Components (src/components/charts/)
- LineChart.vue - Base line chart component
- AreaChart.vue - Base area chart component
- StackedAreaChart.vue - Stacked area chart component
- ChartTooltip.vue - Custom tooltip component

#### Calculator-Specific Components
- CoastFireProjectionChart.vue - Savings growth projection
- MortgageBalanceChart.vue - Principal balance over time
- MortgageComparisonChart.vue - Compare payoff strategies
- InvestmentComparisonChart.vue - Investment vs mortgage payoff

### Coast FIRE Calculator Graphs

#### Savings Growth Projection
- Line chart with filled area
- X-axis: Age (current to retirement)
- Y-axis: Savings value ($)
- Shows: Current savings projection, target amount, Coast FIRE threshold
- Interactive hover for exact values

#### Required Savings by Age
- Line chart showing required savings at different starting ages
- Interactive what-if scenarios

### Mortgage Payoff Calculator Graphs

#### Principal Balance Over Time
- Multi-line chart comparing standard vs accelerated payoff
- Shaded area shows savings
- Milestone markers (50%, 75% paid)

#### Cumulative Interest Comparison
- Stacked area chart
- Shows principal and interest payments over time
- Compares standard vs accelerated schedules

#### Investment vs Payoff Comparison
- Line chart comparing mortgage payoff value vs investment growth
- Shows after-tax returns
- Highlights crossover points

### Technical Features

#### Data Management
- Computed properties in Pinia stores
- Reactive updates with 300ms debounce
- Cached calculations

#### Responsive Design
- Auto-resize with container
- Touch-friendly mobile interactions
- Maintained aspect ratios

#### Performance
- Max 100 data points per series
- Data decimation for long periods
- Lazy loading when visible

#### Accessibility
- Alternative data table views
- ARIA labels
- Keyboard navigation
- High contrast mode

#### Export Features
- Download as PNG/SVG
- Export data as CSV
- Print-friendly view

### Styling
- Primary: Blue (#409eff)
- Comparison: Green (#27ae60)
- Warning: Red (#e74c3c)
- Neutral: Gray (#95a5a6)
- Subtle grid lines (#f0f0f0) 