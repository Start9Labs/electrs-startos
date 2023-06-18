import { sdk } from '../../../sdk'
import { configSpec } from '../../config/spec'
import { configSpec as bitcoindSpec } from 'bitcoind-startos/startos/procedures/config/spec'

/**
 * In this function, you establish rules for configuring a dependency
 *
 * End user approval is required before changes are applied
 */
export const bitcoindConfig = sdk.DependencyConfig.of({
  localConfig: configSpec,
  remoteConfig: bitcoindSpec,
  dependencyConfig: async ({ effects, utils, localConfig, remoteConfig }) => {
    return {
      advanced: { pruningMode: 'disabled'},
    }
  },
})