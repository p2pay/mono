import { defineEventHandler, setResponseStatus } from 'h3'
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default defineEventHandler(async () => {
  const { torSocksUrl } = useRuntimeConfig()

  if (!torSocksUrl) {
    setResponseStatus(500)
    return { ok: false, error: 'TOR_SOCKS_URL missing' }
  }

  try {
    const agent = new SocksProxyAgent(torSocksUrl)

    // test if tor is installed and running against mulldav onion url
    const target = 'http://o54hon2e2vj6c7m3aqqu6uyece65by3vgoxxhlqlsvkmacw6a7m7kiad.onion'

    await got(target, {
      agent: { http: agent, https: agent },
      timeout: { request: 8000 },
      retry: { limit: 0 }
    })

    return {
      ok: true,
      tor: 'reachable',
      target
    }
  } catch (err) {
    setResponseStatus(503)
    return {
      ok: false,
      tor: 'unreachable',
      error: err?.message
    }
  }
})
