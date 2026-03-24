export const usePeach = () => {
  const getMe = () =>
    $fetch('/api/rails/peach/me')

  // paymentDetails: payer's payment identifier object (e.g. { iban: '...' } for SEPA)
  const postOffer = (currency, method, amount, paymentDetails) =>
    $fetch('/api/rails/peach/offer', {
      method: 'POST',
      body: { currency, method, amount, paymentDetails },
    })

  // Returns trade requests (potential sellers) for a given buyOfferId.
  // Each entry includes userId, symmetricKeyEncrypted, symmetricKeySignature, paymentMethod.
  const getTradeRequests = (offerId) =>
    $fetch('/api/rails/peach/trade-requests', { query: { offerId } })

  // Accepts a seller's trade request and shares encrypted fiat payment details.
  // buyOfferId and userId come from the trade request object.
  // symmetricKeyEncrypted: from the trade request — the AES key the seller generated, encrypted to our PGP pubkey.
  // paymentDetails: the payer's full payment data object (same one used in postOffer).
  const acceptTradeRequest = (buyOfferId, userId, symmetricKeyEncrypted, paymentDetails) =>
    $fetch('/api/rails/peach/trade-request/accept', {
      method: 'POST',
      body: { buyOfferId, userId, symmetricKeyEncrypted, paymentDetails },
    })

  // Poll this to check escrow funding status and contract progress
  const getContract = (contractId) =>
    $fetch('/api/rails/peach/contract', { query: { contractId } })

  // Call once fiat has been sent to the seller
  const confirmPayment = (contractId) =>
    $fetch('/api/rails/peach/contract/confirm-payment', {
      method: 'POST',
      body: { contractId },
    })

  return { getMe, postOffer, getTradeRequests, acceptTradeRequest, getContract, confirmPayment }
}
