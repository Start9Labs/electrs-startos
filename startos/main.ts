import { FileHelper } from '@start9labs/start-sdk'
import { manifest } from 'bitcoin-core-startos/startos/manifest'
import { rm } from 'fs/promises'
import { tomlFile } from './fileModels/electrs.toml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { bitcoindRpc, legacyIndex, port } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   */
  console.info(i18n('Starting Electrs!'))

  let syncNotified =
    (await storeJson.read((s) => s.syncNotified).once()) ?? false
  let everSynced = (await storeJson.read((s) => s.everSynced).once()) ?? false

  // Null while Bitcoin publishes no rpc-local binding; .const() restarts main when it appears.
  const rpc = await bitcoindRpc(effects)
  if (!rpc) {
    return sdk.Daemons.of(effects).addHealthCheck('bitcoind-rest', {
      ready: {
        display: i18n('Bitcoin REST'),
        gracePeriod: 0,
        trigger: sdk.trigger.cooldownTrigger(60_000),
        fn: async () =>
          (
            await sdk.checkDependencies(effects, ['bitcoind'])
          ).installedSatisfied('bitcoind')
            ? {
                result: 'failure',
                message: i18n(
                  'Bitcoin does not serve the REST interface this version of Electrs reads blocks from. Bitcoin Core 31.1:17 or later serves it; Bitcoin Knots (pre-RDTS) does not. Downgrade Electrs to 0.11.1:20, switch Bitcoin to Bitcoin Core 31.1:17 or later, or run Fulcrum instead of Electrs.',
                ),
              }
            : { result: 'loading', message: i18n('Bitcoin is not installed') },
      },
      requires: [],
    })
  }
  await rm(legacyIndex, { recursive: true, force: true })
  await tomlFile.merge(effects, { daemon_rpc_addr: rpc })

  const electrsContainer = sdk.SubContainer.of(
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

  // Restart only when bitcoind writes a replacement cookie — an absent cookie
  // means bitcoind is down.
  const rootfs = await electrsContainer.rootfs
  await FileHelper.string(`${rootfs}/mnt/bitcoind/.cookie`)
    .read(
      (cookie) => cookie,
      (prev, next) => next === null || prev === next,
    )
    .const(effects)

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects)
    .addOneshot('tw-reuse', {
      subcontainer: electrsContainer,
      // Workaround for bindex opening a connection per block; remove per #89.
      exec: {
        command: ['sh', '-c', 'echo 1 > /proc/sys/net/ipv4/tcp_tw_reuse'],
      },
      requires: [],
    })
    .addDaemon('electrs', {
      subcontainer: electrsContainer,
      exec: { command: ['electrs'] },
      ready: {
        display: i18n('Electrum Server'),
        fn: async () => {
          // checkPortListening reads /proc/net/tcp* — it succeeds as soon as
          // electrs binds the Electrum port, which it does at startup BEFORE
          // blocking on the bitcoind IBD wait (electrs/src/server.rs binds the
          // listener before Rpc::new connects to bitcoind). So the port is open
          // throughout that wait; a not-listening result just means electrs hasn't
          // bound the socket yet — it's still starting, not blocked on bitcoind.
          const result = await sdk.healthCheck.checkPortListening(
            effects,
            port,
            {
              successMessage: i18n(
                'Electrum server is ready and accepting connections',
              ),
              errorMessage: i18n('Electrum server is starting'),
            },
          )

          return result.result === 'success'
            ? result
            : {
                result: 'starting',
                message: i18n('Electrum server is starting'),
              }
        },
      },
      requires: ['tw-reuse'],
    })
    .addHealthCheck('sync', {
      ready: {
        display: i18n('Sync Progress'),
        fn: async () => {
          const unavailable = () => ({
            message: everSynced
              ? i18n(
                  'Electrs is not responding. It is likely busy indexing; this usually clears on its own.',
                )
              : i18n(
                  'Electrs is building its address index. This can take several hours on first run.',
                ),
            result: 'loading' as const,
          })

          const chainInfo = await electrsContainer.exec([
            'curl',
            '--fail',
            '--max-time',
            '10',
            '--silent',
            '--show-error',
            `http://${rpc}/rest/chaininfo.json`,
          ])
          if (chainInfo.exitCode !== 0) return unavailable()

          let bitcoinHeight: number
          try {
            const parsed = JSON.parse(chainInfo.stdout.toString()) as {
              blocks?: unknown
            }
            if (
              typeof parsed.blocks !== 'number' ||
              !Number.isSafeInteger(parsed.blocks) ||
              parsed.blocks < 0
            ) {
              return unavailable()
            }
            bitcoinHeight = parsed.blocks
          } catch {
            return unavailable()
          }

          // block.header fails safely before the first batch; headers.subscribe
          // unwraps an empty tip and would crash electrs in that window.
          const probe = `exec 3<>/dev/tcp/127.0.0.1/${port} || exit 1
printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"blockchain.block.header","params":[0]}' >&3
IFS= read -t 10 -r line <&3 || exit 2
case "$line" in *'"result"'*) ;; *) printf '%s' "$line"; exit 0;; esac
printf '%s\\n' '{"jsonrpc":"2.0","id":2,"method":"blockchain.headers.subscribe","params":[]}' >&3
IFS= read -t 10 -r line <&3 || exit 2
printf '%s' "$line"`

          for (let attempt = everSynced ? 3 : 1; attempt > 0; attempt--) {
            const res = await electrsContainer.exec(['bash', '-c', probe], {})
            if (res.exitCode !== 0) continue

            try {
              const parsed = JSON.parse(res.stdout.toString()) as {
                result?: { height?: unknown }
              }
              const indexedHeight = parsed.result?.height
              if (
                typeof indexedHeight !== 'number' ||
                !Number.isSafeInteger(indexedHeight) ||
                indexedHeight < 0
              ) {
                continue
              }

              if (indexedHeight >= bitcoinHeight - 1) {
                if (!everSynced) {
                  await storeJson.merge(effects, { everSynced: true })
                  everSynced = true
                }
                return { message: i18n('Fully synced'), result: 'success' }
              }

              return {
                message: i18n(
                  'Electrs has indexed through block ${indexed}; Bitcoin is at block ${tip}.',
                  { indexed: indexedHeight, tip: bitcoinHeight },
                ),
                result: 'loading' as const,
              }
            } catch {}
          }

          return unavailable()
        },
      },
      requires: ['electrs'],
    })
    .addOneshot('synced-true', {
      subcontainer: null,
      exec: {
        fn: async () => {
          // The SDK re-fires this oneshot every time the sync health check
          // dips out of success and recovers (TCP probe blips). The closure
          // flag is the source of truth within a main lifecycle; the on-disk
          // flag re-seeds it on next startup.
          if (syncNotified) return null
          await sdk.notification.create(effects, {
            level: 'success',
            title: i18n('Sync Complete'),
            message: i18n(
              'Electrs has finished building its address index. The Electrum server is ready.',
            ),
          })
          await storeJson.merge(effects, { syncNotified: true })
          syncNotified = true
          return null
        },
      },
      requires: ['sync'],
    })
})
