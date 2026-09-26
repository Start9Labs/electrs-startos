import { sdk } from '../sdk'
import { config } from './config'
import { reindex } from './reindex'

export const actions = sdk.Actions.of().addAction(config).addAction(reindex)
