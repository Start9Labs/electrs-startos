import { matches } from '@start9labs/start-sdk'
import FileHelper from '@start9labs/start-sdk/lib/util/fileHelper'

const { object, literal, string, anyOf, natural } = matches

const tomlShape = object({
  daemon_rpc_addr: string,
  daemon_p2p_addr: string,
  network: string,
  electrum_rpc_addr: string,
  log_filters: anyOf(
    literal('ERROR'),
    literal('WARNING'),
    literal('INFO'),
    literal('DEBUG'),
    literal('TRACE'),
  ),
  index_batch_size: string,
  index_lookup_limit: string,
})

export const tomlFile = FileHelper.toml('/data/electrs.toml', tomlShape)

export const defaultToml: typeof tomlShape._TYPE = {
  daemon_rpc_addr: '',
  daemon_p2p_addr: '',
  network: 'bitcoin',
  electrum_rpc_addr: '0.0.0.0:50001',
  log_filters: 'INFO',
  index_batch_size: '',
  index_lookup_limit: '',
}
