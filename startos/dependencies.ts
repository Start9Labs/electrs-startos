import { autoconfig } from 'bitcoind-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      value: {
        prune: 0,
      },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n('Electrs requires an archival bitcoin node.'),
  })

  return {
    bitcoind: {
      healthChecks: ['bitcoind'],
      kind: 'running',
      versionRange: '>=28.3:0-beta.0',
    },
  }
})
