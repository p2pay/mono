[Español](README.es.md) | [Português](README.pt.md) | [Русский](README.ru.md) | [Français](README.fr.md) | [Italiano](README.it.md)

# p2pagos/mono

`mono` is the orchestrator repo for [P2Pagos](https://p2pagos.com). It assembles payment rails, business flows, and support services into a single Nuxt-based workspace.

This repository is still being cleaned up and should be read as an early orchestrator base, not as a finished product.

## Structure

```
/
├── nuxt.config.js      root Nuxt app — loads all workspace modules
├── app.vue
├── pages/
├── server/
├── rails/              payment rail modules
├── flows/              business flow modules
├── services/           infrastructure service modules
└── utils/              shared utilities
```

## What exists today

### Rails

Payment rail modules. Each injects pages, composables, and server handlers into the host app, and can also run standalone as a Nitro server.

| Package | Page | API |
|---------|------|-----|
| `@p2pagos/template` (`rails/template`) | `/rails/template` | `/api/rails/template` |
| `@p2pagos/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` |
| `@p2pagos/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` |

### Flows

Higher-level feature modules with pages and UI components.

| Package | Pages |
|---------|-------|
| `@p2pagos/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` |

### Services

Infrastructure modules that run as both a standalone Nitro app and an embeddable Nuxt module.

| Package | Routes | Notes |
|---------|--------|-------|
| `@p2pagos/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Tor reverse proxy, disabled by default |
| `@p2pagos/market` (`services/market`) | `/api/market/**` | KYC-free offer aggregator (Bisq, RoboSats, Peach), disabled by default |

## What this is not

- Not a finished marketplace
- Not a polished public SDK
- Not stable enough yet to promise broad production use

## Local development

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Module loading

The root Nuxt app (`nuxt.config.js`) lists workspace modules in the `modules` array. Each module auto-registers its pages, composables, and server handlers when the app starts. Adding a module requires two changes:

1. Add `"@p2pagos/<name>": "workspace:*"` to root `package.json` dependencies
2. Add `'@p2pagos/<name>'` to the `modules` array in `nuxt.config.js`

`flows/booking` requires `@nuxt/ui`. It must be present in `nuxt.config.js` before or alongside the booking module.

## Environment variables

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret sent in `X-Tor-Proxy-Secret` header |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Coordinator onion base URL |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret for the embedded `@p2pagos/tor` proxy |
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

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Auth secret for the inline Tor proxy handler |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | RoboSats default onion | RoboSats coordinator onion address |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |

## Known issues

- `@nuxt/kit` version mismatch: `rails/peach`, `rails/robosats`, and `services/tor` declare `@nuxt/kit ^3.13.0` while the root app and `rails/template`, `flows/booking` use `^4.0.0`. The modules work in module mode via Nuxt's own kit instance, but full standalone migration to `^4.0.0` is pending.

### Repo inspired by [**BitPagos**](https://web.archive.org/web/20141225131358/https://www.bitpagos.com/es/)
