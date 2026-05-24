import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const v_0_11_1_6 = VersionInfo.of({
  version: '0.11.1:6',
  releaseNotes: {
    en_US:
      'Fixes repeated "Sync Complete" notifications when electrs briefly flickered out of and back into the synced state.',
    es_ES:
      'Corrige notificaciones repetidas de "Sincronización completa" cuando electrs salía y volvía brevemente al estado sincronizado.',
    de_DE:
      'Behebt wiederholte „Sync Complete"-Benachrichtigungen, wenn electrs kurzzeitig aus dem synchronisierten Zustand fiel und wieder hineinkam.',
    pl_PL:
      'Naprawia powtarzające się powiadomienia „Sync Complete", gdy electrs chwilowo wypadał ze stanu zsynchronizowanego i do niego wracał.',
    fr_FR:
      "Corrige les notifications « Sync Complete » répétées lorsque electrs sortait brièvement de l'état synchronisé puis y revenait.",
  },
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            'log-filters': LogFilters
            'index-batch-size': number
            'index-lookup-limit': number
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        await tomlFile.write(effects, {
          cookie_file: '/mnt/bitcoind/.cookie',
          daemon_rpc_addr: 'bitcoind.startos:8332',
          daemon_p2p_addr: 'bitcoind.startos:8333',
          electrum_rpc_addr: '0.0.0.0:50001',
          network: 'bitcoin',
          log_filters: configYaml['log-filters'],
          index_batch_size: configYaml['index-batch-size'],
          index_lookup_limit: configYaml['index-lookup-limit'],
        })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
