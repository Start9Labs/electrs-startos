import { sdk } from './sdk'
import { config } from 'bitcoind-startos/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', config, 'important', {
    input: {
      kind: 'partial',
      value: {
        prune: 0,
      },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: 'Electrs requires an archival bitcoin node.',
  })

  return {
    bitcoind: {
      healthChecks: [],
      kind: 'running',
      versionRange: '>=28.0.3:1',
    },
  }
})
