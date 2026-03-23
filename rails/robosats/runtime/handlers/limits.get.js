import { getRobosatsCurrency } from '../lib/getRobosatsCurrency.js'
import { robosatsRequest } from '../lib/robosatsRequest.js'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { currency } = getQuery(event)
  const currencyIndex = getRobosatsCurrency(currency)

  const response = await robosatsRequest({
    path: '/api/limits/',
  })

  return response[currencyIndex]
})
