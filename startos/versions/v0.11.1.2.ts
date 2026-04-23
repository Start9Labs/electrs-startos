import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { LogFilters } from '../utils'

export const v_0_11_1_2 = VersionInfo.of({
  version: '0.11.1:2',
  releaseNotes: {
    en_US:
      'Internal updates (start-sdk 1.2.0). Health checks: removed Bitcoin RPC polling — sync progress now uses electrs own readiness signal, and the daemon reports "waiting" (not "failure") while Bitcoin finishes its initial block download.',
    es_ES:
      'Actualizaciones internas (start-sdk 1.2.0). Comprobaciones de estado: se eliminó el sondeo RPC a Bitcoin — el progreso de sincronización ahora usa la señal de disponibilidad propia de electrs, y el daemon informa "en espera" (no "fallo") mientras Bitcoin termina su descarga inicial de bloques.',
    de_DE:
      'Interne Aktualisierungen (start-sdk 1.2.0). Health-Checks: Bitcoin-RPC-Polling entfernt — der Sync-Fortschritt verwendet jetzt electrs\' eigenes Bereitschaftssignal, und der Daemon meldet "wartend" (nicht "Fehler"), während Bitcoin seinen initialen Block-Download abschließt.',
    pl_PL:
      'Aktualizacje wewnętrzne (start-sdk 1.2.0). Sprawdzenia zdrowia: usunięto odpytywanie RPC Bitcoina — postęp synchronizacji używa teraz własnego sygnału gotowości electrs, a demon zgłasza "oczekiwanie" (nie "błąd"), podczas gdy Bitcoin kończy początkowe pobieranie bloków.',
    fr_FR:
      "Mises à jour internes (start-sdk 1.2.0). Vérifications d'état : suppression des appels RPC Bitcoin — la progression de la synchronisation utilise désormais le signal de disponibilité propre à electrs, et le démon indique « en attente » (et non « échec ») pendant que Bitcoin termine son téléchargement initial des blocs.",
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
