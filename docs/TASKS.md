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