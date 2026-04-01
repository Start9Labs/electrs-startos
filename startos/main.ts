import { FileHelper } from '@start9labs/start-sdk'
import { manifest } from 'bitcoind-startos/startos/manifest'
import { readFile } from 'fs/promises'
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
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, port, {
            successMessage: i18n(
              'Electrum server is ready and accepting connections',
            ),
            errorMessage: i18n('Electrum server is unreachable'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('sync', {
      ready: {
        display: i18n('Sync Progress'),
        fn: async () => {
          const loading = (message: string): { message: string; result: 'loading' } => ({ message, result: 'loading' })

          // 1. Check Bitcoin sync status
          const cookie = await readFile(
            `${electrsContainer.rootfs}/mnt/bitcoind/.cookie`,
            'utf-8',
          ).catch(() => null)

          if (!cookie) return loading('Cannot read Bitcoin cookie file')

          let bcInfo: {
            result?: {
              blocks: number
              headers: number
              initialblockdownload: boolean
            }
            error?: unknown
          }
          try {
            const res = await fetch('http://bitcoind.startos:8332/', {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain',
                Authorization: `Basic ${Buffer.from(cookie.trim()).toString('base64')}`,
              },
              body: JSON.stringify({
                jsonrpc: '1.0',
                id: 'sync-hck',
                method: 'getblockchaininfo',
                params: [],
              }),
            })
            bcInfo = await res.json()
          } catch (e) {
            return loading(`Error contacting Bitcoin RPC: ${e}`)
          }

          if (bcInfo.error) {
            return loading(
              `Bitcoin RPC returned error: ${JSON.stringify(bcInfo.error)}`,
            )
          }

          const { blocks, headers, initialblockdownload } = bcInfo.result!

          if (initialblockdownload) {
            const pct = Math.floor((blocks * 100) / headers)
            return loading(
              `Bitcoin blockchain is not fully synced yet: ${blocks} of ${headers} blocks (${pct}%)`,
            )
          }

          // 2. Get electrs prometheus metrics
          const promRes = await electrsContainer.exec(
            ['curl', '-sS', 'localhost:4224'],
            {},
          )

          if (promRes.exitCode !== 0) {
            return loading('Error contacting the electrs Prometheus RPC')
          }

          const promOutput = promRes.stdout.toString()

          // 3. Check for database compaction in progress
          const compRes = await electrsContainer.exec(
            [
              'sh',
              '-c',
              'tail -100000 /data/db/bitcoin/LOG 2>/dev/null | grep -E "ManualCompaction|compaction_finished"',
            ],
            {},
          )

          if (compRes.exitCode === 0) {
            const lines = compRes.stdout.toString().trim().split('\n')
            const lastCompaction = lines
              .filter((l) => l.includes('ManualCompaction'))
              .pop()
            const jobMatch = lastCompaction?.match(/"job":\s*(\d+)/)

            if (jobMatch) {
              const jobId = jobMatch[1]
              const isFinished = lines.some(
                (l) =>
                  l.includes(`"job": ${jobId}`) &&
                  l.includes('compaction_finished'),
              )

              if (!isFinished) {
                return loading(
                  'Finishing database compaction... This could take some hours depending on your hardware.',
                )
              }
            }
          }

          // 4. Check electrs sync height from prometheus
          const heightMatch = promOutput.match(
            /index_height\{[^}]*tip[^}]*\}\s+(\d+)/,
          )

          if (!heightMatch) {
            return loading(
              'The electrs Prometheus RPC is not yet returning the sync status',
            )
          }

          const syncedHeight = parseInt(heightMatch[1], 10)

          if (syncedHeight < blocks) {
            const pct = Math.floor((syncedHeight * 100) / headers)
            return loading(
              `Catching up to blocks from bitcoind. This should take at most a day. Progress: ${syncedHeight} of ${blocks} blocks (${pct}%)`,
            )
          }

          return { message: 'Fully synced', result: 'success' }
        },
      },
      requires: ['electrs'],
    })
})
