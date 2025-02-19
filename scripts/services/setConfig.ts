import { compat, types as T } from "../deps.ts";

// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: T.Config,
) => {
  // deno-lint-ignore no-explicit-any
  const dependsOnBitcoind: { [key: string]: string[] } =
    (newConfig as any)?.bitcoind?.type === 'bitcoind'
      ? { bitcoind: ['synced'] }
      : {}

  // deno-lint-ignore no-explicit-any
  const dependsOnBitcoindTestnet: { [key: string]: string[] } =
    (newConfig as any)?.bitcoind?.type === 'bitcoind-testnet'
      ? { 'bitcoind-testnet': ['synced'] }
      : {}

  return compat.setConfig(effects, newConfig, {
    ...dependsOnBitcoind,
    ...dependsOnBitcoindTestnet,
  })
}
