# p2pay/mono skeleton (Nuxt dual-mode)

This workspace contains:

- `apps/mono` — standalone Nuxt app that **uses** the mono module and a template rail.
- `packages/mono` — Nuxt module: exposes an API endpoint and injects a page.
- `rails/template` — Nuxt module (rail template): exposes an API endpoint and injects a page.
- `rails/peach` — Nuxt module (Peach rail): exposes an API endpoint and injects a page.
- `flows/booking` - Nuxt module with the booking view on calendar.
- Empty placeholders: `flows/`, `utils/`, `apps/`

## Quick start

```bash
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000/` (standalone app)
- `http://localhost:3000/mono` (page injected by `@p2payto/mono`)
- `http://localhost:3000/rails/template` (page injected by `@p2payto/template`)
- `http://localhost:3000/rails/peach` (page injected by `@p2payto/peach`)

## Reference

[ChatGPT chat](https://chatgpt.com/share/699d9b1d-f820-8013-bffb-7d4e85bfc576)
