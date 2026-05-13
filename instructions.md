# Electrs

Electrs needs a fully-synced Bitcoin archival node to do anything useful. Install **Bitcoin Core** first and let it finish its initial block download before expecting Electrs to come online — until then, Electrs will sit in a waiting state.

## Documentation

- [Electrs upstream README](https://github.com/romanz/electrs/blob/master/README.md) — the upstream project's documentation, including configuration reference and protocol notes.

## What you get on StartOS

- An **Electrum protocol server** that indexes the Bitcoin blockchain and answers wallet queries.
- A **Main** interface exposing both plain TCP (port 50001) and TLS (port 50002), reachable over LAN, `.local`, Tor, and any custom domains you've configured.
- Automatic wiring to your StartOS Bitcoin Core node — RPC, P2P, and cookie authentication are all configured for you. You do not point Electrs at Bitcoin yourself.
- A RocksDB address index stored under the `main` volume (excluded from backups; it rebuilds itself if you restore).

## Getting set up

1. Install **Bitcoin Core** first if it isn't already installed.
2. Start Electrs. On first run it will report **Waiting for Bitcoin to start** or **Waiting for Bitcoin to finish syncing** until your Bitcoin node has completed its initial block download. This can take a long time on a fresh node.
3. Once Bitcoin is fully synced, Electrs will switch to **Electrs is building its address index** while it builds its own index. This typically takes several hours on first run.
4. When the **Sync Progress** health check reports **Fully synced**, point your Electrum wallet at the **Main** interface (TLS on port 50002 is recommended).

## Using Electrs

### Main interface

The **Main** interface is the Electrum protocol endpoint. Copy its address from the **Dashboard** tab into your Electrum wallet's server settings — most wallets default to the TLS port. Electrs serves all standard Electrum protocol queries: balances, history, transaction lookups, mempool tracking.

### Actions

- **Configure** — adjust the log verbosity and two indexer tuning knobs (batch size and per-address lookup limit). Defaults are sensible; only touch these if you have a specific reason.
