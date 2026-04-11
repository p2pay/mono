# p2payments/mono

`mono` è il repository orchestratore di [P2Payments](https://github.com/P2Payments). Assembla rail di pagamento, flussi di business e servizi di supporto in un unico workspace basato su Nuxt.

Questo repository è ancora in fase di pulizia e va letto come una base iniziale dell’orchestratore, non come un prodotto finito.

## Struttura

```text
/
├── nuxt.config.js      app Nuxt root — carica tutti i moduli del workspace
├── app.vue
├── pages/
├── server/
├── rails/              moduli dei rail di pagamento
├── flows/              moduli dei flussi di business
├── services/           moduli dei servizi infrastrutturali
└── utils/              utility condivise
```

## Cosa esiste oggi

### Rails

Moduli dei rail di pagamento. Ognuno inietta pagine, composables e server handler nell’app host, e può anche funzionare in standalone come server Nitro.

| Package | Page | API |
|---------|------|-----|
| `@p2payments/template` (`rails/template`) | `/rails/template` | `/api/rails/template` |
| `@p2payments/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` |
| `@p2payments/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` |

### Flows

Moduli di funzionalità di livello superiore con pagine e componenti UI.

| Package | Pages |
|---------|-------|
| `@p2payments/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` |

### Services

Moduli infrastrutturali che funzionano sia come app Nitro standalone sia come modulo Nuxt embeddabile.

| Package | Routes | Notes |
|---------|--------|-------|
| `@p2payments/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Reverse proxy Tor, disabilitato di default |
| `@p2payments/market` (`services/market`) | `/api/market/**` | Aggregatore di offerte senza KYC (Bisq, RoboSats, Peach), disabilitato di default |

## Cosa non è

- Non è un marketplace finito
- Non è un SDK pubblico rifinito
- Non è ancora abbastanza stabile da promettere un uso ampio in produzione

## Sviluppo locale

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Caricamento dei moduli

L’app Nuxt root (`nuxt.config.js`) elenca i moduli del workspace nell’array `modules`. Ogni modulo registra automaticamente le proprie pagine, i composables e i server handler all’avvio dell’app. Aggiungere un modulo richiede due modifiche:

1. Aggiungere `"@p2payments/<name>": "workspace:*"` alle dipendenze del `package.json` root
2. Aggiungere `'@p2payments/<name>'` all’array `modules` in `nuxt.config.js`

`flows/booking` richiede `@nuxt/ui`. Deve essere presente in `nuxt.config.js` prima o insieme al modulo booking.

## Variabili d’ambiente

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Segreto condiviso inviato nell’header `X-Tor-Proxy-Secret` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del demone Tor locale |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | onion di default di RoboSats | URL base onion del coordinatore |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Segreto condiviso per il proxy embeddato `@p2payments/tor` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del demone Tor locale |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | URL base dell’API Peach |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | Mnemonic BIP39 per la derivazione delle chiavi del wallet |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Chiave privata PGP armored |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Chiave pubblica PGP armored |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | Passphrase della chiave PGP |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Codice referral Peach |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Strategia di fee rate Bitcoin |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Premium massimo accettato per le offerte |

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Segreto di autenticazione per l’handler inline del proxy Tor |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | onion di default di RoboSats | Indirizzo onion del coordinatore RoboSats |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del demone Tor locale |

## Problemi noti

- Mismatch di versione di `@nuxt/kit`: `rails/peach`, `rails/robosats` e `services/tor` dichiarano `@nuxt/kit ^3.13.0`, mentre l’app root e `rails/template`, `flows/booking` usano `^4.0.0`. I moduli funzionano in modalità modulo tramite l’istanza kit di Nuxt, ma la migrazione standalone completa a `^4.0.0` è ancora pendente.
