import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const shape = z.object({
  // Stripped: electrs exits if auth and cookie_file are both set
  auth: z.undefined().catch(undefined),
  cookie_file: z
    .literal('/mnt/bitcoind/.cookie')
    .catch('/mnt/bitcoind/.cookie'),
  // Dynamic: main.ts writes bitcoind's LXC-bridge host:port at startup (see
  // bitcoindRpc in utils.ts). Optional and absent while bitcoind is unresolved.
  daemon_rpc_addr: z.string().optional().catch(undefined),
  network: z.literal('bitcoin').catch('bitcoin'),
  electrum_rpc_addr: z.literal('0.0.0.0:50001').catch('0.0.0.0:50001'),
  log_filters: z
    .enum(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
    .catch('INFO'),
})

export const tomlFile = FileHelper.toml(
  {
    base: sdk.volumes.main,
    subpath: 'electrs.toml',
  },
  shape,
)
