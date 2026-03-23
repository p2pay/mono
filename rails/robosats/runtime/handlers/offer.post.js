import { getRobosatsCurrency } from '../lib/getRobosatsCurrency.js'
import { robosatsRequest } from '../lib/robosatsRequest.js'
import { defineEventHandler, getRequestHeader, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const authorization = await getRequestHeader(event, 'X-Robosats-Authorization')
  const { amount, currency, paymentMethods } = await readBody(event)
  const currencyIndex = getRobosatsCurrency(currency)

  return await robosatsRequest({
    authorization,
    method: 'POST',
    path: '/api/make/',
    body: {
      type: 0,
      currency: currencyIndex,
      amount,
      payment_method: paymentMethods,
      premium: 5
    }
  })
})
