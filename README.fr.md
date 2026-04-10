# p2payments/mono

`mono` est le dépôt orchestrateur de [P2Payments](https://github.com/P2Payments). Il assemble des rails de paiement, des flux métier et des services de support dans un workspace unique basé sur Nuxt.

Ce dépôt est encore en cours de nettoyage et doit être lu comme une base d’orchestrateur précoce, et non comme un produit fini.

## Structure

```text
/
├── nuxt.config.js      application Nuxt racine — charge tous les modules du workspace
├── app.vue
├── pages/
├── server/
├── rails/              modules de rails de paiement
├── flows/              modules de flux métier
├── services/           modules de services d’infrastructure
└── utils/              utilitaires partagés
```

## Ce qui existe aujourd’hui

### Rails

Modules de rails de paiement. Chacun injecte des pages, des composables et des handlers serveur dans l’application hôte, et peut aussi fonctionner de manière autonome comme serveur Nitro.

| Package | Page | API |
|---------|------|-----|
| `@p2payments/template` (`rails/template`) | `/rails/template` | `/api/rails/template` |
| `@p2payments/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` |
| `@p2payments/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` |

### Flows

Modules de fonctionnalités de plus haut niveau avec pages et composants UI.

| Package | Pages |
|---------|-------|
| `@p2payments/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` |

### Services

Modules d’infrastructure qui fonctionnent à la fois comme application Nitro autonome et comme module Nuxt intégrable.

| Package | Routes | Notes |
|---------|--------|-------|
| `@p2payments/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Proxy inverse Tor, désactivé par défaut |
| `@p2payments/market` (`services/market`) | `/api/market/**` | Agrégateur d’offres sans KYC (Bisq, RoboSats, Peach), désactivé par défaut |

## Ce que ce n’est pas

- Ce n’est pas une marketplace finalisée
- Ce n’est pas un SDK public poli
- Ce n’est pas encore suffisamment stable pour promettre un usage large en production

## Développement local

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Chargement des modules

L’application Nuxt racine (`nuxt.config.js`) liste les modules du workspace dans le tableau `modules`. Chaque module enregistre automatiquement ses pages, composables et handlers serveur au démarrage de l’application. Ajouter un module nécessite deux changements :

1. Ajouter `"@p2payments/<name>": "workspace:*"` aux dépendances du `package.json` racine
2. Ajouter `'@p2payments/<name>'` au tableau `modules` dans `nuxt.config.js`

`flows/booking` nécessite `@nuxt/ui`. Il doit être présent dans `nuxt.config.js` avant ou en même temps que le module booking.

## Variables d’environnement

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secret partagé envoyé dans le header `X-Tor-Proxy-Secret` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h du démon Tor local |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | onion par défaut de RoboSats | URL de base onion du coordinateur |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secret partagé pour le proxy embarqué `@p2payments/tor` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h du démon Tor local |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | URL de base de l’API Peach |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | Mnemonic BIP39 pour la dérivation des clés du wallet |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Clé privée PGP armorisée |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Clé publique PGP armorisée |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | Passphrase de la clé PGP |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Code de parrainage Peach |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Stratégie de fee rate Bitcoin |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Prime maximale acceptée pour les offres |

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secret d’authentification pour le handler inline du proxy Tor |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | onion par défaut de RoboSats | Adresse onion du coordinateur RoboSats |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h du démon Tor local |

## Problèmes connus

- Incompatibilité de version de `@nuxt/kit` : `rails/peach`, `rails/robosats` et `services/tor` déclarent `@nuxt/kit ^3.13.0` tandis que l’application racine et `rails/template`, `flows/booking` utilisent `^4.0.0`. Les modules fonctionnent en mode module via la propre instance de kit de Nuxt, mais la migration standalone complète vers `^4.0.0` reste en attente.
