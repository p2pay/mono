export default defineEventHandler((event) => {
  return {
    ok: true,
    mode: 'standalone',
    entryPoint: '/api/cors',
  }
})
