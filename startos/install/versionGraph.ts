import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { tomlFile } from '../fileModels/electrs.toml'
import { configDefaults } from '../utils'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await tomlFile.write(effects, configDefaults)
  },
})
