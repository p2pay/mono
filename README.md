# p2pay/mono

Monorepo pnpm workspace for the **P2Pay** open-source multi-rail payment software.

Each workspace package is a self-contained Nuxt 4 module. Apps assemble rails, flows, and services by listing them in `nuxt.config.js`, with minimal glue code.

## Workspace layout

```text
mono/
├── apps/       standalone Nuxt applications
├── rails/      payment rail modules
├── flows/      business flow modules
├── services/   infrastructure service modules (Tor proxy, CORS proxy)
├── utils/      shared utilities
└── packages/   (reserved)
```

## Apps

| Package | Description |
|---------|-------------|
| `@p2pay/mono-app` (`apps/mono`) | Development app — loads all workspace modules for local testing |
| `@p2pay/market` (`apps/market`) | KYC-free Bitcoin price aggregator — buy/sell offers from Bisq, RoboSats, Peach |

## Rails

Rails are pluggable payment-rail modules. Each injects pages, composables, and server handlers into the host app.

| Package | Page | API | Description |
|---------|------|-----|-------------|
| `@p2pay/template` (`rails/template`) | `/rails/template` | `/api/rails/template` | Reference rail — copy this to scaffold a new integration |
| `@p2pay/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` | [Peach](https://peachbitcoin.com) P2P Bitcoin rail |
| `@p2pay/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` | [RoboSats](https://robosats.com) P2P Bitcoin rail via Tor |

## Flows

Flows are higher-level feature modules: pages, components, composables, and server handlers in one package.

| Package | Page(s) | Description |
|---------|---------|-------------|
| `@p2pay/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` | Booking/scheduling UI with calendar, time slots, and embeddable iframe variant |

## Services

Services ship as both a **standalone Nitro app** (deployable to Cloudflare Workers or Docker) and a **Nuxt module** (embeddable into any app in the workspace).

| Package | Routes | Description |
|---------|--------|-------------|
| `@p2pay/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Tor reverse proxy — forwards requests to onion URLs via SOCKS5h |
| `@p2pay/cors` (`services/cors`) | `/api/cors`, `/api/cors/**` | CORS reverse proxy — proxies a target API with secret-based auth |

## Quick start

```bash
pnpm install
pnpm dev           # runs apps/mono
pnpm dev:market    # runs apps/market
```

## Module anatomy

Every rail and flow follows the same pattern:

```text
<type>/<name>/
├── package.json        name: @p2pay/<name>
├── module.js           defineNuxtModule — wires pages, handlers, composables
└── runtime/
    ├── pages/          injected via pages:extend hook
    ├── components/     injected via addComponentsDir (flows only)
    ├── composables/    injected via addImportsDir
    └── handlers/       registered via addServerHandler
```

The host app needs only two changes to add a module:

1. In `package.json`, add `"@p2pay/<name>": "workspace:*"` to `dependencies`
2. In `nuxt.config.js`, add `'@p2pay/<name>'` to the `modules` array

## Environment variables

### `apps/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TOR_PROXY_SECRET` | yes | — | Auth secret for the inline `/api/tor-proxy` handler |
| `ROBOSATS_COORDINATOR_ONION_URL` | no | RoboSats default onion | RoboSats coordinator onion address |
| `DEPLOYMENT_DOMAIN` | no | `http://localhost:3000` | Canonical URL used in OG meta tags |
| `UMAMI_ID` | no | — | Umami analytics site ID |
| `UMAMI_HOST` | no | — | Umami analytics host URL |

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret validated on every request |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h proxy URL for the local Tor daemon |
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Target onion URL to forward requests to |

### `services/cors`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_CORS_TARGET_URL` | yes | — | Target API base URL, e.g. `https://api.peachbitcoin.com` |
| `NUXT_CORS_PROXY_SECRET` | yes | — | Shared secret validated on every request |
| `NUXT_CORS_HEALTH_PATH` | no | `/` | Path on the target used for the health endpoint |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h proxy for Tor |
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Coordinator onion address |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | Peach API base URL |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | BIP39 mnemonic for wallet key derivation |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Armored PGP private key |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Armored PGP public key |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | PGP key passphrase |
| `NUXT_PEACH_PAYMENT_DETAILS` | no | `{}` | JSON payment details object |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Peach referral code |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Bitcoin fee rate strategy |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Maximum accepted offer premium |

## License

MIT — p2pay
