# services

Infrastructure service modules live under `services/*`.

Each service ships in **dual mode**:

- **Standalone** — a self-contained Nitro app deployable to Cloudflare Workers or Docker, configured via `.env` / `wrangler.toml`
- **Module** — a Nuxt module (`services/<name>/module/`) embeddable into any app in the workspace, which registers the same handlers under the host app's Nitro server

## Available services

| Package | Routes | Standalone deploy | Description |
|---------|--------|-------------------|-------------|
| `@p2pay/tor` (`services/tor`) | `GET /api/tor`, `ALL /api/tor/**` | Docker + Cloudflare Workers | Tor reverse proxy — forwards requests to onion URLs via a local SOCKS5h daemon |
| `@p2pay/cors` (`services/cors`) | `GET /api/cors`, `ALL /api/cors/**` | Cloudflare Workers | CORS reverse proxy — proxies a configured target API with secret-based auth |

## Standalone: running locally

```bash
# Tor service
cd services/tor
cp .env.example .env   # fill in secrets
pnpm dev

# CORS service
cd services/cors
cp .env.example .env
pnpm dev
```

## Standalone: deploy to Cloudflare Workers

```bash
cd services/cors   # or services/tor
pnpm build
pnpm deploy        # runs wrangler deploy
```

## Module mode: embedding in an app

Add the service as a workspace dependency and enable it in `nuxt.config.js`:

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2pay/tor'],
  tor: {
    enabled: true,
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET
  }
})
```

## Environment variables

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret validated on every inbound request |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Target onion base URL |

### `services/cors`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_CORS_TARGET_URL` | yes | — | Target API base URL, e.g. `https://api.peachbitcoin.com` |
| `NUXT_CORS_PROXY_SECRET` | yes | — | Shared secret validated on every inbound request |
| `NUXT_CORS_HEALTH_PATH` | no | `/` | Path on the target used for the `/api/cors` health check |
