import { endpointDefs } from './module/definitions/endpoints.js'
import { middlewareDefs } from './module/definitions/middlewares.js'

const prefix = '/api/market'

export default defineNitroConfig({
  compatibilityDate: '2026-04-03',

  runtimeConfig: {
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    robosatsCoordinatorOnionUrl: process.env.NUXT_ROBOSATS_COORDINATOR_ONION_URL,
    torSocksUrl: process.env.NUXT_TOR_SOCKS_URL || 'socks5h://127.0.0.1:9050'
  },

  handlers: [
    ...middlewareDefs.map(mw => ({
      middleware: true,
      route: '/',
      handler: `./runtime/middleware/${mw.file}`
    })),
    ...endpointDefs.map(ep => {
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : prefix
      const def = { route, handler: `./runtime/handlers/${ep.file}` }
      if (ep.method !== 'ALL') def.method = ep.method
      return def
    })
  ]
})
