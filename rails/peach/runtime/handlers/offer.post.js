import { createHash } from 'crypto'
import { getAccessToken } from '../lib/peachAuth.js'
import { signAddress, getPublicKeyHash } from '../lib/bitcoinSigner.js'
import { peachFetch } from '../lib/peachRequest.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { currency, method, amount } = await readBody(event)

  const token = await getAccessToken(config)

  // Get merchant peachId from account profile
  const { id: userId } = await peachFetch('/v1/user/me', {
    baseUrl: config.peachBaseUrl,
    token,
  })
  const peachId = userId.substring(0, 8)

  // Derive release address and sign the address-claim message
  const { address: releaseAddress, signature: messageSignature } = signAddress(
    config.peachBitcoinMnemonic,
    peachId
  )

  // Stable payment-data hash for this merchant + payment method combination
  const paymentDataHash = createHash('sha256')
    .update(getPublicKeyHash(config.peachBitcoinMnemonic) + method)
    .digest('hex')

  const meansOfPayment = { [currency]: [method] }
  const paymentData = { [method]: { hashes: [paymentDataHash] } }
  const sats = parseInt(parseFloat(amount) * 100_000_000)

  const { id: offerId } = await peachFetch('/v1/offer', {
    baseUrl: config.peachBaseUrl,
    token,
    method: 'POST',
    body: {
      type: 'bid',
      amount: [sats, sats],
      maxPremium: Number(config.peachMaxPremium),
      meansOfPayment,
      paymentData,
      releaseAddress,
      messageSignature,
    },
  })

  return { offerId }
})
