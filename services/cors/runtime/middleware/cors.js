import {
  defineEventHandler,
  getMethod,
  getRequestHeader,
  setResponseHeaders,
  setResponseStatus
} from 'h3'

export default defineEventHandler((event) => {
  const origin = getRequestHeader(event, 'origin')

  if (origin) {
    setResponseHeaders(event, {
      'access-control-allow-origin': origin,
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'access-control-allow-headers': '*',
      'access-control-expose-headers': '*',
      'vary': 'Origin'
    })
  }

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
