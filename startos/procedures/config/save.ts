import { sdk } from '../../sdk'
import { setInterfaces } from '../interfaces'
import { configSpec } from './spec'

export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, utils, input, dependencies }) => {
    //@TODO: take values from input (saved config) and save them to electrs.toml file //see multiple of matt's services
    const dependenciesReceipt = await effects.setDependencies([])

    return {
      interfacesReceipt: await setInterfaces({ effects, utils, input }),
      dependenciesReceipt,
      restart: false,
    }
  },
)
