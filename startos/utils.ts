import { i18n } from './i18n'

export const port = 50001

export const logFilters = {
  ERROR: i18n('Error'),
  WARN: i18n('Warning'),
  INFO: i18n('Info'),
  DEBUG: i18n('Debug'),
  TRACE: i18n('Trace'),
}

export type LogFilters = keyof typeof logFilters

export const configDefaults = {
  cookie_file: '/mnt/bitcoind/.cookie' as const,
  daemon_rpc_addr: 'bitcoind.startos:8332' as const,
  daemon_p2p_addr: 'bitcoind.startos:8333' as const,
  network: 'bitcoin' as const,
  electrum_rpc_addr: '0.0.0.0:50001' as const,
  log_filters: 'INFO' as LogFilters,
  index_batch_size: 10,
  index_lookup_limit: 0,
}
