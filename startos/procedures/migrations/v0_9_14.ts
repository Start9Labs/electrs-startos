import { sdk } from '../../sdk'

export const v0_9_14 = sdk.Migration.of({
  version: '0.9.14',
  up: async ({ effects, utils }) => {
    //@TODO: get old config file and save to new config

    const rpcUser = 'electrs'
    const rpcPassword = //@TODO: generate random password using bitcoin-rpcuath-js
      await utils.vault.set('rpcUser', rpcUser)
    await utils.vault.set('rpcPassword', rpcPassword)

    //@TODONE?: remove old start9 dir
    await effects.runCommand(['rm', '-rf', '/data/start9'])
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
