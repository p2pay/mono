# @p2pay/robosats

Nuxt 4 module for the [RoboSats](https://robosats.com) P2P Bitcoin rail. Handles robot identity generation (token, PGP, Nostr keypair), order book queries, and offer creation. All coordinator communication goes through Tor via SOCKS5h.

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/rails/robosats/limits` | Fetch order book limits for the coordinator |
| `POST` | `/api/rails/robosats/robot` | Create or fetch a robot identity |
| `GET` | `/api/rails/robosats/order` | Get the status of an active order |
| `POST` | `/api/rails/robosats/offer` | Create a new offer |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Coordinator onion base URL |

A running Tor daemon is required for the server-side handlers to reach the coordinator.

## Adding to an app

```json
// package.json
"dependencies": {
  "@p2pay/robosats": "workspace:*"
}
```

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2pay/robosats']
})
```
