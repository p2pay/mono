import { signMessage as bitcoinSignMessage, getPublicKeyHash } from './bitcoinSigner.js'
import { signMessage as pgpSignMessage } from './pgpSigner.js'
import { tokenCache, peachFetch } from './peachRequest.js'

// After first registration, upload the merchant's PGP public key to the Peach account.
const updateUserPgp = async (config, accessToken) => {
  const message = 'foo bar'
  const pgpSignature = await pgpSignMessage(
    config.peachPgpPrivateKey,
    config.peachPgpPassphrase,
    message
  )
  const { signature } = bitcoinSignMessage(config.peachBitcoinMnemonic, config.peachPgpPublicKey)
  await peachFetch('/v1/user', {
    baseUrl: config.peachBaseUrl,
    token: accessToken,
    method: 'PATCH',
    body: {
      pgpPublicKey: config.peachPgpPublicKey,
      message,
      pgpSignature,
      signature,
      referralCode: config.peachReferralCode,
      feeRate: config.peachFeeRate,
    },
  })
}

// Returns a valid Peach access token for the merchant account.
// On first call: tries to register (creates a new account), then uploads PGP key.
// If already registered: falls back to auth (re-authenticates with existing account).
// Subsequent calls within the token TTL return the cached token.
export const getAccessToken = async (config) => {
  const cached = tokenCache.get()
  if (cached) return cached

  const message = `Peach Registration ${Date.now()}`
  const { publicKey, signature } = bitcoinSignMessage(config.peachBitcoinMnemonic, message)

  try {
    // First-time registration — uniqueId is a stable hash of the merchant public key
    const uniqueId = getPublicKeyHash(config.peachBitcoinMnemonic).substring(0, 16)
    const { expiry, accessToken } = await peachFetch('/v1/user/register/', {
      baseUrl: config.peachBaseUrl,
      method: 'POST',
      body: { message, signature, publicKey, uniqueId },
    })
    tokenCache.set(accessToken, expiry)
    await updateUserPgp(config, accessToken)
    return accessToken
  } catch {
    // Account already exists — re-authenticate
    const { expiry, accessToken } = await peachFetch('/v1/user/auth/', {
      baseUrl: config.peachBaseUrl,
      method: 'POST',
      body: { message, signature, publicKey },
    })
    tokenCache.set(accessToken, expiry)
    return accessToken
  }
}
