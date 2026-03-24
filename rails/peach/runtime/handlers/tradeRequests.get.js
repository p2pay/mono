import { getAccessToken } from '../lib/peachAuth.js'
import { peachFetch } from '../lib/peachRequest.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { offerId } = getQuery(event)
  const token = await getAccessToken(config)
  return peachFetch(`/v069/buyOffer/${offerId}/tradeRequestReceived/`, { baseUrl: config.peachBaseUrl, token })
})
