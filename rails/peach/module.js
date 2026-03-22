import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@p2payto/peach',
    configKey: 'p2payPeachRail'
  },
  defaults: {
    enabled: true,
    routeBase: '/rails/peach'
  },
  setup(options, nuxt) {
    if (options.enabled === false) return

    const resolver = createResolver(import.meta.url)

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'p2pay-rail-peach',
        path: options.routeBase,
        file: resolver.resolve('./runtime/pages/peach.vue')
      })
    })

    addServerHandler({
      route: '/api/rails/peach',
      handler: resolver.resolve('./runtime/server/api/peach.get.js')
    })
  }
})
