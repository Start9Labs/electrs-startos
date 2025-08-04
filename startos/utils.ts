export const port = 50001

export const logFilters = {
  ERROR: 'Error',
  WARN: 'Warning',
  INFO: 'Info',
  DEBUG: 'Debug',
  TRACE: 'Trace',
}

export type LogFilters = keyof typeof logFilters

export const configDefaults = {
  auth: '',
  cookie_file: '/mnt/bitcoind/.cookie' as const,
  daemon_rpc_addr: 'bitcoind.startos:8332' as const,
  daemon_p2p_addr: 'bitcoind.startos:8333' as const,
  network: 'bitcoin' as const,
  electrum_rpc_addr: '0.0.0.0:50001' as const,
  log_filters: 'INFO' as LogFilters,
  index_batch_size: 10,
  index_lookup_limit: 0,
}
