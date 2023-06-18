import { sdk } from '../sdk'
import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { rpcPort } from './interfaces'
import { dependencyMounts } from './dependencies/dependencyMounts'

export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     */
    console.info('Starting electrs...')

    await utils.mountDependencies(dependencyMounts.bitcoind)

    /**
     * ======================== Additional Health Checks (optional) ========================
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     */
    const ELECTRS_ELECTRUM_USER = await utils.vault.get('rpcUser').const()
    const ELECTRS_ELECTRUM_PASSWORD = await utils.vault
      .get('rpcPassword')
      .const()

    return Daemons.of({
      effects,
      started,
      healthReceipts,
    }).addDaemon('electrs', {
      command: 'tini electrs',
      env: {
        ELECTRS_ELECTRUM_USER,
        ELECTRS_ELECTRUM_PASSWORD,
      },
      ready: {
        display: 'Electrum Server Interface',
        fn: () =>
          checkPortListening(effects, rpcPort, {
            successMessage: 'The Electrum server JSON RPC interface is ready',
            errorMessage: 'The Electrum server JSON RPC interface is not ready',
          }),
      },
      requires: [],
    })
  },
)
