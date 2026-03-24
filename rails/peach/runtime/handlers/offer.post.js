import { getAccessToken } from '../lib/peachAuth.js'
import { signAddress } from '../lib/bitcoinSigner.js'
import { peachFetch } from '../lib/peachRequest.js'
import { getPaymentDataHashes } from '../lib/getPaymentDataHashes.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // paymentDetails: payer's payment identifier object (e.g. { iban: '...' } for SEPA)
  const { currency, method, amount, paymentDetails } = await readBody(event)

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

  // Hash the payer's payment identifier (IBAN, phone, etc.).
  // Peach uses these hashes to privately match buyers and sellers without exposing raw data.
  const hashes = getPaymentDataHashes(method, paymentDetails)

  const meansOfPayment = { [currency]: [method] }
  const paymentData = { [method]: { hashes } }
  const sats = parseInt(parseFloat(amount) * 100_000_000)

  const { id: offerId } = await peachFetch('/v069/buyOffer/', {
    baseUrl: config.peachBaseUrl,
    token,
    method: 'POST',
    body: {
      amount: sats,
      premium: Number(config.peachMaxPremium),
      meansOfPayment,
      paymentData,
      releaseAddresses: [releaseAddress],
      releaseAddressMessageSignatures: [messageSignature],
    },
  })

  return { offerId }
})
