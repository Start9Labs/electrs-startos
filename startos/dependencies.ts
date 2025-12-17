import { sdk } from './sdk'
import { otherConfig } from 'bitcoind-startos/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', otherConfig, 'critical', {
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
      versionRange: '>=29.1:2-beta.0',
    },
  }
})
