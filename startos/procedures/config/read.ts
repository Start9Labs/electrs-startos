import FileHelper from '@start9labs/start-sdk/lib/util/fileHelper'
import { sdk } from '../../sdk'
import { configSpec } from './spec'
import { object, string } from 'ts-matches'

const myTomlFileHelper = FileHelper.toml(
  '/where/the/file/is',
  object({
    auth: string,
    daemon_rpc_addr: string,
    daemon_p2p_addr: string,
    network: string,
    electrum_rpc_addr: string,
    log_filters: string,
  }),
)

export const read = sdk.setupConfigRead(
  configSpec,
  async ({ effects, utils }) => {
    const myResult = await myTomlFileHelper.read(effects)
    // Retrieve data from the service's native config file. So, even if the user changes this file from the service's GUI or from the command line, the StartOS config will update as well.
    const configToml = await tomlFile.read(effects)
    // Return the expected config spec to display to the user
    return {
      name: configToml?.name || '',
    }
  },
)
