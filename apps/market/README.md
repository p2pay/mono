# @p2pay/market

KYC-free Bitcoin price aggregator. Shows buy/sell offers from Bisq, RoboSats, and Peach grouped by payment method and sorted by price.

## Quick start

```bash
cp .env.example .env   # fill in secrets
pnpm install
pnpm dev
```

Or from the monorepo root:

```bash
pnpm dev:market
```

## Providers

| Provider | Transport | Features |
|----------|-----------|----------|
| Bisq | Tor (SOCKS5h) | On-chain, P2P, open-source |
| RoboSats | Tor (SOCKS5h) | Lightning, P2P, open-source |
| Peach | HTTPS | On-chain, P2P |

RoboSats and Bisq connect to onion addresses via the local Tor daemon (SOCKS5h). The inline `/api/tor-proxy` handler additionally allows browser-side coordinator access.

## API routes

| Route | Description |
|-------|-------------|
| `GET /api/currencies` | List supported fiat currencies |
| `GET /api/platforms` | List active providers |
| `GET /api/offers/:currency/buy` | Aggregated buy offers sorted by price desc |
| `GET /api/offers/:currency/sell` | Aggregated sell offers sorted by price asc |
| `ALL /api/tor-proxy/**` | Authenticated Tor reverse proxy for coordinator access |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TOR_PROXY_SECRET` | yes | — | Auth secret for the `/api/tor-proxy` handler |
| `ROBOSATS_COORDINATOR_ONION_URL` | no | RoboSats default onion | RoboSats coordinator onion address |
| `DEPLOYMENT_DOMAIN` | no | `http://localhost:3000` | Canonical URL for OG meta tags |
| `UMAMI_ID` | no | — | Umami analytics site ID (production only) |
| `UMAMI_HOST` | no | — | Umami analytics host URL |
