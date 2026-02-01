import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'electrs',
  title: 'Electrs',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/electrs-startos/',
  upstreamRepo: 'https://github.com/romanz/electrs/',
  supportSite: 'https://github.com/romanz/electrs/issues',
  marketingSite: 'https://github.com/romanz/electrs/',
  docsUrl:
    'https://github.com/Start9Labs/electrs-startos/blob/master/docs/instructions.md',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    electrs: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to subscribe to new block events.',
      optional: false,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
