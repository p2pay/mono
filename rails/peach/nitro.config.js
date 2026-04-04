import { endpointDefs } from './module/definitions/endpoints.js'

const prefix = '/api/rails/peach'

export default defineNitroConfig({
  compatibilityDate: '2026-04-04',

  runtimeConfig: {
    peachBaseUrl: process.env.NUXT_PEACH_BASE_URL || 'https://api.peachbitcoin.com',
    peachBitcoinMnemonic: process.env.NUXT_PEACH_BITCOIN_MNEMONIC,
    peachPgpPrivateKey: process.env.NUXT_PEACH_PGP_PRIVATE_KEY,
    peachPgpPublicKey: process.env.NUXT_PEACH_PGP_PUBLIC_KEY,
    peachPgpPassphrase: process.env.NUXT_PEACH_PGP_PASSPHRASE,
    peachReferralCode: process.env.NUXT_PEACH_REFERRAL_CODE || '',
    peachFeeRate: process.env.NUXT_PEACH_FEE_RATE || 'hourFee',
    peachMaxPremium: Number(process.env.NUXT_PEACH_MAX_PREMIUM) || 0
  },

  handlers: endpointDefs.map(ep => {
    const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
    const route = routeRel ? `${prefix}/${routeRel}` : prefix
    const def = { route, handler: `./runtime/handlers/${ep.file}` }
    if (ep.method !== 'ALL') def.method = ep.method
    return def
  })
})
