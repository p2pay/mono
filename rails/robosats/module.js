import { defineNuxtModule, addServerHandler, addImportsDir, createResolver } from '@nuxt/kit'

function toBool(v) {
  if (typeof v === 'boolean') return v
  return String(v || '').toLowerCase() === 'true'
}

const endpoints = [
  { method: 'GET',  route: 'limits', file: 'limits.get.js' },
  { method: 'POST', route: 'offer',  file: 'offer.post.js' },
  { method: 'GET',  route: 'order',  file: 'order.get.js'  },
  { method: 'POST', route: 'robot',  file: 'robot.post.js' },
]

export default defineNuxtModule({
  meta: {
    name: '@p2payto/robosats',
    configKey: 'p2payRobosatsRail'
  },
  defaults: {
    enabled: true,
    routeBase: '/rails/robosats',
    apiPrefix: '/api/rails/robosats',
    torSocksUrl: undefined,
    robosatsCoordinatorUrl: undefined,
  },
  setup(options, nuxt) {
    if (!toBool(options.enabled)) return

    const resolver = createResolver(import.meta.url)

    // Runtime config (server-only, never exposed to client)
    nuxt.options.runtimeConfig.torSocksUrl =
      options.torSocksUrl ??
      nuxt.options.runtimeConfig.torSocksUrl ??
      'socks5h://127.0.0.1:9050'

    nuxt.options.runtimeConfig.robosatsCoordinatorUrl =
      options.robosatsCoordinatorUrl ??
      nuxt.options.runtimeConfig.robosatsCoordinatorUrl ??
      'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion'

    // Auto-import composables (client-side crypto + identity)
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Server handlers (Tor proxy → RoboSats coordinator)
    const prefix = String(options.apiPrefix || '/api/rails/robosats').replace(/\/+$/, '')
    const seen = new Set()

    for (const ep of endpoints) {
      const method = String(ep.method).toUpperCase()
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : prefix

      const key = `${method} ${route}`
      if (seen.has(key)) throw new Error(`[robosats-rail] Duplicate endpoint: ${key}`)
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
        name: 'p2pay-rail-robosats',
        path: options.routeBase,
        file: resolver.resolve('./runtime/pages/robosats.vue')
      })
    })
  }
})
