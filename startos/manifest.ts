import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'electrs',
  title: 'Electrs',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/electrs-startos/',
  upstreamRepo: 'https://github.com/romanz/electrs/',
  supportSite: 'https://github.com/romanz/electrs/issues',
  marketingSite: 'https://github.com/romanz/electrs/',
  donationUrl: null,
  description: {
    short: 'An efficient re-implementation of Electrum Server in Rust',
    long: 'Enables a user to self host an Electrum server, with required hardware resources not much beyond those of a full node. The server indexes the entire Bitcoin blockchain, and the resulting index enables fast queries for any given user wallet, allowing the user to keep real-time track of balances and transaction history using the Electrum wallet. Since it runs on the users own machine, there is no need for the wallet to communicate with external Electrum servers, thus preserving the privacy of the users addresses and balances.',
  },
  volumes: ['main'],
  images: {
    electrs: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Electrs uses Bitcoin to sync its indexes',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.3-alpha.6/bitcoind.s9pk',
    },
  },
})
