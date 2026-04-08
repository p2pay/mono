# @p2payments/template

Reference rail — the minimal scaffold for a new payment rail module. Copy this folder to create a new rail.

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/rails/template` | Template page |
| `GET` | `/api/rails/template` | Template API endpoint |

## Creating a new rail from this template

1. Copy `rails/template` to `rails/<name>`
2. In `package.json`: set `"name": "@p2payments/<name>"`
3. In `module.js`: update `meta.name`, `configKey`, and `defaults.routeBase`
4. Replace handler and page content with the new rail's logic
5. In the host app's `package.json`: add `"@p2payments/<name>": "workspace:*"`
6. In the host app's `nuxt.config.js`: add `'@p2payments/<name>'` to `modules`
7. Run `pnpm install`
