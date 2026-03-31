export default defineEventHandler((event) => {
  return {
    ok: true,
    mode: 'standalone',
    moduleEntryPoint: '/api/tor',
  }
})
