import { defineNuxtModule, addServerHandler, addImportsDir, createResolver } from '@nuxt/kit'

function toBool(v) {
  if (typeof v === 'boolean') return v
  return String(v || '').toLowerCase() === 'true'
}

const endpoints = [
  { method: 'GET',  route: 'me',                      file: 'me.get.js'                     },
  { method: 'POST', route: 'offer',                    file: 'offer.post.js'                 },
  { method: 'GET',  route: 'trade-requests',           file: 'tradeRequests.get.js'          },
  { method: 'POST', route: 'trade-request/accept',     file: 'tradeRequest.accept.post.js'   },
  { method: 'GET',  route: 'contract',                 file: 'contract.get.js'               },
  { method: 'POST', route: 'contract/confirm-payment', file: 'paymentConfirm.post.js'        },
]

export default defineNuxtModule({
  meta: {
    name: '@p2payto/peach',
    configKey: 'p2payPeachRail'
  },
  defaults: {
    enabled: true,
    routeBase: '/rails/peach',
    apiPrefix: '/api/rails/peach',
    peachBaseUrl: undefined,
    peachBitcoinMnemonic: undefined,
    peachPgpPrivateKey: undefined,
    peachPgpPublicKey: undefined,
    peachPgpPassphrase: undefined,
    peachReferralCode: undefined,
    peachFeeRate: undefined,
    peachMaxPremium: undefined,
  },
  setup(options, nuxt) {
    if (!toBool(options.enabled)) return

    const resolver = createResolver(import.meta.url)

    // Runtime config (server-only, never exposed to client)
    // Set via NUXT_PEACH_* env vars or nuxt.config.js p2payPeachRail options
    nuxt.options.runtimeConfig.peachBaseUrl =
      options.peachBaseUrl ?? nuxt.options.runtimeConfig.peachBaseUrl ?? 'https://api.peachbitcoin.com'
    nuxt.options.runtimeConfig.peachBitcoinMnemonic =
      options.peachBitcoinMnemonic ?? nuxt.options.runtimeConfig.peachBitcoinMnemonic ?? ''
    nuxt.options.runtimeConfig.peachPgpPrivateKey =
      options.peachPgpPrivateKey ?? nuxt.options.runtimeConfig.peachPgpPrivateKey ?? ''
    nuxt.options.runtimeConfig.peachPgpPublicKey =
      options.peachPgpPublicKey ?? nuxt.options.runtimeConfig.peachPgpPublicKey ?? ''
    nuxt.options.runtimeConfig.peachPgpPassphrase =
      options.peachPgpPassphrase ?? nuxt.options.runtimeConfig.peachPgpPassphrase ?? ''
    nuxt.options.runtimeConfig.peachReferralCode =
      options.peachReferralCode ?? nuxt.options.runtimeConfig.peachReferralCode ?? ''
    nuxt.options.runtimeConfig.peachFeeRate =
      options.peachFeeRate ?? nuxt.options.runtimeConfig.peachFeeRate ?? 'hourFee'
    nuxt.options.runtimeConfig.peachMaxPremium =
      options.peachMaxPremium ?? nuxt.options.runtimeConfig.peachMaxPremium ?? 0

    // Auto-import composables (client-side)
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Server handlers
    const prefix = String(options.apiPrefix || '/api/rails/peach').replace(/\/+$/, '')
    const seen = new Set()

    for (const ep of endpoints) {
      const method = String(ep.method).toUpperCase()
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : prefix

      const key = `${method} ${route}`
      if (seen.has(key)) throw new Error(`[peach-rail] Duplicate endpoint: ${key}`)
      seen.add(key)

      const def = {
        route,
        handler: resolver.resolve(`./runtime/handlers/${ep.file}`)
      }
      if (method !== 'ALL') def.method = method
      addServerHandler(def)
    }

    // Page
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'p2pay-rail-peach',
        path: options.routeBase,
        file: resolver.resolve('./runtime/pages/peach.vue')
      })
    })
  }
})
