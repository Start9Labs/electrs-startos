export const bitcoindDescription = {
  en_US:
    'Provides blocks and spent outputs over REST, plus mempool data over RPC.',
  es_ES:
    'Proporciona bloques y salidas gastadas mediante REST, además de datos del mempool mediante RPC.',
  de_DE:
    'Stellt Blöcke und ausgegebene Outputs über REST sowie Mempool-Daten über RPC bereit.',
  pl_PL:
    'Udostępnia bloki i wydane wyjścia przez REST oraz dane mempoola przez RPC.',
  fr_FR:
    'Fournit les blocs et les sorties dépensées via REST, ainsi que les données du mempool via RPC.',
}

export const preDownloadMessage = {
  en_US:
    '**Electrs 0.12 requires Bitcoin Core 31.1:17 or later.** Bitcoin Knots (pre-RDTS) and earlier Bitcoin Core versions cannot serve it. Updating from Electrs 0.11 also rebuilds the address index: Electrs is unavailable for several hours and needs at least 120 GB of free space.',
  es_ES:
    '**Electrs 0.12 requiere Bitcoin Core 31.1:17 o posterior.** Bitcoin Knots (pre-RDTS) y las versiones anteriores de Bitcoin Core no pueden servirlo. La actualización desde Electrs 0.11 también reconstruye el índice de direcciones: Electrs no estará disponible durante varias horas y necesita al menos 120 GB de espacio libre.',
  de_DE:
    '**Electrs 0.12 erfordert Bitcoin Core 31.1:17 oder neuer.** Bitcoin Knots (pre-RDTS) und ältere Versionen von Bitcoin Core können es nicht bedienen. Die Aktualisierung von Electrs 0.11 baut außerdem den Adressindex neu auf: Electrs ist mehrere Stunden lang nicht verfügbar und benötigt mindestens 120 GB freien Speicherplatz.',
  pl_PL:
    '**Electrs 0.12 wymaga Bitcoin Core 31.1:17 lub nowszego.** Bitcoin Knots (pre-RDTS) i starsze wersje Bitcoin Core nie mogą go obsłużyć. Aktualizacja z Electrs 0.11 przebudowuje też indeks adresów: Electrs będzie niedostępny przez kilka godzin i potrzebuje co najmniej 120 GB wolnego miejsca.',
  fr_FR:
    "**Electrs 0.12 nécessite Bitcoin Core 31.1:17 ou plus récent.** Bitcoin Knots (pre-RDTS) et les versions antérieures de Bitcoin Core ne peuvent pas le servir. La mise à jour depuis Electrs 0.11 reconstruit aussi l'index d'adresses : Electrs est indisponible pendant plusieurs heures et nécessite au moins 120 Go d'espace libre.",
}

export const short = {
  en_US: 'An efficient re-implementation of Electrum Server in Rust',
  es_ES: 'Una reimplementación eficiente del servidor Electrum en Rust',
  de_DE: 'Eine effiziente Neuimplementierung des Electrum-Servers in Rust',
  pl_PL: 'Wydajna reimplementacja serwera Electrum w Rust',
  fr_FR: 'Une réimplémentation efficace du serveur Electrum en Rust',
}

export const long = {
  en_US:
    'Enables a user to self host an Electrum server, with required hardware resources not much beyond those of a full node. The server indexes the entire Bitcoin blockchain, and the resulting index enables fast queries for any given user wallet, allowing the user to keep real-time track of balances and transaction history using the Electrum wallet. Since it runs on the users own machine, there is no need for the wallet to communicate with external Electrum servers, thus preserving the privacy of the users addresses and balances.',
  es_ES:
    'Permite al usuario alojar su propio servidor Electrum, con recursos de hardware no mucho más allá de los de un nodo completo. El servidor indexa toda la cadena de bloques de Bitcoin, y el índice resultante permite consultas rápidas para cualquier billetera de usuario, permitiendo al usuario mantener un seguimiento en tiempo real de saldos e historial de transacciones usando la billetera Electrum. Al ejecutarse en la propia máquina del usuario, no es necesario que la billetera se comunique con servidores Electrum externos, preservando así la privacidad de las direcciones y saldos del usuario.',
  de_DE:
    'Ermöglicht es einem Benutzer, einen Electrum-Server selbst zu hosten, mit Hardwareanforderungen, die nicht viel über die eines vollständigen Knotens hinausgehen. Der Server indiziert die gesamte Bitcoin-Blockchain, und der resultierende Index ermöglicht schnelle Abfragen für jede Benutzer-Wallet, sodass der Benutzer Salden und Transaktionshistorie in Echtzeit mit der Electrum-Wallet verfolgen kann. Da er auf der eigenen Maschine des Benutzers läuft, muss die Wallet nicht mit externen Electrum-Servern kommunizieren, wodurch die Privatsphäre der Adressen und Salden des Benutzers gewahrt bleibt.',
  pl_PL:
    'Umożliwia użytkownikowi samodzielne hostowanie serwera Electrum, z wymaganiami sprzętowymi niewiele przekraczającymi te dla pełnego węzła. Serwer indeksuje cały blockchain Bitcoin, a wynikowy indeks umożliwia szybkie zapytania dla dowolnego portfela użytkownika, pozwalając na śledzenie sald i historii transakcji w czasie rzeczywistym za pomocą portfela Electrum. Ponieważ działa na własnej maszynie użytkownika, portfel nie musi komunikować się z zewnętrznymi serwerami Electrum, chroniąc tym samym prywatność adresów i sald użytkownika.',
  fr_FR:
    "Permet à un utilisateur d'auto-héberger un serveur Electrum, avec des ressources matérielles à peine supérieures à celles d'un nœud complet. Le serveur indexe l'intégralité de la blockchain Bitcoin, et l'index résultant permet des requêtes rapides pour tout portefeuille utilisateur, permettant à l'utilisateur de suivre en temps réel les soldes et l'historique des transactions avec le portefeuille Electrum. Puisqu'il s'exécute sur la propre machine de l'utilisateur, il n'est pas nécessaire que le portefeuille communique avec des serveurs Electrum externes, préservant ainsi la confidentialité des adresses et des soldes de l'utilisateur.",
}
