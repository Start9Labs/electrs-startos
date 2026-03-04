import { tomlFile } from '../fileModels/electrs.toml'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await tomlFile.merge(effects, {})
})
