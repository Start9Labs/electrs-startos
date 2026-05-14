import { tomlFile } from '../fileModels/electrs.toml'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await tomlFile.merge(effects, {})
  await storeJson.merge(effects, {})
})
