import { tomlFile } from '../file-models/electrs.toml'
import { sdk } from '../sdk'
import { logFilters } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  log_filters: Value.select({
    name: 'Log Level',
    description: 'Select the level of log verbosity. Less is usually better.',
    values: logFilters,
    default: 'INFO',
  }),
  index_batch_size: Value.number({
    name: 'Index Batch Size',
    description: 'Maximum number of blocks to request from bitcoind per batch.',
    required: true,
    default: 10,
    integer: true,
    min: 1,
    max: 10000,
    placeholder: '10',
    step: 10,
    units: 'blocks',
  }),
  index_lookup_limit: Value.number({
    name: 'Index Lookup Limit',
    description: `Number of transactions to lookup before returning an error, to prevent 'too popular' addresses from causing the RPC server to time out. Enter '0' for no limit.`,
    required: true,
    default: 0,
    integer: true,
    min: 0,
    max: 10000,
    placeholder: '0',
    units: 'transactions',
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Configure',
    description: 'Customize your electrs Electrum server',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const values = await tomlFile.read().const(effects)

    return {
      log_filters: values?.log_filters,
      index_lookup_limit: values?.index_lookup_limit,
      index_batch_size: values?.index_batch_size,
    }
  },

  // the execution function
  async ({ effects, input }) => tomlFile.merge(effects, input),
)
