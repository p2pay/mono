import { endpointDefs as torEndpoints } from '../../services/tor/module/definitions/endpoints.js'
import { middlewareDefs as torMiddlewares } from '../../services/tor/module/definitions/middlewares.js'
import { endpointDefs } from './module/definitions/endpoints.js'

const torPrefix = '/api/tor'
const robosatsPrefix = '/api/rails/robosats'

export default defineNitroConfig({
  compatibilityDate: '2026-04-04',

  runtimeConfig: {
    robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL || 'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion',
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    torSocksUrl: process.env.NUXT_TOR_SOCKS_URL || 'socks5h://127.0.0.1:9050',
    torProxyPrefix: torPrefix
  },

  handlers: [
    // Tor middleware
    ...torMiddlewares.map(mw => ({
      middleware: true,
      route: '/',
      handler: `../../services/tor/runtime/middleware/${mw.file}`
    })),
    // Tor proxy endpoints
    ...torEndpoints.map(ep => {
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${torPrefix}/${routeRel}` : torPrefix
      const def = { route, handler: `../../services/tor/runtime/handlers/${ep.file}` }
      if (ep.method !== 'ALL') def.method = ep.method
      return def
    }),
    // RoboSats endpoints
    ...endpointDefs.map(ep => {
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${robosatsPrefix}/${routeRel}` : robosatsPrefix
      const def = { route, handler: `./runtime/handlers/${ep.file}` }
      if (ep.method !== 'ALL') def.method = ep.method
      return def
    })
  ]
})
