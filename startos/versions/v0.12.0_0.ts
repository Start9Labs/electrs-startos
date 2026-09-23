import { VersionInfo } from '@start9labs/start-sdk'
import { existsSync } from 'fs'
import { rename, rm } from 'fs/promises'
import { tomlFile } from '../fileModels/electrs.toml'
import { storeJson } from '../fileModels/store.json'
import { index, legacyIndex } from '../utils'

export const v_0_12_0_0 = VersionInfo.of({
  version: '0.12.0:0',
  releaseNotes: {
    en_US: `Updated Electrs to 0.12.0. This release uses a faster address index and fixes Electrum protocol compatibility for server details and transaction-position queries. Update Bitcoin first; this release requires Bitcoin 31.1:17 or newer.

The update rebuilds the address index, so Electrs will be unavailable for several hours and needs at least 120 GB of free space. [Full upstream release notes](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    es_ES: `Electrs se ha actualizado a la versión 0.12.0. Esta versión utiliza un índice de direcciones más rápido y corrige la compatibilidad del protocolo Electrum para los detalles del servidor y las consultas de posición de transacciones. Actualiza Bitcoin primero; esta versión requiere Bitcoin 31.1:17 o posterior.

La actualización reconstruye el índice de direcciones, por lo que Electrs no estará disponible durante varias horas y necesita al menos 120 GB de espacio libre. [Notas completas de la versión original](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    de_DE: `Electrs wurde auf Version 0.12.0 aktualisiert. Diese Version verwendet einen schnelleren Adressindex und behebt die Kompatibilität des Electrum-Protokolls bei Serverdetails und Abfragen von Transaktionspositionen. Aktualisieren Sie zuerst Bitcoin; diese Version erfordert Bitcoin 31.1:17 oder neuer.

Bei der Aktualisierung wird der Adressindex neu aufgebaut. Electrs ist daher mehrere Stunden lang nicht verfügbar und benötigt mindestens 120 GB freien Speicherplatz. [Vollständige Upstream-Versionshinweise](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    pl_PL: `Zaktualizowano Electrs do wersji 0.12.0. To wydanie korzysta z szybszego indeksu adresów i poprawia zgodność z protokołem Electrum w zakresie informacji o serwerze oraz zapytań o pozycję transakcji. Najpierw zaktualizuj Bitcoin; ta wersja wymaga Bitcoin 31.1:17 lub nowszego.

Aktualizacja przebudowuje indeks adresów, więc Electrs będzie niedostępny przez kilka godzin i potrzebuje co najmniej 120 GB wolnego miejsca. [Pełne informacje o wydaniu upstream](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    fr_FR: `Electrs a été mis à jour vers la version 0.12.0. Cette version utilise un index d'adresses plus rapide et corrige la compatibilité du protocole Electrum pour les informations du serveur et les requêtes de position des transactions. Mettez d'abord Bitcoin à jour ; cette version nécessite Bitcoin 31.1:17 ou plus récent.

La mise à jour reconstruit l'index d'adresses. Electrs sera donc indisponible pendant plusieurs heures et nécessite au moins 120 Go d'espace libre. [Notes de version amont complètes](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
  },
  migrations: {
    up: async ({ effects }) => {
      if (existsSync(index)) await rename(index, legacyIndex)

      const config = await tomlFile.read().once()
      if (config) {
        const supported = { ...config }
        const stale = supported as Record<string, unknown>
        delete stale.daemon_p2p_addr
        delete stale.index_batch_size
        delete stale.index_lookup_limit
        await tomlFile.write(effects, supported)
      }

      await storeJson.merge(effects, {
        everSynced: false,
        syncNotified: false,
      })
    },
    down: async ({ effects }) => {
      await rm(index, { recursive: true, force: true })
      if (existsSync(legacyIndex)) await rename(legacyIndex, index)

      await storeJson.merge(effects, {
        everSynced: false,
        syncNotified: false,
      })
    },
  },
})
