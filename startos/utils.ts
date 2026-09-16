import { T } from '@start9labs/start-sdk'
import {
  rpcLocalHostId,
  rpcPortLocal,
} from 'bitcoin-core-startos/startos/utils'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const port = 50001

// Host id electrs binds its Electrum interface on. Exported so dependents
// (mempool/specter/canary) resolve electrs over the bridge without a literal.
export const electrumHostId = 'electrum'

export const logFilters = {
  ERROR: i18n('Error'),
  WARN: i18n('Warning'),
  INFO: i18n('Info'),
  DEBUG: i18n('Debug'),
  TRACE: i18n('Trace'),
}

export type LogFilters = keyof typeof logFilters

/** Bitcoin's direct RPC and REST endpoint over the LXC bridge. */
export const bitcoindRpc = (effects: T.Effects) =>
  sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: rpcLocalHostId,
      internalPort: rpcPortLocal,
    })
    .const()
