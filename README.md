# p2pay/mono

Monorepo pnpm workspace for the **P2Pay** open-source multi-rail payment software.

Each workspace package is a self-contained module. Apps assemble rails, flows, and services by listing them in `nuxt.config.js`, with minimal glue code. Services and rails also run standalone as Nitro servers.

## Workspace layout

```text
mono/
├── apps/       standalone Nuxt applications
├── rails/      payment rail modules
├── flows/      business flow modules
├── services/   infrastructure service modules
├── utils/      shared utilities
└── packages/   (reserved)
```

## Apps

| Package | Description |
|---------|-------------|
| `@p2pay/mono-app` (`apps/mono`) | Development app — loads all workspace modules for local testing |

## Rails

Rails are pluggable payment-rail modules. Each injects pages, composables, and server handlers into the host app, and can also run standalone as a Nitro server.

| Package | Page | API | Description |
|---------|------|-----|-------------|
| `@p2pay/template` (`rails/template`) | `/rails/template` | `/api/rails/template` | Reference rail — copy this to scaffold a new integration |
| `@p2pay/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` | [Peach](https://peachbitcoin.com) P2P Bitcoin rail |
| `@p2pay/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` | [RoboSats](https://robosats.com) P2P Bitcoin rail — installs `@p2pay/tor` automatically |

## Flows

Flows are higher-level feature modules: pages, components, composables, and server handlers in one package.

| Package | Page(s) | Description |
|---------|---------|-------------|
| `@p2pay/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` | Booking/scheduling UI with calendar, time slots, and embeddable iframe variant |

## Services

Services ship as both a **standalone Nitro app** and a **Nuxt module** embeddable into any app in the workspace.

| Package | Routes | Description |
|---------|--------|-------------|
| `@p2pay/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Generic Tor reverse proxy — target onion URL set per-request via `X-Tor-Target` header |
| `@p2pay/cors` (`services/cors`) | `/api/cors`, `/api/cors/**` | CORS reverse proxy — proxies a configured target API with secret-based auth |
| `@p2pay/market` (`services/market`) | `/api/market/**` | KYC-free Bitcoin price aggregator — buy/sell offers from Bisq, RoboSats, Peach |

## Quick start

```bash
pnpm install
pnpm dev           # runs apps/mono
```

## Module anatomy

Services follow this structure:

```text
services/<name>/
├── package.json
├── nitro.config.js             standalone Nitro config
├── routes/
│   └── index.get.js            standalone health check
├── module/
│   ├── module.js               defineNuxtModule entry point
│   └── definitions/
│       ├── endpoints.js        endpoint list shared by module and nitro config
│       └── middlewares.js      middleware list
└── runtime/
    ├── middleware/             registered in both modes
    ├── handlers/               registered via addServerHandler (module) or handlers[] (standalone)
    └── utils/                  explicitly imported by handlers
```

Rails follow the same structure under `runtime/`, with `lib/` for server utilities and `composables/` + `pages/` for client-side injection (Nuxt module mode only).

The host app needs only two changes to add a module:

1. In `package.json`, add `"@p2pay/<name>": "workspace:*"` to `dependencies`
2. In `nuxt.config.js`, add `'@p2pay/<name>'` to the `modules` array

## Environment variables

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret sent in `X-Tor-Proxy-Secret` header |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

### `services/cors`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_CORS_TARGET_URL` | yes | — | Target API base URL |
| `NUXT_CORS_PROXY_SECRET` | yes | — | Shared secret validated on every request |
| `NUXT_CORS_HEALTH_PATH` | no | `/` | Path on the target used for the health check |

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Auth secret for the inline `/api/market/tor-proxy` handler |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | RoboSats default onion | RoboSats coordinator onion address |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Coordinator onion base URL |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret for the embedded `@p2pay/tor` proxy |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | Peach API base URL |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | BIP39 mnemonic for wallet key derivation |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Armored PGP private key |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Armored PGP public key |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | PGP key passphrase |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Peach referral code |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Bitcoin fee rate strategy |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Maximum accepted offer premium |

## License

MIT — p2pay
