import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { tomlFile } from './file-models/electrs.toml'
import { configDefaults } from './utils'

// **** Pre Install ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  await tomlFile.write(effects, configDefaults)
})

// **** Post Install ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)
