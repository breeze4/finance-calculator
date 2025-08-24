# Finance Calculator

A collection of personal finance calculators to help optimize financial decisions and planning.

## Features

### 🔥 Coast FIRE Calculator
Calculate when you can stop saving for retirement and let compound interest work for you. Features include:
- **Flexible Planning**: Enter either your target retirement amount OR monthly expenses in retirement
- **4% Rule Integration**: Automatically calculates between total target and monthly spending using safe withdrawal rates
- **Bidirectional Sync**: Change either field and the other updates automatically
- **Visual Projections**: Interactive charts showing savings growth over time
- **Coast FIRE Analysis**: Determine if your current savings will grow enough to meet retirement goals

### 🏠 Mortgage Payoff Calculator
Compare strategies for paying off your mortgage early versus investing the extra payments. Features include:
- **Payoff Analysis**: Calculate time and interest savings from extra payments
- **Investment Comparison**: Compare mortgage payoff vs investment returns
- **Tax Considerations**: Account for capital gains taxes on investments
- **Interactive Charts**: Visualize principal balance, interest, and investment growth over time
- **Smart Recommendations**: Get personalized advice based on your scenario

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management with localStorage persistence
- **Vue Router** - Client-side routing
- **Chart.js** - Interactive financial visualization charts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

### Testing

The project includes comprehensive unit tests for all mathematical calculations:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

**Test Coverage:** 104 tests with comprehensive coverage:
- Coast FIRE calculator: 49 tests (core calculations, monthly expenses feature, bidirectional sync, edge cases, validation)
- Mortgage payoff calculator: 55 tests (amortization algorithm, investment comparisons, performance testing, store integration)
- Mathematical edge cases, input validation, and performance testing
- Full test coverage for bidirectional expense/target calculations and 4% rule implementation

### Testing Infrastructure

- **Automated Testing**: Pre-commit hooks automatically run tests before each commit
- **Coverage Reporting**: Use `pnpm test:coverage` to generate detailed coverage reports
- **Continuous Testing**: Tests run in watch mode during development with `pnpm test --watch`
- **Performance Testing**: Tests include performance benchmarks for large calculations
- **Mathematical Verification**: All formulas are tested against manual calculations

## Project Structure

```
finance-calculator/
├── src/
│   ├── components/       # Reusable Vue components
│   │   ├── charts/       # Chart components (LineChart, AreaChart, etc.)
│   │   └── NavBar.vue    # Navigation component
│   ├── views/            # Page components
│   │   ├── HomePage.vue
│   │   ├── CoastFireCalculator.vue
│   │   └── MortgagePayoffCalculator.vue
│   ├── stores/           # Pinia state management
│   │   ├── coastFire.ts  # Coast FIRE logic & chart data
│   │   └── mortgagePayoff.ts # Mortgage analysis & chart data
│   ├── types/            # TypeScript interfaces
│   ├── router/           # Vue Router configuration
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles
├── docs/
│   ├── SPEC.md           # Technical specification
│   └── TASKS.md          # Development task tracking
└── package.json
```

## Usage

### Coast FIRE Calculator

**Two Ways to Plan Your Retirement:**

**Option 1: Target Amount Approach**
1. Enter your current age and desired retirement age
2. Input your current retirement savings and expected annual return rate
3. Set your target retirement amount (e.g., $1,000,000)
4. View results and projections

**Option 2: Monthly Expenses Approach** 
1. Enter basic info (age, savings, return rate)
2. Input your desired monthly expenses in retirement (e.g., $4,000/month)
3. Set your safe withdrawal rate (defaults to 4% rule)
4. The target retirement amount is calculated automatically

**The calculator will show:**
- Whether you're Coast FIRE ready now
- Future value of your current savings
- Additional savings needed (if not ready)
- Age when you'll achieve Coast FIRE
- Interactive chart showing savings growth over time
- Monthly spending power based on your target

**Smart Sync:** Change either the target amount or monthly expenses, and the other field updates automatically using your withdrawal rate.

### Mortgage Payoff Calculator

1. Enter your current mortgage details:
   - Principal balance
   - Years remaining
   - Interest rate
   - Monthly payment
2. Add any extra payments:
   - Additional monthly payment
   - One-time lump sum
3. Optionally compare with investment scenario:
   - Expected investment return rate
   - Capital gains tax rate
4. View results:
   - Time and interest savings
   - Investment comparison
   - Personalized recommendation

## State Persistence

All calculator inputs are automatically saved to browser localStorage and will persist between sessions. Use the "Reset to Defaults" button to clear saved values.

## Development

For development guidelines and task tracking, see:
- `docs/SPEC.md` - Project specification
- `docs/TASKS.md` - Development task list
- `CLAUDE.md` - AI assistant instructions

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]