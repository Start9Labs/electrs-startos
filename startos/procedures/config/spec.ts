import { sdk } from '../../sdk'
const { Config } = sdk

export const configSpec = Config.of({
  'log-filters': Value.select({
    name: 'Log Filters',
    description:
      'What types of events should be shown in the log',
    required: {
        default: 'INFO',
    }
    values: {
          "ERROR": "Error",
          "WARN": "Warning",
          "INFO": "Info",
          "DEBUG": "Debug",
          "TRACE": "Trace",
    }),
  'index-batch-size': Value.number({
        name: 'Index Batch Size',
        description: 'Maximum number of blocks to request from Bitcoin RPC per batch',
        required: {
            default: 0,
        }
        integer: true,
        min: 0,
        max: 10000,
        nullable: true,
        integral: true,
      }),
  'index-lookup-limit': Value.number({
        name: 'Index Lookup Limit',
        description: "Number of transactions to lookup before returning an error, to prevent addresses with too many transactions associated causing the RPC server to timeout (0 = disable the limit)",
        required: {
            default: 0,
        }
        integer: true,
        min: 0,
        max: 10000,
        nullable: true,
        integral: true,
      }),
      
})

// This line is necessary to satisfy Typescript typings. Do not touch it
export type ConfigSpec = typeof configSpec.validator._TYPE


