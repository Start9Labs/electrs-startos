import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.9.14.2": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            return {
              "electrum-tor-address": config["electrum-tor-address"],
              ...config.bitcoind,
              ...config.advanced,
            };
          },
          true,
          { version: "0.9.14.2", type: "up" }
        ),
        down: compat.migrations.updateConfig(
          (config: any) => {
            return {
              "electrum-tor-address": config["electrum-tor-address"],
              bitcoind: {
                user: config.user,
                password: config.password,
              },
              advanced: {
                "log-filters": config["log-filters"],
                "index-batch-size": config["index-batch-size"],
                "index-lookup-limit": config["index-lookup-limit"],
              },
            };
          },
          true,
          { version: "0.9.14.2", type: "down" }
        ),
      },
    },
    "0.11.0"
  );
