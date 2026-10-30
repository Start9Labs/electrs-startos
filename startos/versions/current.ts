import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:7',
  releaseNotes: {
    en_US:
      'Electrs now waits for a Bitcoin bootstrapped from a UTXO snapshot to finish validating its older blocks before indexing. Requires Bitcoin Core 31.2:1 or later; update Bitcoin first.',
    es_ES:
      'Electrs ahora espera a que un Bitcoin iniciado desde una instantánea UTXO termine de validar sus bloques antiguos antes de indexar. Requiere Bitcoin Core 31.2:1 o posterior; actualiza Bitcoin primero.',
    de_DE:
      'Electrs wartet jetzt, bis ein aus einem UTXO-Snapshot gestartetes Bitcoin seine älteren Blöcke validiert hat, bevor es indexiert. Erfordert Bitcoin Core 31.2:1 oder neuer; aktualisieren Sie zuerst Bitcoin.',
    pl_PL:
      'Electrs czeka teraz, aż Bitcoin uruchomiony z migawki UTXO zakończy weryfikację starszych bloków, zanim zacznie indeksować. Wymaga Bitcoin Core 31.2:1 lub nowszego; najpierw zaktualizuj Bitcoin.',
    fr_FR: `Electrs attend désormais qu'un Bitcoin amorcé depuis un instantané UTXO ait fini de valider ses anciens blocs avant d'indexer. Nécessite Bitcoin Core 31.2:1 ou plus récent ; mettez d'abord Bitcoin à jour.`,
  },
  migrations: {},
})
