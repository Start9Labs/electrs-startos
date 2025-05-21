import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'

export const v0_10_9_1 = VersionInfo.of({
  version: '0.10.9:1',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {
      await rm('/data/start9', { recursive: true })
    },
    down: IMPOSSIBLE,
  },
})
