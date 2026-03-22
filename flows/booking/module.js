import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@p2payto/booking-flow',
    configKey: 'p2payBookingFlow'
  },
  defaults: {
    enabled: true,
    routeBase: '/flows/booking'
  },
  setup(options, nuxt) {
    if (options.enabled === false) return

    const resolver = createResolver(import.meta.url)

    if (!nuxt.options.modules.includes('@nuxt/ui')) {
      nuxt.options.modules.push('@nuxt/ui')
    }

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./runtime/composables'))

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'p2pay-flow-booking',
        path: options.routeBase,
        file: resolver.resolve('./runtime/pages/booking.vue')
      })

      pages.push({
        name: 'p2pay-flow-booking-embed',
        path: `${options.routeBase}/embed`,
        file: resolver.resolve('./runtime/pages/booking-embed.vue')
      })
    })
  }
})
