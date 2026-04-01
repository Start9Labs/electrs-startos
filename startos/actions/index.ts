import { sdk } from '../sdk'
import { config } from './config'

export const actions = sdk.Actions.of().addAction(config)
