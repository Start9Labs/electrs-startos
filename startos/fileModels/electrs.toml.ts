import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'
const { object, literal, literals, natural } = matches

const {
  cookie_file,
  daemon_p2p_addr,
  daemon_rpc_addr,
  network,
  electrum_rpc_addr,
  log_filters,
  index_batch_size,
  index_lookup_limit,
} = configDefaults

const shape = object({
  auth: literal(undefined).onMismatch(undefined), // disallow user/pass as it can't be used with cookie auth
  cookie_file: literal(cookie_file).onMismatch(cookie_file),
  daemon_rpc_addr: literal(daemon_rpc_addr).onMismatch(
    daemon_rpc_addr,
  ),
  daemon_p2p_addr: literal(daemon_p2p_addr).onMismatch(
    daemon_p2p_addr,
  ),
  network: literals(network).onMismatch(network),
  electrum_rpc_addr: literal(electrum_rpc_addr).onMismatch(electrum_rpc_addr),
  log_filters: literals('ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE').onMismatch(
    log_filters,
  ),
  index_batch_size: natural.optional().onMismatch(index_batch_size),
  index_lookup_limit: natural.optional().onMismatch(index_lookup_limit),
})

export const tomlFile = FileHelper.toml(
  {
    volumeId: 'main',
    subpath: 'electrs.toml',
  },
  shape.onMismatch(configDefaults),
)
