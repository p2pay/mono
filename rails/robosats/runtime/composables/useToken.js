import { Base16, Base91 } from 'base-ex'

export default () => {
  const bytesToBase64 = (bytes) => {
    if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64')
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  }

  const getRandomBytes = async (length) => {
    const c = globalThis.crypto
    if (c && typeof c.getRandomValues === 'function') {
      const arr = new Uint8Array(length)
      c.getRandomValues(arr)
      return arr
    }
    const { randomBytes } = await import('node:crypto')
    return new Uint8Array(randomBytes(length))
  }

  const genBase62Token = async (length) => {
    const bytes = await getRandomBytes(length * 2)
    return bytesToBase64(bytes).replace(/[+/=]/g, '').substring(0, length)
  }

  const hexToBase91 = (hex) => {
    const b16 = new Base16()
    const b91 = new Base91()
    return b91.encode(b16.decode(hex))
  }

  return {
    genBase62Token,
    hexToBase91,
  }
}
