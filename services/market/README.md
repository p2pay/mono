# @p2payments/market

KYC-free Bitcoin offer aggregator. Fetches live buy and sell offers from Bisq, RoboSats, and Peach Bitcoin, normalises them into a single price list, and exposes them over a unified REST API.

The primary use case is price discovery for outbound payment flows: given a fiat currency and a payment method, find the platform and price at which to publish a buy offer so that a buyer pays with fiat and receives BTC — which is then forwarded automatically to the merchant via the underlying P2P rail.

Bisq and RoboSats are reached via a local Tor daemon (SOCKS5h). Peach Bitcoin is fetched over clearnet. Ships in dual mode: standalone Nitro app or Nuxt module.

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/market/currencies` | List of supported fiat currency codes |
| `GET` | `/api/market/platforms` | List of supported P2P platforms |
| `GET` | `/api/market/offers/:currency/buy` | Aggregated buy offers across all platforms, sorted by highest price |
| `GET` | `/api/market/offers/:currency/buy/bisq` | Buy offers from Bisq only |
| `GET` | `/api/market/offers/:currency/buy/robosats` | Buy offers from RoboSats only |
| `GET` | `/api/market/offers/:currency/buy/peach` | Buy offers from Peach Bitcoin only |
| `GET` | `/api/market/offers/:currency/sell` | Aggregated sell offers across all platforms, sorted by lowest price |
| `GET` | `/api/market/offers/:currency/sell/bisq` | Sell offers from Bisq only |
| `GET` | `/api/market/offers/:currency/sell/robosats` | Sell offers from RoboSats only |
| `GET` | `/api/market/offers/:currency/sell/peach` | Sell offers from Peach Bitcoin only |
| `ALL` | `/api/market/tor-proxy/**` | Internal authenticated Tor proxy (used by Bisq and RoboSats fetchers) |

`:currency` must be a code returned by `/api/market/currencies` (e.g. `EUR`, `USD`, `BRL`). Unsupported codes return `404`.

## Response shape

Each offer in a `data` array has the following fields:

```json
{
  "service": "RoboSats",
  "url": "https://unsafe.robosats.com/",
  "features": ["lightning", "p2p", "open-source"],
  "method": "Sepa Instant",
  "price": 94823.17
}
```

`price` is the effective fiat price per BTC after service fees are applied:

| Platform | Fee model |
|----------|-----------|
| Bisq | ±1.15 % maker fee baked into price |
| RoboSats | ±0.175 % coordinator fee baked into price |
| Peach Bitcoin | Premium from offer × 1.02 (2 % service fee) |

Buy endpoints sort by `price` descending (highest first — best rate to sell fiat for BTC). Sell endpoints sort ascending (lowest first — cheapest BTC to acquire).

Partial failures are non-fatal. If one platform is unreachable the others are still returned:

```json
{
  "data": [...],
  "errors": ["bisq"]
}
```

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Auth secret for the inline `/api/market/tor-proxy` handler used by Bisq and RoboSats fetchers |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | RoboSats default onion | RoboSats coordinator onion address |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

## Standalone mode

Requires a running Tor daemon on the host (default port 9050).

```bash
cp .env.example .env
pnpm dev      # local Nitro dev server
pnpm build
pnpm start
```

## Module mode

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2payments/market'],
  market: {
    enabled: true,
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    robosatsCoordinatorOnionUrl: process.env.NUXT_ROBOSATS_COORDINATOR_ONION_URL
  }
})
```

Add `"@p2payments/market": "workspace:*"` to the app's `package.json` dependencies.

The module is disabled by default (`enabled: false`). Set `enabled: true` or `NUXT_MARKET_ENABLED=true` to activate it.

## Supported currencies

79 fiat currencies are supported, covering major global and emerging-market codes. Full list via `GET /api/market/currencies`. Coverage per platform varies — offers are returned only for markets where at least one active order exists for the requested currency and payment method.
