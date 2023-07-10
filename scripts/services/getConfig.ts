import { types as T, compat } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "electrum-tor-address": {
    name: "Electrum Tor Address",
    description: "The Tor address for the electrum interface.",
    type: "pointer",
    subtype: "package",
    "package-id": "electrs",
    target: "tor-address",
    interface: "electrum",
  },
  user: {
    type: "pointer",
    name: "RPC Username",
    description: "The username for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.username",
  },
  password: {
    type: "pointer",
    name: "RPC Password",
    description: "The password for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.password",
  },
  "log-filters": {
    type: "enum",
    name: "Log Filters",
    values: ["ERROR", "WARN", "INFO", "DEBUG", "TRACE"],
    "value-names": {
      ERROR: "Error",
      WARN: "Warning",
      INFO: "Info",
      DEBUG: "Debug",
      TRACE: "Trace",
    },
    default: "INFO",
  },
  "index-batch-size": {
    type: "number",
    name: "Index Batch Size",
    placeholder: 10,
    description:
      "Maximum number of blocks to request from bitcoind per batch. Defaults to 10.",
    nullable: true,
    range: "[1,10000]",
    integral: true,
    units: "blocks",
  },
  "index-lookup-limit": {
    type: "number",
    name: "Index Lookup Limit",
    placeholder: 200,
    description:
      "Number of transactions to lookup before returning an error, to prevent 'too popular' addresses from causing the RPC server to time out. Defaults to 200.",
    nullable: true,
    range: "[1,10000]",
    integral: true,
    units: "transactions",
  },
});
