# rails

Payment rail modules live under `rails/*`.

Each rail is a Nuxt 4 module (`defineNuxtModule`) that injects pages, composables, and API server handlers into the host app. Rails are stateless on their own — they activate only when listed in the host app's `nuxt.config.js`.

## Available rails

| Package | Page | API | Description |
|---------|------|-----|-------------|
| `@p2pay/template` | `/rails/template` | `/api/rails/template` | Reference rail — copy this to scaffold a new integration |
| `@p2pay/peach` | `/rails/peach` | `/api/rails/peach/*` | [Peach](https://peachbitcoin.com) P2P Bitcoin rail |
| `@p2pay/robosats` | `/rails/robosats` | `/api/rails/robosats/*` | [RoboSats](https://robosats.com) P2P Bitcoin rail via Tor |

## Adding a new rail

1. Copy `rails/template` to `rails/<name>`
2. Rename the package in `package.json` to `@p2pay/<name>`
3. Update `module.js` defaults (`routeBase`, `configKey`)
4. Add `"@p2pay/<name>": "workspace:*"` to the app's `package.json`
5. Add `'@p2pay/<name>'` to the app's `nuxt.config.js` modules array
6. Run `pnpm install`
