import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { LogFilters } from '../../utils'
import { tomlFile } from '../../fileModels/electrs.toml'
import { configDefaults } from '../../utils'

const {
  cookie_file,
  daemon_p2p_addr,
  daemon_rpc_addr,
  network,
  electrum_rpc_addr,
} = configDefaults

export const v0_11_0_1 = VersionInfo.of({
  version: '0.11.0:1-beta.1',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const oldConfigFile = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).catch(console.log)

      if (oldConfigFile) {
        const oldConfig = load(oldConfigFile) as {
          'log-filters': LogFilters
          'index-batch-size': number
          'index-lookup-limit': number
        }

        await tomlFile.write(effects, {
          cookie_file,
          daemon_rpc_addr,
          daemon_p2p_addr,
          electrum_rpc_addr,
          network,
          log_filters: oldConfig['log-filters'],
          index_batch_size: oldConfig['index-batch-size'],
          index_lookup_limit: oldConfig['index-lookup-limit'],
        })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
