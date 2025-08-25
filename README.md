# Finance Calculator

A collection of personal finance calculators to help optimize financial decisions and planning.

[![Netlify Status](https://api.netlify.com/api/v1/badges/ca64d788-a5b0-4c7d-ba3d-a79b88362fe1/deploy-status)](https://breeze-finance-calculator.netlify.app)

**🌐 Live Demo:** [https://breeze-finance-calculator.netlify.app/mortgage-payoff](https://breeze-finance-calculator.netlify.app/mortgage-payoff)

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

## Deployment

This application is automatically deployed to Netlify with continuous deployment from the main branch. Every push to the main branch triggers a new build and deployment.

## Getting Started

### Dev

```bash
# Install dependencies
pnpm install

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

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]