import { types as T, matches } from "../deps.ts";

const { shape, number, boolean, string } = matches;

type Check = {
  currentError(config: T.Config): string | void
  fix(config: T.Config): void
}

const matchBitcoindConfig = shape({
  rpc: shape({
    enable: boolean,
    advanced: shape({
      threads: number,
    }),
  }),
  advanced: shape({
    peers: shape({
      listen: boolean,
    }),
    pruning: shape({
      mode: string,
    }),
  }),
});

const bitcoindChecks: Array<Check> = [
  {
    currentError(config) {
      if (!matchBitcoindConfig.test(config)) {
        return 'Config is not the correct shape'
      }
      if (!config.rpc.enable) {
        return 'Must have RPC enabled'
      }
      return
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.rpc.enable = true
    },
  },
  {
    currentError(config) {
      if (!matchBitcoindConfig.test(config)) {
        return 'Config is not the correct shape'
      }
      if (!config.advanced.peers.listen) {
        return 'Must have peer interface enabled'
      }
      return
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.advanced.peers.listen = true
    },
  },
  {
    currentError(config) {
      if (!matchBitcoindConfig.test(config)) {
        return 'Config is not the correct shape'
      }
      if (config.advanced.pruning.mode !== 'disabled') {
        return 'Pruning must be disabled (must be an archival node)'
      }
      return
    },
    fix(config) {
      if (!matchBitcoindConfig.test(config)) {
        return
      }
      config.advanced.pruning.mode = 'disabled'
    },
  },
]

export const dependencies: T.ExpectedExports.dependencies = {
  bitcoind: {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info('check bitcoind')
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(configInput)
        if (error) {
          effects.error(`throwing error: ${error}`)
          return { error }
        }
      }
      return { result: null }
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info('autoconfigure bitcoind')
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(configInput)
        if (error) {
          checker.fix(configInput)
        }
      }
      return { result: configInput }
    },
  },
  'bitcoind-testnet': {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info('check bitcoind-testnet')
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(configInput)
        if (error) {
          effects.error(`throwing error: ${error}`)
          return { error }
        }
      }
      return { result: null }
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info('autoconfigure bitcoind-testnet')
      for (const checker of bitcoindChecks) {
        const error = checker.currentError(configInput)
        if (error) {
          checker.fix(configInput)
        }
      }
      return { result: configInput }
    },
  },
};
