import { sdk } from '../../sdk'
import { manifest as bitcoindManifest } from 'bitcoind-startos/startos/manifest'

export const dependencyMounts = sdk
  .setupDependencyMounts()
  .addPath({
    name: 'bitcoinBlocks',
    manifest: bitcoindManifest,
    volume: 'main',
    path: '/root/.bitcoin/blocks',
    readonly: true,
  })
  .build()
