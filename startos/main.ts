import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { port } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Electrs!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'electrs' },
    sdk.Mounts.of()
      .addVolume('main', null, '/data', false)
      .addDependency<
        typeof manifest
      >('bitcoind', 'main', '/.bitcoin', '/.bitcoin', true),
    'primary',
  )

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */

  const syncCheck = sdk.HealthCheck.of(effects, {
    id: 'sync',
    name: 'Sync Progress',
    fn: async () => {
      // @TODO write function
      const res = await subcontainer.exec([])
      return { message: 'health check succeeded', result: 'success' }
    },
  })

  const healthReceipts: T.HealthCheck[] = [syncCheck]

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, healthReceipts).addDaemon('primary', {
    subcontainer,
    command: ['electrs'],
    ready: {
      display: 'Electrum Server',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, port, {
          successMessage: 'Electrum server is ready and accepting connections',
          errorMessage: 'Electrum server is unreachable',
        }),
    },
    requires: [],
  })
})
