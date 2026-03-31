# @p2pay/peach

Nuxt 4 module for the [Peach](https://peachbitcoin.com) P2P Bitcoin rail. Handles offer creation, trade requests, contract management, and payment confirmation using BIP32 key derivation and PGP signing.

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/rails/peach/me` | Fetch the authenticated Peach account |
| `POST` | `/api/rails/peach/offer` | Create a sell offer |
| `GET` | `/api/rails/peach/tradeRequests` | List incoming trade requests |
| `POST` | `/api/rails/peach/tradeRequest/accept` | Accept a trade request |
| `GET` | `/api/rails/peach/contract` | Get the active contract |
| `POST` | `/api/rails/peach/paymentConfirm` | Confirm payment received |

## Environment variables

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

## Adding to an app

```json
// package.json
"dependencies": {
  "@p2pay/peach": "workspace:*"
}
```

```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@p2pay/peach']
})
```
