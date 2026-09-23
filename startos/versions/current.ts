import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:2',
  releaseNotes: {
    en_US: `**Electrs 0.12 requires Bitcoin Core 31.1:17 or later.** Bitcoin Knots (pre-RDTS) and earlier Bitcoin Core versions cannot serve it. If you run one of them, switch Bitcoin to Bitcoin Core 31.1:17 or later before updating, or stay on Electrs 0.11.

Updating from Electrs 0.11 rebuilds the address index: Electrs is unavailable for several hours and needs at least 120 GB of free space. Your 0.11 index is kept until Bitcoin can serve Electrs 0.12, so if you update too early, downgrading to 0.11.1:20 puts you back where you were with no rebuild.

Already on Electrs 0.12 with a Bitcoin that cannot serve it? Install this update, then downgrade to 0.11.1:20. Electrs 0.11 will rebuild its index, which takes several hours.

Electrs 0.12 uses a faster address index and fixes Electrum protocol compatibility. [Full upstream release notes](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    es_ES: `**Electrs 0.12 requiere Bitcoin Core 31.1:17 o posterior.** Bitcoin Knots (pre-RDTS) y las versiones anteriores de Bitcoin Core no pueden servirlo. Si usas una de ellas, cambia Bitcoin a Bitcoin Core 31.1:17 o posterior antes de actualizar, o quédate en Electrs 0.11.

La actualización desde Electrs 0.11 reconstruye el índice de direcciones: Electrs no estará disponible durante varias horas y necesita al menos 120 GB de espacio libre. Tu índice de 0.11 se conserva hasta que Bitcoin pueda servir a Electrs 0.12, así que si actualizas antes de tiempo, volver a la versión 0.11.1:20 te deja como estabas, sin reconstruir nada.

¿Ya usas Electrs 0.12 con un Bitcoin que no puede servirlo? Instala esta actualización y luego vuelve a la versión 0.11.1:20. Electrs 0.11 reconstruirá su índice, lo que lleva varias horas.

Electrs 0.12 usa un índice de direcciones más rápido y corrige la compatibilidad del protocolo Electrum. [Notas completas de la versión original](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    de_DE: `**Electrs 0.12 erfordert Bitcoin Core 31.1:17 oder neuer.** Bitcoin Knots (pre-RDTS) und ältere Versionen von Bitcoin Core können es nicht bedienen. Wenn Sie eine davon verwenden, wechseln Sie Bitcoin vor der Aktualisierung zu Bitcoin Core 31.1:17 oder neuer, oder bleiben Sie bei Electrs 0.11.

Die Aktualisierung von Electrs 0.11 baut den Adressindex neu auf: Electrs ist mehrere Stunden lang nicht verfügbar und benötigt mindestens 120 GB freien Speicherplatz. Ihr 0.11-Index bleibt erhalten, bis Bitcoin Electrs 0.12 bedienen kann. Wenn Sie zu früh aktualisieren, bringt Sie ein Downgrade auf 0.11.1:20 ohne Neuaufbau dorthin zurück, wo Sie waren.

Sie verwenden bereits Electrs 0.12 mit einem Bitcoin, das es nicht bedienen kann? Installieren Sie diese Aktualisierung und führen Sie dann ein Downgrade auf 0.11.1:20 durch. Electrs 0.11 baut seinen Index neu auf, was mehrere Stunden dauert.

Electrs 0.12 verwendet einen schnelleren Adressindex und behebt die Kompatibilität des Electrum-Protokolls. [Vollständige Upstream-Versionshinweise](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    pl_PL: `**Electrs 0.12 wymaga Bitcoin Core 31.1:17 lub nowszego.** Bitcoin Knots (pre-RDTS) i starsze wersje Bitcoin Core nie mogą go obsłużyć. Jeśli używasz jednej z nich, przed aktualizacją przełącz Bitcoin na Bitcoin Core 31.1:17 lub nowszy albo pozostań przy Electrs 0.11.

Aktualizacja z Electrs 0.11 przebudowuje indeks adresów: Electrs będzie niedostępny przez kilka godzin i potrzebuje co najmniej 120 GB wolnego miejsca. Twój indeks 0.11 jest zachowywany, dopóki Bitcoin nie będzie mógł obsłużyć Electrs 0.12, więc jeśli zaktualizujesz za wcześnie, obniżenie wersji do 0.11.1:20 przywróci poprzedni stan bez przebudowy.

Używasz już Electrs 0.12 z Bitcoinem, który nie może go obsłużyć? Zainstaluj tę aktualizację, a następnie obniż wersję do 0.11.1:20. Electrs 0.11 przebuduje swój indeks, co potrwa kilka godzin.

Electrs 0.12 korzysta z szybszego indeksu adresów i poprawia zgodność z protokołem Electrum. [Pełne informacje o wydaniu upstream](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
    fr_FR: `**Electrs 0.12 nécessite Bitcoin Core 31.1:17 ou plus récent.** Bitcoin Knots (pre-RDTS) et les versions antérieures de Bitcoin Core ne peuvent pas le servir. Si vous utilisez l'une d'elles, passez Bitcoin à Bitcoin Core 31.1:17 ou plus récent avant de mettre à jour, ou restez sur Electrs 0.11.

La mise à jour depuis Electrs 0.11 reconstruit l'index d'adresses : Electrs est indisponible pendant plusieurs heures et nécessite au moins 120 Go d'espace libre. Votre index 0.11 est conservé tant que Bitcoin ne peut pas servir Electrs 0.12 : si vous mettez à jour trop tôt, rétrograder vers 0.11.1:20 vous ramène là où vous en étiez, sans reconstruction.

Vous êtes déjà sur Electrs 0.12 avec un Bitcoin qui ne peut pas le servir ? Installez cette mise à jour, puis rétrogradez vers 0.11.1:20. Electrs 0.11 reconstruira son index, ce qui prend plusieurs heures.

Electrs 0.12 utilise un index d'adresses plus rapide et corrige la compatibilité du protocole Electrum. [Notes de version amont complètes](https://github.com/romanz/electrs/releases/tag/v0.12.0)`,
  },
  migrations: {},
})
