# Electrum Rust Server (electrs)

`electrs` is an efficient re-implementation of Electrum Server written in Rust. Its main purpose is as an indexer for external wallets that use bitcoind as a backend. There are all sorts of wallets that connect to bitcoind using the Electrum protocol. This StartOS package allows you to run your own electrum server connected to your own Bitcoin Core node, which is the most private, uncensorable, yet fast and easy way to use Bitcoin.
In order to link a wallet, check out the guides at https://github.com/start9labs/electrs-startos/tree/master/docs/wallets.md.

# Syncing

**WARNING: Make sure you have at least a gigabyte of free RAM before starting Electrs. If you don't, your system will grind to a halt and you will be very unhappy. Pay especially close attention if you're running Mastodon and you have a 4GB system. We recommend that you temporarily stop any services that use lots of RAM, especially Mastodon and Synapse. Keep in mind that Bitcoin Core will also use more RAM than usual during this initial sync.**

When you first start Electrs, it will start building the indexes it needs in order to serve transactions to the wallets that subscribe to it. Electrs will not be usable until after this process completes. On StartOS, this shouldn't take more than about a day.

Once your electrum server is synced, it will start listening for subscriptions from external wallets.

# Configuration

electrs on StartOS requires a fully synced archival Bitcoin Core node as a source for blockchain data. It uses both the RPC interface and the peer interface of `bitcoind` in order to function. This requirement will be automatically enforced by StartOS.
