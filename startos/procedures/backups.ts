import { sdk } from '../sdk'

export const { createBackup, restoreBackup } = sdk.setupBackups(
    sdk.Backups.withOptions({ exclude: ['db'] }).volumes('main'),
  )