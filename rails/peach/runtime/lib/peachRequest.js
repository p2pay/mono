// Module-level token cache.
// Simple in-memory store — cleared on process restart.
// For stateless / edge deployments (e.g. Cloudflare Workers), replace with
// external KV storage (Cloudflare KV, Nitro useStorage, etc.)
let _token = null
let _tokenExpiry = 0

export const tokenCache = {
  get: () => (_token && Date.now() < _tokenExpiry ? _token : null),
  set: (token, expiry) => {
    _token = token
    // expiry is a Unix timestamp (seconds) from the Peach API
    _tokenExpiry = expiry * 1000
  },
}

export const peachFetch = async (path, { baseUrl, token, method = 'GET', body } = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Peach ${method} ${path} → ${response.status}: ${text}`)
  }

  return response.json()
}
