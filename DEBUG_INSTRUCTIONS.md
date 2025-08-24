# Debug Function Instructions

## If you get "store.debugState is not a function" error:

This means the browser has an old version of the store cached. To fix:

1. **Hard refresh the browser page**:
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Or restart the dev server**:
   - Stop the dev server: `Ctrl + C` in terminal
   - Start it again: `pnpm dev`

## How to use the debug function:

1. Open the Mortgage Payoff Calculator in your browser
2. Set up any test scenario with your desired values
3. Click the "Debug State (Console)" button
4. Open browser DevTools console (`F12` or right-click → Inspect → Console)
5. You'll see:
   - The current state as JSON
   - Generated test code that you can copy

The test code is automatically copied to your clipboard and can be pasted directly into the test file.

## Example output:

```javascript
// Test case for mortgage payoff calculator
it('should calculate mortgage payoff correctly', () => {
  const store = useMortgagePayoffStore()
  
  // Set input values
  store.principal = 300000
  store.yearsLeft = 25
  // ... etc
  
  // Verify computed values
  expect(store.monthlyInterestRate).toBeCloseTo(0.00375, 6)
  // ... etc
})
```

This makes it easy to capture specific scenarios and create regression tests!