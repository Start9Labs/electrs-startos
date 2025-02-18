import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'
const { object, literal, literals, natural } = matches

const shape = object({
  cookie_file: literal('.bitcoin/.cookie').onMismatch('.bitcoin/.cookie'), // @TODO relative path?
  daemon_rpc_addr: literal('bitcoind.startos:8332').onMismatch(
    'bitcoind.startos:8332',
  ),
  daemon_p2p_addr: literal('bitcoind.startos:8333').onMismatch(
    'bitcoind.startos:8333',
  ),
  network: literals('bitcoin').onMismatch('bitcoin'),
  electrum_rpc_addr: literal('0.0.0.0:50001').onMismatch('0.0.0.0:50001'),
  log_filters: literals('ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE').onMismatch(
    'INFO',
  ),
  index_batch_size: natural.optional().onMismatch(10),
  index_lookup_limit: natural.optional().onMismatch(0),
})

export const tomlFile = FileHelper.yaml(
  '/media/startos/volumes/main/data/electrs.toml',
  shape.onMismatch(configDefaults),
)
