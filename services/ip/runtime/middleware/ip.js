import { createError, getRequestHeader, setResponseHeader } from 'h3'
import countryToCurrency from 'country-to-currency'
import { getRealIp } from '../utils/getRealIp.js'

// In-memory rate limit buckets
const buckets = new Map()

const CF_SECRET_HEADER = 'x-cf-origin-token'
const CF_INVALID = new Set(['T1', 'XX'])

const isRateLimited = (path) => {
  const p = String(path || '').split('?')[0]
  if (!p.startsWith('/api/')) return false
  if (p.startsWith('/api/_')) return false
  if (p.includes('__nuxt')) return false
  const segs = p.split('/').filter(Boolean)
  if (segs.includes('webhook') || segs.includes('webhooks')) return false
  return true
}

const hit = ({ key, limit, windowMs }) => {
  const now = Date.now()
  const k = String(key || 'unknown')
  const entry = buckets.get(k)

  if (!entry || (now - entry.start) > windowMs) {
    buckets.set(k, { start: now, count: 1 })
    return { ok: true, remaining: limit - 1, resetMs: windowMs }
  }

  entry.count += 1
  buckets.set(k, entry)

  const remaining = Math.max(0, limit - entry.count)
  const resetMs = windowMs - (now - entry.start)
  return { ok: entry.count <= limit, remaining, resetMs }
}

const getCfCountry = (event, cloudflareSecret) => {
  if (cloudflareSecret) {
    const token = getRequestHeader(event, CF_SECRET_HEADER)
    if (token !== cloudflareSecret) return undefined
  }

  const cfCountry = getRequestHeader(event, 'cf-ipcountry')
  if (!cfCountry || CF_INVALID.has(cfCountry)) return undefined
  return cfCountry
}

const getIpinfoData = async (event, ipinfoApiKey) => {
  const ip = getRealIp(event)
  if (!ip) return {}

  try {
    const res = await $fetch(`https://api.ipinfo.io/lite/${ip}`, {
      query: { token: ipinfoApiKey }
    })
    const country = res?.country_code || undefined
    const currency = country ? countryToCurrency[country] : undefined
    return { country, currency }
  } catch {
    return {}
  }
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const config = runtimeConfig.ipDetection
  if (!config) return

  const {
    country: countryEnabled,
    currency: currencyEnabled,
    cloudflareSecret,
    rateLimit,
    limitPaths
  } = config

  const ipinfoApiKey = runtimeConfig.ipinfoApiKey

  const path = event.path || ''

  // Rate limiting
  const shouldLimit = limitPaths.length > 0
    ? limitPaths.some(p => path.startsWith(p))
    : isRateLimited(path)

  if (shouldLimit) {
    const ip = getRealIp(event) || 'unknown'
    const rl = hit({ key: ip, limit: rateLimit, windowMs: 60_000 })

    setResponseHeader(event, 'x-ratelimit-limit', String(rateLimit))
    setResponseHeader(event, 'x-ratelimit-remaining', String(rl.remaining))
    setResponseHeader(event, 'x-ratelimit-reset-ms', String(rl.resetMs))

    if (!rl.ok) {
      throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
    }
  }

  // IP detection (only if at least one of country/currency is enabled)
  if (!countryEnabled && !currencyEnabled) return

  const result = { ip: getRealIp(event) }

  // CF and IPinfo run in parallel when both are configured
  const [cfCountry, ipinfoData] = await Promise.all([
    Promise.resolve(getCfCountry(event, cloudflareSecret)),
    ipinfoApiKey ? getIpinfoData(event, ipinfoApiKey) : Promise.resolve({})
  ])

  if (countryEnabled) {
    result.country = cfCountry || undefined
    if (ipinfoApiKey) result.countryIPinfo = ipinfoData.country
  }

  if (currencyEnabled) {
    result.currency = cfCountry ? countryToCurrency[cfCountry] : undefined
    if (ipinfoApiKey) result.currencyIPinfo = ipinfoData.currency
  }

  event.context.ipDetection = result
})
