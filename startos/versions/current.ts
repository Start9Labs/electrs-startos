import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:1',
  releaseNotes: {
    en_US: `A new **Bitcoin REST** health check reports when the installed Bitcoin cannot serve this version of Electrs, and what to do. Bitcoin Core 31.1:17 or later is required; Bitcoin Knots (pre-RDTS) cannot serve Electrs 0.12 — run Fulcrum instead, or switch Bitcoin to Bitcoin Core.`,
    es_ES: `Una nueva comprobación de salud **REST de Bitcoin** informa cuando el Bitcoin instalado no puede servir a esta versión de Electrs, y qué hacer. Se requiere Bitcoin Core 31.1:17 o posterior; Bitcoin Knots (pre-RDTS) no puede servir a Electrs 0.12: usa Fulcrum en su lugar, o cambia Bitcoin a Bitcoin Core.`,
    de_DE: `Eine neue Gesundheitsprüfung **Bitcoin-REST** meldet, wenn das installierte Bitcoin diese Version von Electrs nicht bedienen kann, und was zu tun ist. Bitcoin Core 31.1:17 oder neuer ist erforderlich; Bitcoin Knots (pre-RDTS) kann Electrs 0.12 nicht bedienen — verwenden Sie stattdessen Fulcrum, oder wechseln Sie Bitcoin zu Bitcoin Core.`,
    pl_PL: `Nowa kontrola stanu **REST Bitcoina** zgłasza, gdy zainstalowany Bitcoin nie może obsłużyć tej wersji Electrs, i co zrobić. Wymagany jest Bitcoin Core 31.1:17 lub nowszy; Bitcoin Knots (pre-RDTS) nie może obsłużyć Electrs 0.12 — użyj zamiast tego Fulcrum albo przełącz Bitcoin na Bitcoin Core.`,
    fr_FR: `Un nouveau contrôle de santé **REST de Bitcoin** signale lorsque le Bitcoin installé ne peut pas servir cette version d'Electrs, et ce qu'il faut faire. Bitcoin Core 31.1:17 ou plus récent est requis ; Bitcoin Knots (pre-RDTS) ne peut pas servir Electrs 0.12 — utilisez Fulcrum à la place, ou passez Bitcoin à Bitcoin Core.`,
  },
  migrations: {},
})
