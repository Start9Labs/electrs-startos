import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { LogFilters } from '../../utils'
import { tomlFile } from '../../fileModels/electrs.toml'

export const v_0_11_1_1_b0 = VersionInfo.of({
  version: '0.11.1:1-beta.0',
  releaseNotes: {
    en_US:
      'Update to upstream v0.11.1: API compliance fix for transaction.id_from_pos, dependency updates.',
    es_ES:
      'Actualización a upstream v0.11.1: corrección de cumplimiento de API para transaction.id_from_pos, actualizaciones de dependencias.',
    de_DE:
      'Update auf upstream v0.11.1: API-Konformitätsfix für transaction.id_from_pos, Abhängigkeitsaktualisierungen.',
    pl_PL:
      'Aktualizacja do upstream v0.11.1: poprawka zgodności API dla transaction.id_from_pos, aktualizacje zależności.',
    fr_FR:
      'Mise à jour vers upstream v0.11.1 : correction de conformité API pour transaction.id_from_pos, mises à jour des dépendances.',
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
