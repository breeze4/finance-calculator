# Finance Calculator - Development Tasks

## Phase 1: Core Application Structure
- [ ] Remove the default Vite/Vue boilerplate content from App.vue and create a minimal working app with just a title
- [ ] Set up Vue Router by installing dependencies and creating router configuration file
- [ ] Create a basic navigation bar component with placeholder links
- [ ] Create empty page components for Home, CoastFIRE, and MortgagePayoff calculators
- [ ] Wire up router to navigate between the three pages
- [ ] Add basic styling for the navigation bar and page layout

## Phase 2: State Management Setup
- [ ] Install and configure Pinia for state management
- [ ] Create a store module for CoastFIRE calculator state
- [ ] Create a store module for Mortgage Payoff calculator state
- [ ] Add localStorage persistence plugin to Pinia to save state between sessions
- [ ] Test that state persists on page refresh

## Phase 3: Coast FIRE Calculator
- [ ] Create basic form structure for Coast FIRE calculator inputs
- [ ] Add input fields for current age, retirement age, current savings, expected return rate
- [ ] Connect form inputs to Pinia store with two-way binding
- [ ] Implement Coast FIRE calculation logic
- [ ] Display calculation results below the form
- [ ] Add reset to defaults button that clears the stored state
- [ ] Style the calculator form and results display

## Phase 4: Mortgage Payoff Calculator - Basic Features
- [ ] Create form structure for mortgage calculator inputs
- [ ] Add input fields for principal, years left, interest rate, monthly P&I payment
- [ ] Add input fields for additional monthly payment and one-time lump sum payment
- [ ] Connect all inputs to Pinia store with two-way binding
- [ ] Implement mortgage amortization calculation logic without extra payments
- [ ] Implement calculation with additional monthly and lump sum payments
- [ ] Display comparison of payoff time and interest saved
- [ ] Add reset to defaults button for mortgage calculator

## Phase 5: Mortgage Payoff Calculator - Investment Comparison
- [ ] Add collapsible section for investment comparison scenario
- [ ] Add input fields for investment return rate and tax rate
- [ ] Implement investment growth calculation for the same payment amounts
- [ ] Calculate after-tax investment returns
- [ ] Create comparison display showing mortgage payoff vs investment returns
- [ ] Add visualization chart comparing the two scenarios over time

## Phase 6: Polish and User Experience
- [ ] Add input validation and error messages for all calculator fields
- [ ] Improve responsive design for mobile devices
- [ ] Add tooltips or help text to explain calculator inputs
- [ ] Create a home page with descriptions of each calculator
- [ ] Add loading states and smooth transitions between pages
- [ ] Perform final testing of all calculators and state persistence