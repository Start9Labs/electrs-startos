# Electrs

Electrs needs a fully-synced Bitcoin archival node to do anything useful. Install **Bitcoin** first and let it finish its initial block download before expecting Electrs to come online — until then, Electrs will sit in a waiting state.

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — pointing a wallet at your own Electrum server — certificates, SSL and Tor — which wallets work, and archival versus pruned Bitcoin nodes.
- [Electrs upstream README](https://github.com/romanz/electrs/blob/master/README.md) — the upstream project's documentation, including configuration reference and protocol notes.

## What you get on StartOS

- An **Electrum protocol server** that indexes the Bitcoin blockchain and answers wallet queries.
- An **Electrum (SSL)** interface exposing the Electrum protocol, reachable over LAN, `.local`, Tor, and any custom domains you've configured. Every address StartOS shows for it is an `ssl://` one — StartOS terminates TLS with the device's certificate — so your wallet needs SSL turned on.
- Automatic wiring to your StartOS Bitcoin node — connectivity and authentication are configured for you. You do not point Electrs at Bitcoin yourself.
- A RocksDB address index stored under the `main` volume (excluded from backups; it rebuilds itself if you restore).

## Getting set up

1. Install **Bitcoin** first if it isn't already installed.
2. Start Electrs. On first run it will report **Electrum server is starting** until it has bound its port, and it will not begin indexing until your Bitcoin node has completed its initial block download. This can take a long time on a fresh node.
3. Once Bitcoin is fully synced, Electrs will build its own index. When it can answer between indexing batches, **Sync Progress** shows Electrs's indexed block beside Bitcoin's current block. This typically takes several hours on first run. An update from an older Electrs release rebuilds the index in the new format too and requires at least 120 GB of free space.
4. When the **Sync Progress** health check reports **Fully synced**, point your wallet at the **Electrum (SSL)** interface — copy the address from the **Interfaces** page rather than typing a port from memory.

Once **Fully synced** appears for the current index format, routine restarts reuse that index. If **Sync Progress** later reports **Electrs is not responding. It is likely busy indexing; this usually clears on its own.**, that is a busy moment — Electrs answers wallet queries only between indexing batches — and it clears by itself, normally within a minute or two. It does not mean the index is being rebuilt, and it is not a reason to reindex.

## Using Electrs

### Electrum (SSL) interface

Copy an address from the **Interfaces** page into your wallet's server settings. It is shown as an `ssl://` URL, and the host and port in it are what your wallet needs — **take the port from that address rather than assuming one**, since StartOS assigns it and it is not always the same number on every server.

Only the encrypted endpoint is reachable from off this server, so your wallet's SSL option has to be on, and it has to be told to trust the certificate StartOS serves. The one exception is a Tor address you add with its **SSL** toggle turned off: that address alone is plain TCP, so turn SSL **off** in your wallet when you connect over it. Both steps, and where the settings live in each wallet, are in the [Start9 guide to connecting a wallet](https://docs.start9.com/bitcoin-guides/connecting-wallets). The Electrum desktop wallet needs a file placed by hand and is covered there too.

Once connected, Electrs serves all standard Electrum protocol queries: balances, history, transaction lookups, mempool tracking.

### Actions

- **Configure** — adjust the log verbosity.
