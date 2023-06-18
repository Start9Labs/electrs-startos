import { sdk } from '../sdk'
import { migrations } from './migrations'
import { setInterfaces } from './interfaces'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  const rpcUser = 'electrs'
  const rpcPassword = '' //@TODO: generate random password using bitcoin-rpcuath-js
  await utils.vault.set('rpcUser', rpcUser)
  await utils.vault.set('rpcPassword', rpcPassword)
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {
  //@TODO: delete auth entry from bitcoin core
})

export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
)
