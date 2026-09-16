export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Electrs!': 0,
  'Electrum Server': 1,
  'Electrum server is ready and accepting connections': 2,
  'Electrum server is starting': 3,
  'Electrs is building its address index. This can take several hours on first run.': 25,
  'Electrs is not responding. It is likely busy indexing; this usually clears on its own.': 31,
  'Electrs has indexed through block ${indexed}; Bitcoin is at block ${tip}.': 34,
  'Fully synced': 26,
  'Sync Progress': 4,
  'Electrum (SSL)': 32,
  'The Electrum protocol endpoint, served over SSL': 33,
  'Electrs requires an archival bitcoin node.': 7,
  'Log Level': 8,
  'Select the level of log verbosity. Less is usually better.': 9,
  Configure: 16,
  'Customize your electrs Electrum server': 17,
  Error: 18,
  Warning: 19,
  Info: 20,
  Debug: 21,
  Trace: 22,
  'Sync Complete': 29,
  'Electrs has finished building its address index. The Electrum server is ready.': 30,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
