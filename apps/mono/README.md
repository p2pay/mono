# @p2pay/mono-app

Development app for the p2pay monorepo. Loads all workspace rails, flows, and services for local integration testing.

This app contains no product logic — it exists solely as an assembly point.

## Quick start

```bash
pnpm install   # from mono/ root
pnpm dev       # runs apps/mono
```

## Loaded modules

| Module | Page | API |
|--------|------|-----|
| `@p2pay/template` | `/rails/template` | `/api/rails/template` |
| `@p2pay/peach` | `/rails/peach` | `/api/rails/peach/*` |
| `@p2pay/robosats` | `/rails/robosats` | `/api/rails/robosats/*` |
| `@p2pay/booking` | `/flows/booking`, `/flows/booking/embed` | — |

## Environment variables

Set the variables required by each loaded module. See the root `README.md` or each module's own `README.md` for the full list.
