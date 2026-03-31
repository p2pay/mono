import { defineEventHandler, getRequestHeader, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {

  const { corsProxySecret } = useRuntimeConfig(event)
  const incomingSecretHeader = getRequestHeader(event, 'x-cors-secret')

  if (incomingSecretHeader !== corsProxySecret) {
    setResponseStatus(event, 403)
    return { error: 'Forbidden' }
  }
})
