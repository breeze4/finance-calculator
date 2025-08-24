# Finance Calculator - Development Tasks

## Phase 8: Coast FIRE Enhancement - Monthly Expenses Planning

### Store Updates
- [ ] Add monthlyExpenses field to coastFire store (default: 0)
- [ ] Add withdrawalRate field to coastFire store (default: 4%)
- [ ] Add computed property targetFromMonthlyExpenses to calculate total needed from monthly expenses
- [ ] Add computed property monthlyFromTarget to calculate monthly available from target amount
- [ ] Implement bidirectional sync logic between targetRetirementAmount and monthlyExpenses
- [ ] Add validation for withdrawal rate (reasonable range 2-8%)

### UI Implementation
- [ ] Add Monthly Expenses input field to Coast FIRE form with currency formatting
- [ ] Add Withdrawal Rate input field with percentage formatting (default 4%)
- [ ] Add help text explaining the 4% rule and safe withdrawal rates
- [ ] Implement onChange handlers for bidirectional field updates
- [ ] Reorganize form layout to group related fields logically
- [ ] Update existing labels/descriptions for clarity

### Calculation Updates
- [ ] Update isCoastFIREReady to use the active target amount (from either input method)
- [ ] Update additionalSavingsNeeded calculations to work with either input
- [ ] Update chart data generation to use the active target amount
- [ ] Ensure all dependent calculations react properly to either input method
- [ ] Add tracking for which field was last edited to determine precedence

### Testing and Validation
- [ ] Test bidirectional sync (entering monthly expenses updates target, and vice versa)
- [ ] Test edge cases (zero values, very high/low withdrawal rates)
- [ ] Verify calculations are correct for both input methods (4% rule math)
- [ ] Test that last-edited field takes precedence in conflicts
- [ ] Test validation for both new fields
- [ ] Run pnpm build and ensure no TypeScript errors
- [ ] Update/add unit tests for new functionality
- [ ] Test chart updates with new calculation methods

### Documentation
- [ ] Update README with new feature description
- [ ] Update help text/tooltips to explain the relationship between fields
- [ ] Document the bidirectional calculation logic

