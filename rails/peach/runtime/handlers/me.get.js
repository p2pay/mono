import { getAccessToken } from '../lib/peachAuth.js'
import { peachFetch } from '../lib/peachRequest.js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const token = await getAccessToken(config)
  return peachFetch('/v1/user/me', { baseUrl: config.peachBaseUrl, token })
})
