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
      'Select the level of log verbosity. Less is usually better.',
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
    description: i18n('Customize your electrs Electrum server'),
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
