import { defineEventHandler, setResponseStatus } from 'h3'
import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {

  const { corsTargetUrl, corsHealthPath } = useRuntimeConfig(event)

  try {
    await ofetch(`${corsTargetUrl}${corsHealthPath}`, {
      method: 'HEAD',
      timeout: 5000
    })

    return {
      ok: true,
      status: 'reachable',
      target: corsTargetUrl
    }
  } catch (err) {
    setResponseStatus(event, 503)
    return {
      ok: false,
      status: 'unreachable',
      error: err?.message
    }
  }
})
