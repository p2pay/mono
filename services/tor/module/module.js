import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import { endpointDefs } from './definitions/endpoints.js'
import { middlewareDefs } from './definitions/middlewares.js'

const toBoolean = (v) => String(v || '').toLowerCase() === 'true'

export default defineNuxtModule({
  meta: {
    name: 'tor',
    configKey: 'tor'
  },

  defaults: {
    enabled: false,
    prefix: '/api/tor',
    torProxySecret: undefined,
    torSocksUrl: undefined,
    robosatsCoordinatorUrl: undefined
  },

  setup(options, nuxt) {
    const enabled = toBoolean(options.enabled)
    if (!enabled) return

    // Map module options -> runtimeConfig (server-only)
    // Override only if provided
    if (options.torProxySecret !== undefined) {
      nuxt.options.runtimeConfig.torProxySecret = options.torProxySecret
    }
    if (options.torSocksUrl !== undefined) {
      nuxt.options.runtimeConfig.torSocksUrl = options.torSocksUrl
    }
    if (options.robosatsCoordinatorUrl !== undefined) {
      nuxt.options.runtimeConfig.robosatsCoordinatorUrl = options.robosatsCoordinatorUrl
    }

    // Defaults (only if still missing)
    nuxt.options.runtimeConfig.torSocksUrl =
      nuxt.options.runtimeConfig.torSocksUrl ?? 'socks5h://127.0.0.1:9050'

    nuxt.options.runtimeConfig.robosatsCoordinatorUrl =
      nuxt.options.runtimeConfig.robosatsCoordinatorUrl ??
      'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion'

    const resolver = createResolver(import.meta.url)

    for (const mw of middlewareDefs) {
      addServerHandler({
        middleware: true,
        route: '/',
        handler: resolver.resolve(`../runtime/middleware/${mw.file}`)
      })
    }

    const prefix = String(options.prefix).replace(/\/+$/, '')

    // Register specific methods before catch-all so Nitro resolves them first
    const specific = endpointDefs.filter(e => e.method !== 'ALL')
    const catchAll = endpointDefs.filter(e => e.method === 'ALL')

    for (const ep of [...specific, ...catchAll]) {
      const method = String(ep.method).toUpperCase()
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : prefix

      const def = {
        route,
        handler: resolver.resolve(`../runtime/handlers/${ep.file}`)
      }

      if (method !== 'ALL') def.method = method

      addServerHandler(def)
    }
  }
})
