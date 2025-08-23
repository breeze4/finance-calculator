# Finance Calculator

A collection of personal finance calculators to help optimize financial decisions and planning.

## Features

### 🔥 Coast FIRE Calculator
Calculate when you can stop saving for retirement and let compound interest work for you. Determine if your current savings will grow enough to meet your retirement goals without additional contributions.

### 🏠 Mortgage Payoff Calculator
Compare strategies for paying off your mortgage early versus investing the extra payments. Features include:
- Calculate time and interest savings from extra payments
- Compare mortgage payoff vs investment returns
- Account for capital gains taxes on investments
- Get personalized recommendations based on your scenario

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management with localStorage persistence
- **Vue Router** - Client-side routing

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

## Project Structure

```
finance-calculator/
├── src/
│   ├── components/       # Reusable Vue components
│   │   └── NavBar.vue    # Navigation component
│   ├── views/            # Page components
│   │   ├── HomePage.vue
│   │   ├── CoastFireCalculator.vue
│   │   └── MortgagePayoffCalculator.vue
│   ├── stores/           # Pinia state management
│   │   ├── coastFire.ts
│   │   └── mortgagePayoff.ts
│   ├── router/           # Vue Router configuration
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles
├── docs/
│   ├── SPEC.md           # Project specification
│   └── TASKS.md          # Development tasks
└── package.json
```

## Usage

### Coast FIRE Calculator

1. Enter your current age and desired retirement age
2. Input your current retirement savings
3. Set your expected annual return rate
4. Define your target retirement amount
5. The calculator will show:
   - Whether you're Coast FIRE ready
   - Future value of your current savings
   - Additional savings needed (if not ready)
   - Age when you'll achieve Coast FIRE

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