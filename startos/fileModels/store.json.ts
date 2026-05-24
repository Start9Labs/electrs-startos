import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Dedicated file for the "have we already posted the Sync Complete
// notification" flag. Path and field name match the pre-0.11.1:6 store.json
// so upgraders' existing syncNotified=true is honored — without this, the
// file model would point at sync-notified.json and they'd receive one more
// notification on upgrade. Read once at startup into a closure flag in main;
// the closure flag is the source of truth within a main lifecycle, the
// on-disk flag re-seeds it across restarts.
export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  z.object({
    syncNotified: z.boolean().catch(false),
  }),
)
