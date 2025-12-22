import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { port } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info('Starting Electrs!')

  const electrsContainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'electrs' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      })
      .mountAssets({
        subpath: null,
        mountpoint: '/assets',
        type: 'directory',
      })
      .mountDependency<typeof manifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: '/mnt/bitcoind',
        readonly: true,
      }),
    'electrs',
  )

  // Restart if Bitcoin .cookie changes
  await FileHelper.string(`${electrsContainer.rootfs}/mnt/bitcoind/.cookie`)
    .read()
    .const(effects)

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects)
    .addDaemon('electrs', {
      subcontainer: electrsContainer,
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
          const res = await electrsContainer.exec(
            ['sh', '/assets/scripts/check-synced.sh'],
            {
              env: {
                ROOT_FS: electrsContainer.rootfs,
              },
            },
          )
          if (res.exitCode === 61) {
            return { message: res.stdout.toString(), result: 'loading' }
          }
          if (res.exitCode === 0) {
            return { message: res.stdout.toString(), result: 'success' }
          }
          return { message: res.stderr.toString(), result: 'failure' }
        },
      },
      requires: ['electrs'],
    })
})
