export const endpointDefs = [
  { method: 'GET', route: '', file: 'api/tor/index.get.js' },
  { method: 'ALL', route: '**', file: 'api/tor/[..._].js' }
]
