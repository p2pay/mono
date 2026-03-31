export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    // Get per-request runtime config (Nitro)
    const rc = useRuntimeConfig(event)

    // Cloudflare Workers (module) runtime env/secrets
    const env = event.context.cloudflare?.env
    if (!env) return

    // Override ONLY if present at runtime
    if (env.NUXT_CORS_PROXY_SECRET != null && env.NUXT_CORS_PROXY_SECRET !== '') {
      rc.corsProxySecret = env.NUXT_CORS_PROXY_SECRET
    }

    if (env.NUXT_CORS_TARGET_URL != null && env.NUXT_CORS_TARGET_URL !== '') {
      rc.corsTargetUrl = env.NUXT_CORS_TARGET_URL
    }

    if (env.NUXT_CORS_HEALTH_PATH != null && env.NUXT_CORS_HEALTH_PATH !== '') {
      rc.corsHealthPath = env.NUXT_CORS_HEALTH_PATH
    }
  })
})
