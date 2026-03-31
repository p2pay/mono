import { defineEventHandler, getRequestHeader, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {

  const { torProxySecret } = useRuntimeConfig()
  const incomingSecretHeader = getRequestHeader(event, 'x-tor-proxy-secret')

  if (incomingSecretHeader !== torProxySecret) {
    setResponseStatus(event, 403)
    return { error: 'Forbidden' }
  }
})
