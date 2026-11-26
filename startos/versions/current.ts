import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.1:3',
  releaseNotes: {
    en_US:
      'Electrs keeps running when Bitcoin is briefly slow to respond, including while Electrs compacts its database after building its index.',
    es_ES:
      'Electrs sigue funcionando cuando Bitcoin tarda brevemente en responder, incluso mientras Electrs compacta su base de datos tras construir su índice.',
    de_DE:
      'Electrs läuft weiter, wenn Bitcoin kurzzeitig langsam antwortet, auch während Electrs nach dem Aufbau seines Index seine Datenbank verdichtet.',
    pl_PL:
      'Electrs działa dalej, gdy Bitcoin chwilowo odpowiada wolno, także podczas kompaktowania bazy danych po zbudowaniu indeksu.',
    fr_FR:
      'Electrs continue de fonctionner lorsque Bitcoin met brièvement du temps à répondre, y compris pendant le compactage de sa base de données après la construction de son index.',
  },
  migrations: {},
})
