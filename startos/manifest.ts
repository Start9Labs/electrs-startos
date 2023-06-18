import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'

export const manifest = setupManifest({
  id: 'electrs',
  title: 'electrs',
  version: '0.9.14',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  license: 'mit',
  replaces: Array<string>(''),
  wrapperRepo: 'https://github.com/Start9Labs/electrs-startos',
  upstreamRepo: 'https://github.com/romanz/electrs',
  supportSite: 'https://github.com/romanz/electrs/issues',
  marketingSite: 'https://github.com/romanz/electrs',
  donationUrl: 'https://docs.searxng.org/donate.html',
  description: {
    short: 'An efficient re-implementation of Electrum Server in Rust',
    long: 'An efficient re-implementation of Electrum Server, inspired by ElectrumX, Electrum Personal Server and bitcoincore-indexd. The motivation behind this project is to enable a user to self host an Electrum server, with required hardware resources not much beyond those of a full node. The server indexes the entire Bitcoin blockchain, and the resulting index enables fast queries for any given user wallet, allowing the user to keep real-time track of balances and transaction history using the Electrum wallet. Since it runs on the users own machine, there is no need for the wallet to communicate with external Electrum servers, thus preserving the privacy of the users addresses and balances.',
  },
  assets: {
    license: 'LICENSE',
    icon: 'assets/icon.png',
    instructions: 'assets/instructions.md',
  },
  volumes: {
    main: 'data',
  },
  containers: {
    main: {
      image: 'main',
      mounts: {
        main: '/root',
      },
    },
  },
  alerts: {
    install:
      'INSTABILITY WARNING: Electrs uses up to 1GB of RAM when syncing. Please make sure you have at least this much free RAM before starting Electrs, or you will cause your system to become unresponsive!',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    //@TODONE: require bitcoin core
    bitcoin: {
      version: '>=24.1',
      description: "Bitcoin's blocks must be available",
      requirement: { type: 'required' },
    },
  },
})

export type Manifest = typeof manifest
