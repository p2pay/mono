import { middlewareDefs } from './module/definitions/middlewares.js'

export default defineNitroConfig({
  preset: 'cloudflare-module',
  compatibilityDate: '2026-02-10',

  runtimeConfig: {
    corsProxySecret: process.env.NUXT_CORS_PROXY_SECRET,
    corsTargetUrl: process.env.NUXT_CORS_TARGET_URL,
    corsHealthPath: process.env.NUXT_CORS_HEALTH_PATH || '/'
  },

  handlers: middlewareDefs.map(mw => ({
    middleware: true,
    route: '/',
    handler: `./runtime/middleware/${mw.file}`
  }))
})
