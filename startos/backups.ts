import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.ofVolumes('main').setOptions({
      exclude: ['/data/db'], // @TODO confirm path
    }),
)
