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