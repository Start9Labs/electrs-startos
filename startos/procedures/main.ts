import { sdk } from '../sdk'
import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { tcpPort } from './interfaces'

export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     */
    console.info('Starting electrs...')

    /**
     * ======================== Additional Health Checks (optional) ========================
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     */

    const SEARXNG_SECRET = await effects.runCommand([
      'openssl',
      'rand',
      '-hex',
      '32',
    ])

    return Daemons.of({
      effects,
      started,
      healthReceipts,
    })
      .addDaemon('electrs', {
        command: 'tini electrs',
        env: {
        },
        ready: {
          display: 'Electrum Server Interface',
          fn: () =>
            checkPortListening(effects, tcpPort, {
              successMessage: 'The Electrum server JSON RPC interface is ready',
              errorMessage: 'The Electrum server JSON RPC interface is not ready',
            }),
        },
        requires: [],
      })
  },
)