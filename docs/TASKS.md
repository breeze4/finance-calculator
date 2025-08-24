# Finance Calculator - Development Tasks

## Phase 8: Coast FIRE Enhancement - Monthly Expenses Planning

### Store Updates
- [x] Add monthlyExpenses field to coastFire store (default: 0)
- [x] Add withdrawalRate field to coastFire store (default: 4%)
- [x] Add computed property targetFromMonthlyExpenses to calculate total needed from monthly expenses
- [x] Add computed property monthlyFromTarget to calculate monthly available from target amount
- [x] Implement bidirectional sync logic between targetRetirementAmount and monthlyExpenses
- [x] Add validation for withdrawal rate (reasonable range 2-8%)

### UI Implementation
- [x] Add Monthly Expenses input field to Coast FIRE form with currency formatting
- [x] Add Withdrawal Rate input field with percentage formatting (default 4%)
- [x] Add help text explaining the 4% rule and safe withdrawal rates
- [x] Implement onChange handlers for bidirectional field updates
- [x] Reorganize form layout to group related fields logically
- [x] Update existing labels/descriptions for clarity

### Calculation Updates
- [x] Update isCoastFIREReady to use the active target amount (from either input method)
- [x] Update additionalSavingsNeeded calculations to work with either input
- [x] Update chart data generation to use the active target amount
- [x] Ensure all dependent calculations react properly to either input method
- [x] Add tracking for which field was last edited to determine precedence

### Testing and Validation
- [x] Test bidirectional sync (entering monthly expenses updates target, and vice versa)
- [x] Test edge cases (zero values, very high/low withdrawal rates)
- [x] Verify calculations are correct for both input methods (4% rule math)
- [x] Test that last-edited field takes precedence in conflicts
- [x] Test validation for both new fields
- [x] Run pnpm build and ensure no TypeScript errors
- [x] Update/add unit tests for new functionality
- [x] Test chart updates with new calculation methods

### Documentation
- [ ] Update README with new feature description
- [ ] Update help text/tooltips to explain the relationship between fields
- [ ] Document the bidirectional calculation logic

