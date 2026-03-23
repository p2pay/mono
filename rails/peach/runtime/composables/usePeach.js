export const usePeach = () => {
  const getMe = () =>
    $fetch('/api/rails/peach/me')

  const postOffer = (currency, method, amount) =>
    $fetch('/api/rails/peach/offer', {
      method: 'POST',
      body: { currency, method, amount },
    })

  const getMatches = (offerId) =>
    $fetch('/api/rails/peach/matches', { query: { offerId } })

  return { getMe, postOffer, getMatches }
}
