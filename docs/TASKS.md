# Finance Calculator - Development Tasks

This file tracks development tasks for the Finance Calculator application. Completed tasks are archived in `TASKS_ARCHIVE.md`.

## Current Tasks

### Phase 1: Math Library Extraction - Refactor mathematical logic into pure functions

#### Task 1.1: Setup Math Library Structure
- **File(s)**: Create `src/utils/math/` directory and files
- **Purpose**: Establish the foundation for extracting mathematical logic
- **Features/Requirements**:
  - Create directory structure for math library
  - Set up TypeScript interfaces and types
  - Prepare for pure function extraction
- **Implementation**: Create directory and placeholder files
- **Acceptance**: Directory structure exists and builds without errors
- **Status**: [x] Completed

#### Task 1.2: Extract Compound Interest Functions
- **File(s)**: `src/utils/math/compound.ts`
- **Purpose**: Create pure functions for basic compound interest calculations
- **Features/Requirements**:
  - Future value calculation: FV = PV × (1 + r)^t
  - Present value calculation: PV = FV ÷ (1 + r)^t
  - Time calculation using logarithms
  - Fisher equation for real returns
- **Implementation**: Extract formulas from stores into pure functions with comprehensive JSDoc
- **Acceptance**: Functions work correctly and have unit tests
- **Status**: [x] Completed

#### Task 1.3: Extract Coast FIRE Calculations  
- **File(s)**: `src/utils/math/coastFire.ts`
- **Purpose**: Create Coast FIRE specific calculation functions
- **Features/Requirements**:
  - Coast FIRE number calculation
  - Additional savings needed calculation
  - Coast FIRE ready status check
  - Target/expense conversion functions
- **Implementation**: Extract Coast FIRE logic from store into pure functions
- **Acceptance**: All Coast FIRE calculations work as pure functions
- **Status**: [x] Completed

#### Task 1.4: Extract Mortgage Calculations
- **File(s)**: `src/utils/math/mortgage.ts` 
- **Purpose**: Create mortgage amortization and investment calculation functions
- **Features/Requirements**:
  - Amortization schedule generation
  - Payoff time calculation
  - Total interest calculation
  - Investment comparison functions
- **Implementation**: Extract mortgage calculation loops into pure functions
- **Acceptance**: Mortgage calculations work as pure functions with same results
- **Status**: [x] Completed

#### Task 1.5: Extract Validation Functions
- **File(s)**: `src/utils/math/validation.ts`
- **Purpose**: Create input validation functions
- **Features/Requirements**:
  - Numeric range validation
  - Cross-field validation (retirement > current age)
  - Input sanitization
- **Implementation**: Extract validation logic from stores
- **Acceptance**: Validation functions work independently
- **Status**: [x] Completed

#### Task 1.6: Extract Chart Data Generation
- **File(s)**: `src/utils/math/charts.ts`
- **Purpose**: Create chart data generation functions
- **Features/Requirements**:
  - Coast FIRE projection data
  - Mortgage balance chart data
  - Interest comparison chart data
- **Implementation**: Extract chart generation loops into pure functions
- **Acceptance**: Chart data generation works as pure functions
- **Status**: [x] Completed

#### Task 1.7: Create Barrel Export
- **File(s)**: `src/utils/math/index.ts`
- **Purpose**: Provide clean import interface for math library
- **Features/Requirements**:
  - Export all public functions
  - Organize exports by category
- **Implementation**: Create index file with re-exports
- **Acceptance**: Can import functions cleanly from math library
- **Status**: [x] Completed

#### Task 1.8: Create Comprehensive Unit Tests
- **File(s)**: `tests/math/*.test.ts`
- **Purpose**: Ensure all math functions are thoroughly tested
- **Features/Requirements**:
  - Test all edge cases
  - Test mathematical accuracy
  - Test input validation
  - Achieve high test coverage
- **Implementation**: Create test files for each math module
- **Acceptance**: All tests pass with good coverage
- **Status**: [x] Completed

#### Task 1.9: Update Coast FIRE Store
- **File(s)**: `src/stores/coastFire.ts`
- **Purpose**: Refactor store to use math library functions
- **Features/Requirements**:
  - Replace inline calculations with math function calls
  - Keep store focused on state management
  - Maintain same computed property behavior
- **Implementation**: Import math functions and replace calculations
- **Acceptance**: Store behavior unchanged, calculations use math library
- **Status**: [ ] In Progress

#### Task 1.10: Update Mortgage Store
- **File(s)**: `src/stores/mortgagePayoff.ts`
- **Purpose**: Refactor store to use math library functions  
- **Features/Requirements**:
  - Replace inline calculations with math function calls
  - Keep store focused on state management
  - Maintain same computed property behavior
- **Implementation**: Import math functions and replace calculations
- **Acceptance**: Store behavior unchanged, calculations use math library
- **Status**: [x] Completed

#### Task 1.11: Update Store Tests
- **File(s)**: `tests/coastFire.test.ts`, `tests/mortgagePayoff.test.ts`
- **Purpose**: Ensure existing tests work with refactored stores
- **Features/Requirements**:
  - All existing tests continue to pass
  - Update any tests that need to reference math library directly
- **Implementation**: Run tests and fix any issues
- **Acceptance**: All store tests pass
- **Status**: [x] Completed

#### Task 1.12: Final Verification
- **File(s)**: All project files
- **Purpose**: Ensure entire application works correctly after refactoring
- **Features/Requirements**:
  - Build process completes without errors
  - All tests pass
  - Application functions correctly in browser
- **Implementation**: Run `pnpm build` and `pnpm test`
- **Acceptance**: Clean build and test results
- **Status**: [x] Completed

### Phase 2: Mortgage Calculator Tooltip System - Add educational mathematical tooltips

#### Task 2.1: Add Mortgage-Specific Math Formatting Functions
- **File(s)**: `src/utils/mathFormatters.ts`
- **Purpose**: Extend formatting utilities with mortgage-specific functions
- **Features/Requirements**:
  - Add `formatAmortizationSteps(principal, payment, rate, months)` function
  - Add `formatInvestmentCompoundingSteps(lumpSum, monthlyAmount, rate, months)` function  
  - Add `formatTaxCalculationSteps(grossReturn, totalInvested, taxRate)` function
  - Add `formatMonthlyRateSteps(annualRate)` function
  - Comprehensive unit tests for all new formatting functions
- **Implementation**: Extend mathFormatters.ts with mortgage-specific utilities
- **Acceptance**: All new functions have proper TypeScript types and unit test coverage
- **Status**: [ ] Pending

#### Task 2.2: Import MathTooltip Component to Mortgage Calculator
- **File(s)**: `src/views/MortgagePayoffCalculator.vue`
- **Purpose**: Add necessary imports and setup for tooltips in mortgage calculator
- **Features/Requirements**:
  - Import `MathTooltip` component
  - Import `mathFormatters` utilities if needed for local formatting
  - Verify component is properly available for use
- **Implementation**: Add import statements to mortgage calculator component
- **Acceptance**: No compilation errors, component ready for use in template
- **Status**: [ ] Pending

#### Task 2.3: Add tooltipData Computed Property to Mortgage Store
- **File(s)**: `src/stores/mortgagePayoff.ts`
- **Purpose**: Create comprehensive tooltip data structure in the mortgage store
- **Features/Requirements**:
  - Add `tooltipData` computed property to `useMortgagePayoffStore()`
  - Include tooltip data for 8 identified calculations:
    - Monthly Interest Rate, Base/Accelerated Payoff Time, Interest Saved
    - Total Contributions, Investment Gross/Net Return, Strategy Recommendation
  - Each tooltip: title, formula, values, calculation steps, result, explanation
  - Export tooltipData from store return object
- **Implementation**: Add comprehensive tooltipData computed to mortgage store
- **Acceptance**: Store compiles successfully, tooltipData accessible from components
- **Status**: [ ] Pending

#### Task 2.4: Add Tooltips to Basic Mortgage Calculations
- **File(s)**: `src/views/MortgagePayoffCalculator.vue`
- **Purpose**: Add tooltips to core mortgage payoff calculations (non-investment)
- **Features/Requirements**:
  - Add tooltip to "Time to Payoff" in both Current/Extra Payment cards
  - Add tooltip to "Total Interest" in both cards
  - Add tooltip to "Interest Saved" and "Time Saved" in Savings Summary
  - Add tooltip styling classes (`math-tooltip-trigger`) to trigger elements
- **Implementation**: Wrap result values with MathTooltip components
- **Acceptance**: Tooltips appear on hover, show correct mathematical formulas and calculations
- **Status**: [ ] Pending

#### Task 2.5: Add Tooltips to Contribution Calculations
- **File(s)**: `src/views/MortgagePayoffCalculator.vue`
- **Purpose**: Add tooltips to the contribution summary section
- **Features/Requirements**:
  - Add tooltip to "Monthly Contributions" showing total monthly payments calculation
  - Add tooltip to "Total All Contributions" showing sum of monthly and lump sum
  - Ensure tooltips clearly explain how contributions are calculated
- **Implementation**: Add MathTooltip components to contribution summary values
- **Acceptance**: Contribution tooltips show correct formulas and running totals
- **Status**: [ ] Pending

#### Task 2.6: Add Tooltips to Investment Comparison (When Enabled)
- **File(s)**: `src/views/MortgagePayoffCalculator.vue`
- **Purpose**: Add tooltips to investment-related calculations when comparison is shown
- **Features/Requirements**:
  - Add tooltip to "Investment Value" showing compound growth calculation
  - Add tooltip to "Investment Profit" showing gross return minus invested amount
  - Add tooltip to "Taxes Owed" showing capital gains tax calculation
  - Add tooltip to "Net Investment Return" showing after-tax calculation
  - Add tooltip to recommendation section explaining comparison logic
- **Implementation**: Add conditional MathTooltip components to investment section
- **Acceptance**: Investment tooltips only appear when comparison enabled, show complex calculations clearly
- **Status**: [ ] Pending

#### Task 2.7: Add CSS Styling for Tooltip Triggers
- **File(s)**: `src/views/MortgagePayoffCalculator.vue`
- **Purpose**: Apply proper styling to tooltip trigger elements in mortgage calculator
- **Features/Requirements**:
  - Add `math-tooltip-trigger` class styling to MortgagePayoffCalculator.vue
  - Copy styling from Coast FIRE calculator: cursor help, dotted underline, hover effects
  - Ensure responsive behavior for mobile devices
  - Test hover and mobile modal behaviors
- **Implementation**: Add CSS styles for tooltip triggers
- **Acceptance**: Tooltip triggers have proper visual indicators, hover effects work smoothly
- **Status**: [ ] Pending

#### Task 2.8: Test and Verify All Tooltips
- **File(s)**: Application testing
- **Purpose**: Comprehensive testing of all mortgage calculator tooltips
- **Features/Requirements**:
  - Test all tooltips with various input combinations (low/high values, edge cases)
  - Verify mathematical accuracy of all formulas and calculations
  - Test responsive behavior on different screen sizes
  - Test investment comparison tooltips with toggle on/off
  - Verify tooltip positioning and readability
- **Implementation**: Manual testing of complete tooltip system
- **Acceptance**: All tooltips display correct information, formulas match actual calculations, no visual issues
- **Status**: [ ] Pending

#### Task 2.9: Update Unit Tests
- **File(s)**: `tests/mathFormatters.test.ts`, mortgage store tests
- **Purpose**: Add test coverage for new tooltip functionality
- **Features/Requirements**:
  - Add tests for new math formatting functions in `mathFormatters.test.ts`
  - Add tests for tooltipData computed property in mortgage store tests
  - Test edge cases and error conditions
  - Ensure test coverage remains high
- **Implementation**: Extend existing test suites with tooltip-specific tests
- **Acceptance**: All tests pass, coverage maintained at current levels
- **Status**: [ ] Pending

#### Task 2.10: Build and Final Verification
- **File(s)**: All project files
- **Purpose**: Ensure complete implementation works correctly
- **Features/Requirements**:
  - Run `pnpm build` to verify no TypeScript errors
  - Run `pnpm test` to verify all tests pass
  - Manual testing of complete tooltip system
  - Verify mortgage calculator parity with Coast FIRE tooltip quality
- **Implementation**: Final build and testing cycle
- **Acceptance**: Clean build, all tests pass, tooltips provide educational value matching Coast FIRE standard
- **Status**: [ ] Pending

## Task Template

When adding new tasks, use this template:

### Phase X: [Feature Name] - [Brief Description]

#### Task X.Y.Z: [Specific Task Name]
- **File(s)**: List of files to be modified
- **Purpose**: What this task accomplishes
- **Features/Requirements**:
  - Specific requirement 1
  - Specific requirement 2
- **Implementation**: High-level approach
- **Acceptance**: How to verify completion
- **Status**: [x] Completed / [x] Completed

### Notes
- Keep tasks atomic (smallest possible change that doesn't break the app)
- Ensure tasks are incremental (each builds on previous)
- Verify app remains functional after each completed task
- Add unit tests for new logic/functionality
- Run `pnpm build` and `pnpm test` after completion