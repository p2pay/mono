import { robosatsRequest } from '../lib/robosatsRequest.js'
import { defineEventHandler, getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const authorization = await getRequestHeader(event, 'x-robosats-authorization')

  return await robosatsRequest({
    authorization,
    path: '/api/robot/',
  })
})
