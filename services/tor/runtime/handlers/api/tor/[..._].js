import {
  defineEventHandler,
  getQuery,
  getRequestHeaders,
  getMethod,
  readBody,
  setResponseStatus,
  setResponseHeaders
} from 'h3'

import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
])

const STRIP_RESPONSE_HEADERS = new Set([
  ...HOP_BY_HOP,
  'set-cookie',
  'content-encoding',
  'content-length'
])

function joinUrl(base, path) {
  const b = base.replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : '/' + path
  return b + p
}

function sanitizeOutgoingHeaders(incoming) {
  const headers = { ...incoming }

  for (const k of Object.keys(headers)) {
    const key = k.toLowerCase()
    if (HOP_BY_HOP.has(key)) delete headers[k]
  }

  delete headers.host
  delete headers['content-length']
  delete headers['accept-encoding']
  delete headers.origin
  delete headers.referer
  delete headers['x-tor-proxy-secret']

  return headers
}

function sanitizeIncomingResponseHeaders(inHeaders) {
  const headers = {}

  for (const [k, v] of Object.entries(inHeaders || {})) {
    const key = String(k).toLowerCase()
    if (STRIP_RESPONSE_HEADERS.has(key)) continue

    headers[key] = v
  }

  return headers
}

export default defineEventHandler(async (event) => {

  const { torProxySecret, robosatsCoordinatorUrl, torSocksUrl } = useRuntimeConfig()

  if (!torProxySecret || !robosatsCoordinatorUrl) {
    setResponseStatus(event, 500)
    return { error: 'Proxy misconfigured' }
  }

  const method = getMethod(event)
  const params = event.context.params._ || ''
  const query = getQuery(event)
  const incomingHeaders = getRequestHeaders(event)

  const targetUrl = joinUrl(robosatsCoordinatorUrl, `/${params}`)

  let body
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readBody(event)
  }

  const agent = new SocksProxyAgent(torSocksUrl)

  const resp = await got(targetUrl, {
    method,
    headers: sanitizeOutgoingHeaders(incomingHeaders),
    searchParams: query,
    json: body,
    responseType: 'buffer',
    timeout: { request: 30000 },
    retry: { limit: 0 },
    throwHttpErrors: false,
    agent: { http: agent, https: agent }
  })

  setResponseStatus(event, resp.statusCode)
  setResponseHeaders(event, sanitizeIncomingResponseHeaders(resp.headers))

  return resp.body
})
