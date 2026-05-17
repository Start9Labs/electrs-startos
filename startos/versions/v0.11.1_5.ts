import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const v_0_11_1_5 = VersionInfo.of({
  version: '0.11.1:5',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.5.2).',
    es_ES: 'Actualizaciones internas (start-sdk 1.5.2).',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.5.2).',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.5.2).',
    fr_FR: 'Mises à jour internes (start-sdk 1.5.2).',
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
