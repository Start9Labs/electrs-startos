import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:5',
  releaseNotes: {
    en_US:
      'Restarting Electrs while it is still starting stops every process of the previous run.',
    es_ES:
      'Reiniciar Electrs mientras aún se está iniciando detiene todos los procesos de la ejecución anterior.',
    de_DE:
      'Ein Neustart von Electrs, während es noch startet, beendet alle Prozesse des vorherigen Laufs.',
    pl_PL:
      'Ponowne uruchomienie Electrs w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia.',
    fr_FR:
      "Redémarrer Electrs pendant son démarrage arrête tous les processus de l'exécution précédente.",
  },
  migrations: {},
})
