# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start the Vite development server
- `pnpm build` - Build the application (runs TypeScript checks via vue-tsc, then builds with Vite)
- `pnpm preview` - Preview the production build locally

### Package Management
This project uses pnpm as indicated by the pnpm-lock.yaml file.

## Project Architecture

This is a Vue 3 + TypeScript + Vite finance calculator application. The project structure follows the standard Vite/Vue setup:

- **Framework**: Vue 3 with Composition API using `<script setup>` SFCs
- **Build Tool**: Vite for fast development and optimized production builds
- **Type Checking**: TypeScript with vue-tsc for type safety

## Important Project Context

### Planning Requirements (from docs/SPEC.md)
The application is designed as a collection of personal finance calculators with:
- A main page with navbar for navigation between calculators
- State persistence for calculator inputs between sessions
- Reset to defaults functionality for each calculator

### Planned Calculators
1. **Coast FIRE calculator** (specification pending)
2. **Mortgage payoff calculator** with features for:
   - Mortgage data entry (principal, years left, interest rate, monthly payment)
   - Additional payment scenarios (monthly and lump sum)
   - Interest savings calculations
   - Investment comparison scenarios with tax considerations

## Development Workflow

When implementing new features or making changes:
1. Consult `docs/SPEC.md` before beginning any plan
2. If the feature is not in the spec, add it to the appropriate section
3. Create atomic, incremental tasks that keep the application functional after each change
4. Check off tasks as completed before starting the next one

For task planning:
- Create tasks that are atomic (smallest possible change without breaking the app)
- Ensure tasks are incremental (each builds on the previous)
- Keep the application fully functional after each task completion
- Make sure any logic gets unit tests added for it. Don't add useless tests. Think carefully when adding tests to make sure it is useful to test. Tests should be focused on stateless logic/functional components. 

## Working instructions

Run `pnpm build` after each phase of work to ensure the app builds and also `pnpm test` to ensure tests pass. Fix any errors.

Reference docs/MATH.md for any math questions. Make sure to update formulas in the code and docs/MATH.md when a mistake is found.

