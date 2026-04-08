# @p2payments/booking

Nuxt 4 module for the booking/scheduling flow. Ships a full-page booking UI and an embeddable iframe variant with custom theming support.

## Pages

| Route | Description |
|-------|-------------|
| `/flows/booking` | Full booking flow — calendar, time slots, optional extras |
| `/flows/booking/embed` | Embeddable iframe variant with custom theme support |

## Components

| Component | Description |
|-----------|-------------|
| `BookingCalendar` | Date picker with availability slots |
| `BookingFlowView` | Orchestrates the multi-step booking flow |

## Composables

| Composable | Description |
|------------|-------------|
| `useCustomTheme` | Applies custom brand colours in embed mode |

## Adding to an app

```json
// package.json
"dependencies": {
  "@p2payments/booking": "workspace:*"
}
```

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2payments/booking']
})
```
