import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const v_0_11_1_1_b5 = VersionInfo.of({
  version: '0.11.1:1-beta.5',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.65',
    es_ES: 'Actualización a StartOS SDK beta.65',
    de_DE: 'Update auf StartOS SDK beta.65',
    pl_PL: 'Aktualizacja do StartOS SDK beta.65',
    fr_FR: 'Mise à jour vers StartOS SDK beta.65',
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
