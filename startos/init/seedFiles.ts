import { tomlFile } from '../fileModels/electrs.toml'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await tomlFile.merge(effects, {})
})
