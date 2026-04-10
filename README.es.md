# p2payments/mono

`mono` es el repositorio orquestador de [P2Payments](https://github.com/P2Payments). Reúne rieles de pago, flujos de negocio y servicios de soporte en un único workspace basado en Nuxt.

Este repositorio todavía se está limpiando y debe leerse como una base temprana del orquestador, no como un producto terminado.

## Estructura

```text
/
├── nuxt.config.js      app Nuxt raíz — carga todos los módulos del workspace
├── app.vue
├── pages/
├── server/
├── rails/              módulos de rieles de pago
├── flows/              módulos de flujos de negocio
├── services/           módulos de servicios de infraestructura
└── utils/              utilidades compartidas
```

## Qué existe hoy

### Rails

Módulos de rieles de pago. Cada uno inyecta páginas, composables y handlers del servidor en la app host, y también puede ejecutarse de forma standalone como servidor Nitro.

| Package | Page | API |
|---------|------|-----|
| `@p2payments/template` (`rails/template`) | `/rails/template` | `/api/rails/template` |
| `@p2payments/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` |
| `@p2payments/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` |

### Flows

Módulos de funcionalidades de nivel superior con páginas y componentes de UI.

| Package | Pages |
|---------|-------|
| `@p2payments/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` |

### Services

Módulos de infraestructura que funcionan tanto como app Nitro standalone como módulo Nuxt embebible.

| Package | Routes | Notes |
|---------|--------|-------|
| `@p2payments/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Proxy inverso Tor, deshabilitado por defecto |
| `@p2payments/market` (`services/market`) | `/api/market/**` | Agregador de ofertas sin KYC (Bisq, RoboSats, Peach), deshabilitado por defecto |

## Qué no es esto

- No es un marketplace terminado
- No es un SDK público pulido
- Todavía no es lo bastante estable como para prometer un uso amplio en producción

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Carga de módulos

La app Nuxt raíz (`nuxt.config.js`) lista los módulos del workspace en el array `modules`. Cada módulo registra automáticamente sus páginas, composables y handlers del servidor cuando la app se inicia. Añadir un módulo requiere dos cambios:

1. Añadir `"@p2payments/<name>": "workspace:*"` a las dependencias del `package.json` raíz
2. Añadir `'@p2payments/<name>'` al array `modules` en `nuxt.config.js`

`flows/booking` requiere `@nuxt/ui`. Debe estar presente en `nuxt.config.js` antes o junto con el módulo booking.

## Variables de entorno

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secreto compartido enviado en el header `X-Tor-Proxy-Secret` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del daemon Tor local |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | onion por defecto de RoboSats | URL base onion del coordinador |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secreto compartido para el proxy embebido `@p2payments/tor` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del daemon Tor local |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | URL base de la API de Peach |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | Mnemonic BIP39 para derivación de claves de wallet |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Clave privada PGP armorizada |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Clave pública PGP armorizada |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | Passphrase de la clave PGP |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Código de referido de Peach |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Estrategia de fee rate de Bitcoin |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Prima máxima aceptada para ofertas |

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Secreto de autenticación para el handler inline del proxy Tor |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | onion por defecto de RoboSats | Dirección onion del coordinador de RoboSats |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | URL SOCKS5h del daemon Tor local |

## Problemas conocidos

- Incompatibilidad de versión de `@nuxt/kit`: `rails/peach`, `rails/robosats` y `services/tor` declaran `@nuxt/kit ^3.13.0`, mientras que la app raíz y `rails/template`, `flows/booking` usan `^4.0.0`. Los módulos funcionan en modo módulo mediante la propia instancia de kit de Nuxt, pero la migración completa standalone a `^4.0.0` sigue pendiente.
