# @p2pay/tor

Tor reverse proxy service. Forwards HTTP/HTTPS requests to onion URLs via a local Tor daemon (SOCKS5h). Ships in dual mode: standalone Nitro app or Nuxt module.

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/tor` | Health check — confirms the coordinator onion is reachable |
| `ALL` | `/api/tor/**` | Authenticated proxy — forwards to the configured onion base URL |

All routes validate the `X-Tor-Proxy-Secret` request header.

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Shared secret sent in `X-Tor-Proxy-Secret` header |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL of the local Tor daemon |
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | RoboSats default onion | Onion base URL to proxy requests to |

## Standalone mode

Requires a running Tor daemon on the host (default port 9050).

```bash
cp .env.example .env
pnpm dev      # local Nitro dev server
pnpm build
pnpm deploy   # Cloudflare Workers via wrangler
```

Docker:

```bash
docker build -t p2pay-tor .
docker run --network=host -e NUXT_TOR_PROXY_SECRET=... p2pay-tor
```

## Module mode

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2pay/tor'],
  tor: {
    enabled: true
    // options map to runtimeConfig keys
  }
})
```

Add `"@p2pay/tor": "workspace:*"` to the app's `package.json` dependencies.
