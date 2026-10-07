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
  'Bitcoin REST': 35,
  'Bitcoin does not serve the REST interface this version of Electrs reads blocks from. Bitcoin Core 31.1:17 or later serves it; Bitcoin Knots (pre-RDTS) does not. Downgrade Electrs to 0.11.1:20, switch Bitcoin to Bitcoin Core 31.1:17 or later, or run Fulcrum instead of Electrs.': 37,
  'Bitcoin is not installed': 38,
  'Electrum (SSL)': 32,
  'The Electrum protocol endpoint, served over SSL': 33,
  'Electrs requires an archival bitcoin node.': 7,
  'Log Level': 8,
  'How much Electrs writes to its logs. Each level includes everything in the levels above it.\n- Error: failures only\n- Warning: also conditions that may need attention\n- Info: also startup and sync progress\n- Debug: also every wallet connection, request and reply; noisy, for chasing a specific problem\n- Trace: everything Electrs can log; very noisy': 9,
  Configure: 16,
  'Set how much Electrs writes to its logs.': 17,
  Error: 18,
  Warning: 19,
  Info: 20,
  Debug: 21,
  Trace: 22,
  'Sync Complete': 29,
  'Electrs has finished building its address index. The Electrum server is ready.': 30,
  Reindex: 39,
  'Delete the address index and rebuild it from Bitcoin. Use this only if the index is corrupted: Electrs keeps crashing and its logs show a database error such as "Corruption" or "please reindex". If they say "client failed" instead, Bitcoin is not answering yet, and a reindex will not help. A slow or busy index is not a reason to reindex.': 40,
  'Electrs and every service that uses it are unavailable for several hours while the index rebuilds, which needs at least 120 GB of free space. If the logs show input/output errors, check your drive first: a rebuild on a failing drive fails the same way.': 41,
  'Electrs is restarting. It deletes its index and rebuilds it from Bitcoin, which takes several hours.': 42,
  'Electrs deletes its index and rebuilds it from Bitcoin the next time it starts.': 43,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
