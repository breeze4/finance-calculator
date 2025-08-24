# Vue DevTools Setup

Vue DevTools has been added to the project for better debugging and development experience.

## Features

Vue DevTools provides:
- Component tree inspection
- Component state (props, data, computed) inspection
- Vuex/Pinia store inspection and time-travel debugging
- Event tracking
- Performance profiling
- Router information

## How to Use

### Browser Extension Method (Recommended)

1. Install the Vue DevTools browser extension:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

2. Open your app in development mode (`pnpm dev`)

3. Open browser DevTools (F12)

4. You'll see a new "Vue" tab in the DevTools

### Standalone App Method

The project includes @vue/devtools which will automatically connect in development mode.

When you run `pnpm dev`, you'll see in the console:
```
Vue DevTools enabled for development
```

## Using DevTools

### Inspect Components
- Navigate to the Components tab
- Click on any component in the tree to inspect its:
  - Props
  - Data
  - Computed properties
  - Refs

### Inspect Pinia Stores
- Navigate to the Pinia tab
- View all stores (mortgagePayoff, coastFire)
- See current state values
- Track state changes over time
- Use time-travel debugging

### Track Events
- Navigate to the Timeline tab
- See all events being fired
- Track performance metrics

### Router Information
- Navigate to the Routes tab
- See all registered routes
- View current route information

## Tips

1. **State Inspection**: Click on any store in Pinia tab to see all reactive values
2. **Time Travel**: Use the timeline to go back to previous states
3. **Component Selection**: Click the target icon to select components directly from the page
4. **Performance**: Use the Performance tab to identify bottlenecks

## Troubleshooting

If DevTools doesn't appear:
1. Make sure you're running in development mode (`pnpm dev`)
2. Try hard refreshing the page (Ctrl+Shift+R)
3. Check that the browser extension is enabled
4. Look for the console message "Vue DevTools enabled for development"