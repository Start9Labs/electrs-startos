import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.12.0:9',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.1 or later. Electrum wallets can now connect over your server's IPv6 addresses.",
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Las billeteras Electrum ahora pueden conectarse a través de las direcciones IPv6 de tu servidor.',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Electrum-Wallets können sich jetzt über die IPv6-Adressen deines Servers verbinden.',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Portfele Electrum mogą teraz łączyć się przez adresy IPv6 twojego serwera.',
    fr_FR:
      'Nécessite StartOS 0.4.1 ou une version ultérieure. Les portefeuilles Electrum peuvent désormais se connecter via les adresses IPv6 de votre serveur.',
  },
  migrations: {},
})
