import { utils } from '@start9labs/start-sdk'
import { tomlFile } from '../fileModels/electrs.toml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { logFilters } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  log_filters: Value.select({
    name: i18n('Log Level'),
    description: i18n(
      'How much Electrs writes to its logs. Each level includes everything in the levels above it.\n- Error: failures only\n- Warning: also conditions that may need attention\n- Info: also startup and sync progress\n- Debug: also every wallet connection, request and reply; noisy, for chasing a specific problem\n- Trace: everything Electrs can log; very noisy',
    ),
    values: logFilters,
    default: 'INFO',
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n('Set how much Electrs writes to its logs.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => tomlFile.read().once(),

  // the execution function
  async ({ effects, input }) =>
    tomlFile.merge(effects, utils.nullToUndefined(input)),
)
