import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const current = VersionInfo.of({
  version: '0.11.1:7',
  releaseNotes: {
    en_US: `- Fixes the sync status falsely reporting "Fully synced" while the address index was still building.
- Shows an accurate Electrum server status during startup.`,
    es_ES: `- Corrige el estado de sincronización que indicaba falsamente "Totalmente sincronizado" mientras aún se construía el índice de direcciones.
- Muestra un estado preciso del servidor Electrum durante el inicio.`,
    de_DE: `- Behebt die Synchronisierungsanzeige, die fälschlicherweise „Vollständig synchronisiert" meldete, während der Adressindex noch aufgebaut wurde.
- Zeigt während des Starts einen korrekten Status des Electrum-Servers an.`,
    pl_PL: `- Naprawia status synchronizacji, który błędnie pokazywał „W pełni zsynchronizowano", gdy indeks adresów był jeszcze budowany.
- Pokazuje dokładny status serwera Electrum podczas uruchamiania.`,
    fr_FR: `- Corrige l'état de synchronisation indiquant à tort « Entièrement synchronisé » alors que l'index d'adresses était encore en construction.
- Affiche un état précis du serveur Electrum au démarrage.`,
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
