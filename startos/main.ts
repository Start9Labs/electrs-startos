import { FileHelper } from '@start9labs/start-sdk'
import { manifest } from 'bitcoin-core-startos/startos/manifest'
import { access } from 'fs/promises'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { port } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info(i18n('Starting Electrs!'))

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
        display: i18n('Electrum Server'),
        fn: async () => {
          const result = await sdk.healthCheck.checkPortListening(
            effects,
            port,
            {
              successMessage: i18n(
                'Electrum server is ready and accepting connections',
              ),
              errorMessage: i18n('Electrum server is unreachable'),
            },
          )

          if (result.result === 'success') return result

          // Port not listening — electrs is stuck in its bitcoind polling loop
          // until bitcoind finishes IBD. Report this as "waiting" so users see
          // an accurate status instead of a scary "unreachable" failure.
          const cookieExists = await access(
            `${electrsContainer.rootfs}/mnt/bitcoind/.cookie`,
          )
            .then(() => true)
            .catch(() => false)

          if (cookieExists) {
            return {
              result: 'waiting',
              message: i18n('Waiting for Bitcoin to finish syncing'),
            }
          }

          return {
            result: 'waiting',
            message: i18n('Waiting for Bitcoin to start'),
          }
        },
      },
      requires: [],
    })
    .addHealthCheck('sync', {
      ready: {
        display: i18n('Sync Progress'),
        fn: async () => {
          // Probe electrs's Electrum RPC with an index-requiring method.
          // Until the index is ready, electrs returns {"code": -32603, "message": "unavailable index"}.
          const probe = `exec 3<>/dev/tcp/127.0.0.1/${port}
printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"server.banner","params":[]}' >&3
read -t 10 line <&3
exec 3<&-
printf '%s' "$line"`

          const res = await electrsContainer.exec(['bash', '-c', probe], {})

          if (
            res.exitCode !== 0 ||
            res.stdout.toString().includes('unavailable index')
          ) {
            return {
              message: i18n(
                'Electrs is building its address index. This can take several hours on first run.',
              ),
              result: 'loading',
            }
          }

          return { message: i18n('Fully synced'), result: 'success' }
        },
      },
      requires: ['electrs'],
    })
})
