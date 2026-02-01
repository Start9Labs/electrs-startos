export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Electrs!': 0,
  'Electrum Server': 1,
  'Electrum server is ready and accepting connections': 2,
  'Electrum server is unreachable': 3,
  'Sync Progress': 4,
  'Main': 5,
  'The main interface for accessing electrs': 6,
  'Electrs requires an archival bitcoin node.': 7,
  'Log Level': 8,
  'Select the level of log verbosity. Less is usually better.': 9,
  'Index Batch Size': 10,
  'Maximum number of blocks to request from bitcoind per batch.': 11,
  'blocks': 12,
  'Index Lookup Limit': 13,
  "Number of transactions to lookup before returning an error, to prevent 'too popular' addresses from causing the RPC server to time out. Enter '0' for no limit.": 14,
  'transactions': 15,
  'Configure': 16,
  'Customize your electrs Electrum server': 17,
  'Error': 18,
  'Warning': 19,
  'Info': 20,
  'Debug': 21,
  'Trace': 22,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
