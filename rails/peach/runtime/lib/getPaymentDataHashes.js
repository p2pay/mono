import { createHash } from 'crypto'

// Maps each Peach payment method to the field(s) that identify the account holder.
// These are the values Peach hashes to privately match buyers and sellers.
const IDENTIFIER_FIELDS = {
  SEPA:             ['iban'],
  'SEPA-INSTANT':   ['iban'],
  WISE:             ['email', 'id'],
  REVOLUT:          ['id'],
  PAYPAL:           ['email'],
  TWINT:            ['phone'],
  MBWAY:            ['phone'],
  BIZUM:            ['phone'],
  SWISH:            ['phone'],
  VIPPS:            ['phone'],
  MOBILEPAY:        ['phone'],
  'M-PESA':         ['phone'],
  MOOV:             ['phone'],
  MTN:              ['phone'],
  'ORANGE-MONEY':   ['phone'],
  LIQUID:           ['address'],
  LNURL:            ['lnurl'],
  AMAZON_GIFT_CARD: ['code'],
}

const sha256 = (value) => createHash('sha256').update(String(value).toLowerCase()).digest('hex')

// Returns an array of hashes of the identifying fields for the given payment method.
// details is an object with the payer's payment identifiers (e.g. { iban: '...' }).
// Throws if no identifier fields are found (prevents posting a broken offer).
export const getPaymentDataHashes = (method, details) => {
  const fields = IDENTIFIER_FIELDS[method.toUpperCase()]

  if (!fields) {
    // Unknown method: hash all non-type values as a best-effort fallback
    const values = Object.entries(details)
      .filter(([k]) => k !== 'type')
      .map(([, v]) => v)
    if (!values.length) throw new Error(`[peach] No payment details found for method: ${method}`)
    return values.map(sha256)
  }

  const hashes = fields
    .filter((f) => details[f] !== undefined && details[f] !== '')
    .map((f) => sha256(details[f]))

  if (!hashes.length) {
    throw new Error(`[peach] Payment details missing required field(s) [${fields.join(', ')}] for method: ${method}`)
  }

  return hashes
}
