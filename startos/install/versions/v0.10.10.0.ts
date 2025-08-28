import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { LogFilters } from '../../utils'
import { tomlFile } from '../../fileModels/electrs.toml'

export const v0_10_10_0 = VersionInfo.of({
  version: '0.10.10:0-alpha.0',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const oldConfigFile = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).catch(console.error)

      if (oldConfigFile) {        
        const oldConfig = load(oldConfigFile) as {
          'log-filters': LogFilters
          'index-batch-size': number
          'index-lookup-limit': number
        }
  
        await tomlFile.merge(effects, {
          log_filters: oldConfig['log-filters'],
          index_batch_size: oldConfig['index-batch-size'],
          index_lookup_limit: oldConfig['index-lookup-limit']
        })
  
        await rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
          console.error,
        )
      }
    },
    down: IMPOSSIBLE,
  },
})
