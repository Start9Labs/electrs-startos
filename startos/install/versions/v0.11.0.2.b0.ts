import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { LogFilters } from '../../utils'
import { tomlFile } from '../../fileModels/electrs.toml'
import { configDefaults } from '../../utils'

const {
  cookie_file,
  daemon_p2p_addr,
  daemon_rpc_addr,
  network,
  electrum_rpc_addr,
} = configDefaults

export const v0_11_0_2_b0 = VersionInfo.of({
  version: '0.11.0:2-beta.0',
  releaseNotes: {
    en_US: 'Updated StartOS packaging',
    es_ES: 'Actualizado el empaquetado de StartOS',
    de_DE: 'StartOS-Paketierung aktualisiert',
    pl_PL: 'Zaktualizowano pakietowanie StartOS',
    fr_FR: 'Mise à jour du packaging StartOS',
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
          cookie_file,
          daemon_rpc_addr,
          daemon_p2p_addr,
          electrum_rpc_addr,
          network,
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
