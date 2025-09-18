import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v0_10_10_0_alpha2 = VersionInfo.of({
  version: '0.10.10:0-alpha.2',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
