import { getAccessToken } from '../lib/peachAuth.js'
import { decryptMessage, encryptSymmetric, signMessage } from '../lib/pgpSigner.js'
import { peachFetch } from '../lib/peachRequest.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // buyOfferId: our buy offer ID
  // userId: the seller's Peach user ID (from the trade request object)
  // symmetricKeyEncrypted: the AES key the seller generated, PGP-encrypted to our public key
  // paymentDetails: the payer's payment data object (e.g. { iban: '...', beneficiary: '...' })
  const { buyOfferId, userId, symmetricKeyEncrypted, paymentDetails } = await readBody(event)

  const token = await getAccessToken(config)

  // Decrypt the symmetric key the seller encrypted to our PGP public key
  const symmetricKey = await decryptMessage(
    symmetricKeyEncrypted,
    config.peachPgpPrivateKey,
    config.peachPgpPassphrase
  )

  const paymentDataJson = JSON.stringify(paymentDetails)

  // Encrypt payment data with the seller's symmetric key (AES-128, matching the Peach app)
  const paymentDataEncrypted = await encryptSymmetric(paymentDataJson, symmetricKey)

  // Sign the payment data plaintext with our PGP private key so seller can verify authenticity
  const paymentDataSignature = await signMessage(
    config.peachPgpPrivateKey,
    config.peachPgpPassphrase,
    paymentDataJson
  )

  return peachFetch(`/v069/buyOffer/${buyOfferId}/tradeRequestReceived/${userId}/accept`, {
    baseUrl: config.peachBaseUrl,
    token,
    method: 'POST',
    body: { paymentDataEncrypted, paymentDataSignature },
  })
})
