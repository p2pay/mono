# p2payments/mono

`mono` — это репозиторий-оркестратор для [P2Payments](https://github.com/P2Payments). Он объединяет платёжные rails, бизнес-flow и вспомогательные сервисы в одном workspace на базе Nuxt.

Этот репозиторий всё ещё приводится в порядок и должен восприниматься как ранняя база оркестратора, а не как готовый продукт.

## Структура

```text
/
├── nuxt.config.js      корневое Nuxt-приложение — загружает все модули workspace
├── app.vue
├── pages/
├── server/
├── rails/              модули платёжных rails
├── flows/              модули бизнес-flow
├── services/           модули инфраструктурных сервисов
└── utils/              общие утилиты
```

## Что уже существует

### Rails

Модули платёжных rails. Каждый из них внедряет страницы, composables и server handlers в хост-приложение, а также может работать отдельно как Nitro server.

| Package | Page | API |
|---------|------|-----|
| `@p2payments/template` (`rails/template`) | `/rails/template` | `/api/rails/template` |
| `@p2payments/peach` (`rails/peach`) | `/rails/peach` | `/api/rails/peach/*` |
| `@p2payments/robosats` (`rails/robosats`) | `/rails/robosats` | `/api/rails/robosats/*` |

### Flows

Модули более высокого уровня с страницами и UI-компонентами.

| Package | Pages |
|---------|-------|
| `@p2payments/booking` (`flows/booking`) | `/flows/booking`, `/flows/booking/embed` |

### Services

Инфраструктурные модули, которые работают как отдельное Nitro-приложение и как встраиваемый Nuxt-модуль.

| Package | Routes | Notes |
|---------|--------|-------|
| `@p2payments/tor` (`services/tor`) | `/api/tor`, `/api/tor/**` | Tor reverse proxy, отключён по умолчанию |
| `@p2payments/market` (`services/market`) | `/api/market/**` | Агрегатор офферов без KYC (Bisq, RoboSats, Peach), отключён по умолчанию |

## Чем это не является

- Это не готовый marketplace
- Это не отполированный публичный SDK
- Это пока недостаточно стабильно, чтобы обещать широкое production-использование

## Локальная разработка

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Загрузка модулей

Корневое Nuxt-приложение (`nuxt.config.js`) перечисляет модули workspace в массиве `modules`. Каждый модуль автоматически регистрирует свои страницы, composables и server handlers при запуске приложения. Добавление модуля требует двух изменений:

1. Добавить `"@p2payments/<name>": "workspace:*"` в зависимости корневого `package.json`
2. Добавить `'@p2payments/<name>'` в массив `modules` в `nuxt.config.js`

`flows/booking` требует `@nuxt/ui`. Он должен присутствовать в `nuxt.config.js` до или вместе с модулем booking.

## Переменные окружения

### `services/tor`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Общий секрет, передаваемый в заголовке `X-Tor-Proxy-Secret` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL локального Tor daemon |

### `rails/robosats`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_ROBOSATS_COORDINATOR_URL` | no | onion по умолчанию для RoboSats | Базовый onion URL координатора |
| `NUXT_TOR_PROXY_SECRET` | yes | — | Общий секрет для встроенного прокси `@p2payments/tor` |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL локального Tor daemon |

### `rails/peach`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PEACH_BASE_URL` | no | `https://api.peachbitcoin.com` | Базовый URL API Peach |
| `NUXT_PEACH_BITCOIN_MNEMONIC` | yes | — | BIP39 mnemonic для деривации ключей wallet |
| `NUXT_PEACH_PGP_PRIVATE_KEY` | yes | — | Armored PGP private key |
| `NUXT_PEACH_PGP_PUBLIC_KEY` | yes | — | Armored PGP public key |
| `NUXT_PEACH_PGP_PASSPHRASE` | yes | — | Passphrase PGP-ключа |
| `NUXT_PEACH_REFERRAL_CODE` | no | — | Реферальный код Peach |
| `NUXT_PEACH_FEE_RATE` | no | `hourFee` | Стратегия Bitcoin fee rate |
| `NUXT_PEACH_MAX_PREMIUM` | no | `0` | Максимально допустимая премия оффера |

### `services/market`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_TOR_PROXY_SECRET` | yes | — | Секрет аутентификации для inline Tor proxy handler |
| `NUXT_ROBOSATS_COORDINATOR_ONION_URL` | no | onion по умолчанию для RoboSats | Onion-адрес координатора RoboSats |
| `NUXT_TOR_SOCKS_URL` | no | `socks5h://127.0.0.1:9050` | SOCKS5h URL локального Tor daemon |

## Известные проблемы

- Несовпадение версий `@nuxt/kit`: `rails/peach`, `rails/robosats` и `services/tor` объявляют `@nuxt/kit ^3.13.0`, тогда как корневое приложение и `rails/template`, `flows/booking` используют `^4.0.0`. Модули работают в module mode через собственный экземпляр kit Nuxt, но полная standalone-миграция на `^4.0.0` ещё не завершена.
