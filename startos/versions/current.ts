import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.1:2',
  releaseNotes: {
    en_US:
      'Removes an unused tool from the service image. No change in behavior.',
    es_ES:
      'Elimina una herramienta sin uso de la imagen del servicio. Sin cambios de comportamiento.',
    de_DE:
      'Entfernt ein ungenutztes Werkzeug aus dem Dienst-Image. Keine Verhaltensänderung.',
    pl_PL: 'Usuwa nieużywane narzędzie z obrazu usługi. Bez zmian w działaniu.',
    fr_FR:
      "Supprime un outil inutilisé de l'image du service. Aucun changement de comportement.",
  },
  migrations: {},
})
