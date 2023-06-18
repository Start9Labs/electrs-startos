import { sdk } from '../../../sdk'
import { configSpec } from '../../config/spec'
import { bitcoindConfig } from './bitcoind'

/**
 * Consolidate all dependency configs here
 */
export const dependencyConfig = sdk.setupDependencyConfig(configSpec, {
  'bitcoind': bitcoindConfig,
})