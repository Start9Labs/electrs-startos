import { sdk } from './sdk'
import { port } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multihost = sdk.MultiHost.of(effects, 'multihost')
  const mainMultiOrigin = await multihost.bindPort(port, {
    // @TODO confirm options
    protocol: null,
    addSsl: { preferredExternalPort: 50002, alpn: null },
    preferredExternalPort: port,
    secure: null,
  })
  const main = sdk.createInterface(effects, {
    name: 'Main',
    id: 'main',
    description: 'The main interface for accessing electrs',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })

  const mainReceipt = await mainMultiOrigin.export([main])

  return [mainReceipt]
})
