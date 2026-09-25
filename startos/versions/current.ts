import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:3',
  releaseNotes: {
    en_US: `A new **Reindex** action rebuilds a corrupted address index without uninstalling Electrs.

**Electrs 0.12 requires Bitcoin Core 31.1:17 or later.** Bitcoin Knots (pre-RDTS) and earlier Bitcoin Core versions cannot serve it. Updating from Electrs 0.11 rebuilds the address index, which takes several hours and needs at least 120 GB of free space.`,
    es_ES: `Una nueva acción **Reindexar** reconstruye un índice de direcciones dañado sin desinstalar Electrs.

**Electrs 0.12 requiere Bitcoin Core 31.1:17 o posterior.** Bitcoin Knots (pre-RDTS) y las versiones anteriores de Bitcoin Core no pueden servirlo. La actualización desde Electrs 0.11 reconstruye el índice de direcciones, lo que lleva varias horas y necesita al menos 120 GB de espacio libre.`,
    de_DE: `Eine neue Aktion **Neu indizieren** baut einen beschädigten Adressindex neu auf, ohne Electrs zu deinstallieren.

**Electrs 0.12 erfordert Bitcoin Core 31.1:17 oder neuer.** Bitcoin Knots (pre-RDTS) und ältere Versionen von Bitcoin Core können es nicht bedienen. Die Aktualisierung von Electrs 0.11 baut den Adressindex neu auf, was mehrere Stunden dauert und mindestens 120 GB freien Speicherplatz benötigt.`,
    pl_PL: `Nowa akcja **Reindeksuj** odbudowuje uszkodzony indeks adresów bez odinstalowywania Electrs.

**Electrs 0.12 wymaga Bitcoin Core 31.1:17 lub nowszego.** Bitcoin Knots (pre-RDTS) i starsze wersje Bitcoin Core nie mogą go obsłużyć. Aktualizacja z Electrs 0.11 przebudowuje indeks adresów, co trwa kilka godzin i wymaga co najmniej 120 GB wolnego miejsca.`,
    fr_FR: `Une nouvelle action **Réindexer** reconstruit un index d'adresses corrompu sans désinstaller Electrs.

**Electrs 0.12 nécessite Bitcoin Core 31.1:17 ou plus récent.** Bitcoin Knots (pre-RDTS) et les versions antérieures de Bitcoin Core ne peuvent pas le servir. La mise à jour depuis Electrs 0.11 reconstruit l'index d'adresses, ce qui prend plusieurs heures et nécessite au moins 120 Go d'espace libre.`,
  },
  migrations: {},
})
