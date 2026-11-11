import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.1:0',
  releaseNotes: {
    en_US:
      'Updated Electrs to 0.12.1, a dependency and documentation maintenance release. Requires StartOS 0.4.2 or later. Health checks update more promptly during startup, allowing Electrs to start sooner after Bitcoin finishes background validation. [Full upstream release notes](https://github.com/romanz/electrs/releases/tag/v0.12.1)',
    es_ES:
      'Electrs se ha actualizado a la versión 0.12.1, una versión de mantenimiento de dependencias y documentación. Requiere StartOS 0.4.2 o posterior. Las comprobaciones de salud se actualizan más rápidamente durante el arranque, lo que permite iniciar Electrs antes cuando Bitcoin termina la validación en segundo plano. [Notas completas de la versión original](https://github.com/romanz/electrs/releases/tag/v0.12.1)',
    de_DE:
      'Electrs wurde auf Version 0.12.1 aktualisiert, eine Wartungsversion für Abhängigkeiten und Dokumentation. Erfordert StartOS 0.4.2 oder neuer. Zustandsprüfungen werden beim Start schneller aktualisiert, sodass Electrs nach Abschluss der Hintergrundvalidierung von Bitcoin früher startet. [Vollständige Upstream-Versionshinweise](https://github.com/romanz/electrs/releases/tag/v0.12.1)',
    pl_PL:
      'Zaktualizowano Electrs do wersji 0.12.1, wydania konserwacyjnego zależności i dokumentacji. Wymaga StartOS 0.4.2 lub nowszego. Kontrole stanu aktualizują się szybciej podczas uruchamiania, dzięki czemu Electrs może wystartować wcześniej po zakończeniu walidacji w tle przez Bitcoin. [Pełne informacje o wydaniu upstream](https://github.com/romanz/electrs/releases/tag/v0.12.1)',
    fr_FR:
      'Electrs a été mis à jour vers la version 0.12.1, une version de maintenance des dépendances et de la documentation. Nécessite StartOS 0.4.2 ou une version ultérieure. Les contrôles de santé se mettent à jour plus rapidement au démarrage, permettant à Electrs de démarrer plus tôt après la fin de la validation en arrière-plan de Bitcoin. [Notes de version amont complètes](https://github.com/romanz/electrs/releases/tag/v0.12.1)',
  },
  migrations: {},
})
