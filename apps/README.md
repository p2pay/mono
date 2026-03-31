# apps

Standalone Nuxt applications live under `apps/*`.

An app is the assembly point: it declares which rails, flows, and services to load in `nuxt.config.js` and adds them as workspace dependencies in `package.json`. Apps contain no business logic — everything is delegated to modules.

## Available apps

| Package | Description |
|---------|-------------|
| `@p2pay/mono-app` (`apps/mono`) | Development app — loads all workspace modules for local testing |
| `@p2pay/market` (`apps/market`) | KYC-free Bitcoin price aggregator — buy/sell offers from Bisq, RoboSats, Peach |

## Running an app

```bash
# from mono/ root
pnpm dev           # apps/mono
pnpm dev:market    # apps/market

# or directly
pnpm -C apps/mono dev
pnpm -C apps/market dev
```
