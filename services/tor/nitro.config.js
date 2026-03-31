import { middlewareDefs } from './module/definitions/middlewares.js'

export default defineNitroConfig({

  runtimeConfig: {
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    torSocksUrl: process.env.NUXT_TOR_SOCKS_URL || 'socks5h://127.0.0.1:9050',
    robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL,
  },

  handlers: middlewareDefs.map(mw => ({
    middleware: true,
    route: '/',
    handler: `./runtime/middleware/${mw.file}`
  }))
});
