# @p2pay/robosats

Dual-mode module for the [RoboSats](https://robosats.com) P2P Bitcoin rail. Handles robot identity generation (token, PGP, Nostr keypair), order book queries, and offer creation.

All coordinator communication is routed through `@p2pay/tor`, which this module installs automatically. No direct Tor/SOCKS dependency is required in the consuming app.

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/rails/robosats/limits` | Fetch order book limits for the coordinator |
| `POST` | `/api/rails/robosats/robot` | Create or fetch a robot identity |
| `GET` | `/api/rails/robosats/order` | Get the status of an active order |
| `POST` | `/api/rails/robosats/offer` | Create a new offer |

The tor proxy is available at `/api/tor/**` for client-side use.

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Coordinator onion base URL |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret for the `@p2pay/tor` proxy |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

A running Tor daemon is required on the server.

## Module mode (Nuxt app)

```json
// package.json
"dependencies": {
  "@p2pay/robosats": "workspace:*"
}
```

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2pay/robosats'],
  p2payRobosatsRail: {
    enabled: true,
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL
  }
})
```

`@p2pay/tor` is installed automatically — no need to add it separately.

## Standalone mode (Nitro)

```bash
cp .env.example .env
pnpm dev
pnpm build
pnpm start
```

Standalone exposes both the RoboSats API and the tor proxy on the same server.
