import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v0_11_0_1_beta0 = VersionInfo.of({
  version: '0.11.0:1-beta.0',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
