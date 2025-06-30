import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { LogFilters } from '../../utils'
import { tomlFile } from '../../fileModels/electrs.toml'

export const v0_10_9_1 = VersionInfo.of({
  version: '0.10.9:1-alpha.1',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const oldConfig = load(
        await readFile(
          '/media/startos/volumes/main/start9/config.yaml',
          'utf-8',
        ),
      ) as {
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
    },
    down: IMPOSSIBLE,
  },
})
