export const endpointDefs = [
  { method: 'GET', route: '', file: 'api/cors/index.get.js' },
  { method: 'ALL', route: '**', file: 'api/cors/[..._].js' }
]
