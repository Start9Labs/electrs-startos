import { sdk } from '../sdk'
import { configSpec } from './config/spec'

export const rpcPort = 50001
export const rpcId = 'rpc'

export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, utils, input }) => {
    const multi = utils.host.multi('multi')
    const multiOrigin = await multi.bindPort(rpcPort, { protocol: '' }) //@TODO: json rpc raw tcp need to specify
    const multiInterface = utils.createInterface({
      name: 'JSON RPC',
      id: rpcId,
      description: 'Electrum RPC Interface',
      hasPrimary: false,
      disabled: false,
      ui: false,
      username: null,
      path: '',
      search: {},
    })

    const multiReceipt = await multiInterface.export([multiOrigin])

    return [multiReceipt]
  },
)
