import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { port } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info('Starting Electrs!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'electrs' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      })
      .mountDependency<typeof manifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: '/mnt/bitcoind',
        readonly: true,
      }),
    'primary',
  )

  // Restart if Bitcoin .cookie changes
  await FileHelper.string(`${subcontainer.rootfs}/mnt/bitcoin/.cookie`)
    .read()
    .const(effects)

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects, started)
    .addDaemon('primary', {
      subcontainer,
      exec: { command: ['electrs'] },
      ready: {
        display: 'Electrum Server',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, port, {
            successMessage:
              'Electrum server is ready and accepting connections',
            errorMessage: 'Electrum server is unreachable',
          }),
      },
      requires: [],
    })
    .addHealthCheck('sync', {
      ready: {
        display: 'Sync Progress',
        fn: async () => {
          // @TODO convert script to ts
          const res = await subcontainer.exec(['./assets/check-synched.sh'])
          if (res.exitCode === 61) 
            return { message: res.stdout.toString(), result: 'loading' }
          if (res.stderr)
            return { message: res.stderr.toString(), result: 'failure' }
          return { message: 'Fully synced', result: 'success' }
        },
      },
      requires: ['primary'],
    })
})
