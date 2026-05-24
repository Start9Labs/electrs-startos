import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Dedicated file for the "have we already posted the Sync Complete
// notification" flag. Read once at startup into a closure flag in main; the
// closure flag is the source of truth within a main lifecycle, the on-disk
// flag re-seeds it across restarts.
export const syncNotifiedFile = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/sync-notified.json',
  },
  z.object({
    notified: z.boolean().catch(false),
  }),
)
