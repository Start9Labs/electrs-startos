# Electrum Rust Server (electrs)

`electrs` is an efficient re-implementation of Electrum Server written in Rust. Its main purpose is as an indexer for external wallets that use bitcoind as a backend. There are all sorts of wallets that connect to bitcoind using the Electrum protocol. This StartOS package allows you to run your own electrum server connected to your own Bitcoin node, which is the most private, uncensorable, yet fast and easy way to use Bitcoin.

## Getting Started
### Syncing

**WARNING: Make sure you have at least a gigabyte of free RAM before starting Electrs. If you don't, your system will grind to a halt and you will be very unhappy. We recommend that you temporarily stop any services that use lots of RAM. Keep in mind that Bitcoin Core will also use more RAM than usual during this initial sync.**

When you first start Electrs, it will start building the indexes it needs in order to serve transactions to the wallets that subscribe to it. Electrs will not be usable until after this process completes. On a Start9 device, this shouldn't take more than a day.

Once your electrum server is synced, it will start listening for subscriptions from external wallets.

### Config

electrs on StartOS requires a fully synced archival Bitcoin Core or Bitcoin Knots node as a source for blockchain data. It uses both the RPC interface and the peer interface of `bitcoind` in order to function. This requirement will be automatically enforced by StartOS.

### Interfaces

Starting from StartOS v0.4.0 Electrs is available both over LAN (.local and IP) and TOR interfaces by default. You can configure additional interfaces from the **Service Interfaces** section.


## Connecting Wallets

Any wallet that allows a user to set an electrum server should work by copying and pasting the interface details that it requests into the appropriate fields. Below is a non exhaustive list of wallets that have been tested. If something doesn't seem to work, it's always a good idea to check the wallet developers own documentation for any changes or updates to a process.

- [BitBox](integrations/bitbox/guide.md)
- [Blockstream App (Green)](integrations/blockstream/guide.md)
- [BlueWallet](integrations/bluewallet/guide.md)
- [Electrum](integrations/electrum/guide.md)
- [Foundation Envoy](integrations/envoy/guide.md)
- [Nunchuk](integrations/nunchuk/guide.md)
- [Sparrow](integrations/sparrow/guide.md)
- [Trezor](integrations/trezor/guide.md)