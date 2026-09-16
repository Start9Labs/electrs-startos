<p align="center">
  <img src="icon.svg" alt="Electrs Logo" width="21%">
</p>

# Electrs on StartOS

> Everything not listed in this document should behave the same as upstream
> electrs. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[electrs](https://github.com/romanz/electrs/) is an Electrum server: it builds an address index over your own Bitcoin node so wallets can query their history without asking anyone else. This package wires it to that node's REST API over the internal bridge, serves it over TLS, and reports the one thing upstream cannot — how far through its index it has got.

- **Upstream repo:** <https://github.com/romanz/electrs/>
- **Wrapper repo:** <https://github.com/Start9Labs/electrs-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here from upstream source.

| Property      | Value                               |
| ------------- | ----------------------------------- |
| Image         | Built from this repo's `Dockerfile` |
| Architectures | x86_64, aarch64                     |
| Command       | `electrs`                           |

| Subcontainer | Purpose                                  |
| ------------ | ---------------------------------------- |
| `electrs`    | The only daemon — the one to `attach` to |

A `tw-reuse` oneshot runs first and sets `net.ipv4.tcp_tw_reuse=1` in the container's network namespace. electrs fetches blocks from Bitcoin's REST API on ten threads through a pool that keeps three connections, so it opens a fresh connection for most blocks; upstream talks to loopback, where the kernel reuses TIME_WAIT ports, but over the bridge nothing does and the ephemeral range is exhausted within a minute of indexing (`EADDRNOTAVAIL`, then `EADDRINUSE` on the Electrum port as it is handed out as a source port). The sysctl is per-namespace and touches only this container's outbound connections.

## Volume and Data Layout

One volume, plus a read-only view of Bitcoin's.

| Volume                | Mount Point     | Purpose                                  |
| --------------------- | --------------- | ---------------------------------------- |
| `main`                | `/data`         | The address index, the config, the store |
| Bitcoin's `main` (ro) | `/mnt/bitcoind` | The RPC cookie                           |

**The index is the bulk of the volume and is excluded from backups** — see [Backups and Restore](#backups-and-restore). Everything else on `main` is small.

## File Models

Two models, and most of the config file is pinned rather than configurable.

| File           | Format | Modelled                | Written by                   |
| -------------- | ------ | ----------------------- | ---------------------------- |
| `electrs.toml` | TOML   | Yes — `FileHelper.toml` | Init, `main`, and the action |
| `store.json`   | JSON   | Yes — `FileHelper.json` | `main`                       |

Its fields fall into three groups:

- **Pinned.** The cookie path, the network, and the Electrum bind address are `z.literal(...).catch(...)`, so a changed value is **repaired on read** rather than merely overwritten. The auth field is pinned to _undefined_ for a specific reason: electrs exits outright if both an auth value and a cookie file are set.
- **Resolved at start.** The Bitcoin RPC address is written by `main` from the live bridge address. **When Bitcoin is absent it is omitted rather than defaulted**, so electrs fails visibly and the reactive read heals it in with one restart when Bitcoin appears.
- **User-owned via the action.** The log level.

Every other upstream option — the database directory, the block-download wait, the RPC timeout, the server banner — is fixed or not exposed.

`store.json` holds two flags the package uses to avoid lying to the user: whether the index has _ever_ finished, and whether the completion notification has been sent. Both matter to how sync is reported — see [Health Checks](#health-checks).

## Dependencies

One, and it is required.

| Dependency | Required | Health checks required      | Mounted                              | Why                       |
| ---------- | -------- | --------------------------- | ------------------------------------ | ------------------------- |
| Bitcoin    | Yes      | `bitcoind`, `sync-progress` | `main`, read-only at `/mnt/bitcoind` | Chain data and the cookie |

**Requiring Bitcoin's own sync check is deliberate.** While Bitcoin is still doing its initial download, electrs reports its dependency as unsatisfied rather than running a duplicate poll of its own — the state shows in one place instead of two.

**Bitcoin must not be pruned**, and a recurring task enforces it: electrs needs an archival node. It does **not** need Bitcoin's transaction index, unlike some other Electrum servers.

**Electrs uses Bitcoin's direct RPC/REST listener over the bridge-only `rpc-local` binding.** The exported `rpc` binding lands on a JSON-RPC-only proxy, so it cannot serve the REST endpoints Electrs requires. The dependency floor keeps incompatible Bitcoin releases from satisfying the package.

**The service also restarts when Bitcoin's cookie changes**, watched directly on the mounted file. An absent cookie means Bitcoin is down, and is deliberately not treated as a change.

## Network Access and Interfaces

One interface, and the difference between its two ports is the thing to understand.

| Interface      | Id     | Type | Internal Port | Description                              |
| -------------- | ------ | ---- | ------------- | ---------------------------------------- |
| Electrum (SSL) | `main` | api  | 50001         | The Electrum protocol endpoint, over SSL |

electrs listens **unencrypted** on 50001 inside the container, and StartOS terminates TLS in front of it. **TLS is the only way in over LAN, `.local` and domains**, which is what makes the name accurate. Tor is the one place a plaintext address is reachable: the Tor service points an onion at whichever bridge address its SSL toggle selects, so an onion added with that toggle off carries plain TCP.

A plaintext external port is allocated too, but it is reachable only at the bridge address, by the host and by other services, source-filtered to that subnet. No LAN or WAN gateway gets a forward for it. That is the address dependents such as Mempool, Specter and Canary resolve, and it is what replaced the retired `.startos` DNS name.

The scheme override is what renders an address as `ssl://host:port`; without it the bind would print a bare `host:port` with nothing marking it as TLS.

**Clients that accept or pin an unrecognised certificate connect as-is.** The Electrum desktop wallet is the exception — it rejects the device's CA chain on every address, and needs the client-side step documented at <https://docs.start9.com/bitcoin-guides/connecting-wallets>.

**The external port is per-server, and permanent.** The preferred port is only a preference, and whatever StartOS assigns to a binding never changes — only uninstall and reinstall reassigns it. Read the live value with `start-cli package host binding list electrs electrum` rather than assuming. Servers migrated from the previous generation are the known case where it differs: their old manifest bound a single plaintext port over Tor, and rebinding the same host and internal port left the TLS leg on 50001. Those servers serve `ssl://host:50001` and will keep doing so.

## Installation and First-Run Flow

Install seeds the config and nothing else. There is no credential and no task on this service.

What governs the first run is Bitcoin: electrs cannot index until Bitcoin has finished its own sync, and the dependency's sync check is what holds it there. Once Bitcoin is ready, electrs begins building its address index, which **takes hours on first run** and is the longest thing this package does. An update that changes the index format rebuilds it too; the update to the current format requires at least 120 GB of free space.

A notification is sent when the index first completes, so the wait does not have to be watched.

## Actions

One action.

### Configure

Sets the log level in `electrs.toml`.

- **Cost:** applies on restart.
- **Repeat safety:** idempotent.

## Tasks

One, and it appears on **Bitcoin's** page rather than this one.

| Task                     | Severity   | Raised when       | Cleared when                   |
| ------------------------ | ---------- | ----------------- | ------------------------------ |
| Bitcoin's Auto-Configure | `critical` | Bitcoin is pruned | Pruning is disabled on Bitcoin |

It is declared **recurring**, so re-enabling pruning brings it back. The user sees it on Bitcoin's page with nothing there explaining that electrs asked for it.

## Health Checks

Two checks, and the second one is the interesting one.

| Check     | Displayed as      | Method                                     |
| --------- | ----------------- | ------------------------------------------ |
| `electrs` | "Electrum Server" | The Electrum port is listening             |
| `sync`    | "Sync Progress"   | Electrs's indexed tip versus Bitcoin's tip |

**"Electrum Server" going green does not mean electrs is usable.** electrs binds its listener _before_ it connects to Bitcoin, so the port is open throughout the wait for Bitcoin's sync and throughout the index build. A not-listening result therefore means electrs has not started yet — not that it is blocked. The check reports `starting` rather than failure for exactly that reason.

**"Sync Progress" compares chain heights.** Bitcoin's tip comes from its REST `chaininfo`; electrs's indexed tip comes from `blockchain.headers.subscribe`. The check reports success only when electrs is no more than one block behind. While electrs can answer, the loading message shows both heights.

During an index build electrs processes a whole batch before servicing requests, so a probe can time out between progress updates. The check retries a timeout only after the index has completed once, when a long non-answer is surprising enough to recheck. Before the first completion it reports that the index is building; afterwards it reports a busy indexer rather than suggesting a routine restart discarded the index.

## Backups and Restore

The `main` volume is copied **except the index**, which is excluded.

So the backup is the configuration and the two flags — kilobytes rather than the tens of gigabytes the index occupies. The trade is explicit: a restored instance **rebuilds its index from scratch**, taking the same hours a fresh install does, and nothing that depends on electrs works until it finishes.

Backing the index up would not be much better than rebuilding it: it is large, it is derived entirely from Bitcoin, and a torn copy of a live database is worse than no copy.

## Limitations and Differences

1. **The index is not backed up**, so a restore means rebuilding it — hours.
2. **Bitcoin must be unpruned**, enforced by a recurring task. Its transaction index is not needed.
3. **Mainnet only.** The network is pinned in the config.
4. **Most of upstream's configuration is not exposed** — the database directory, the RPC timeout, the server banner, and the block-download wait are all fixed or absent.
5. **The Electrum desktop wallet needs a client-side certificate step**; other wallets do not.
6. **The external port is assigned once and never changes** for an existing binding, so it may not be the preferred one.

---

## Quick Reference for AI Consumers

```yaml
package_id: electrs
image: built from ./Dockerfile
architectures:
  - x86_64
  - aarch64
subcontainers:
  - electrs
volumes:
  main: /data # bitcoin's main volume is mounted read-only at /mnt/bitcoind
file_models:
  - electrs.toml
  - store.json # everSynced / syncNotified flags
startos_managed_env_vars: [] # configuration is written into electrs.toml
dependencies:
  - bitcoind # required, kind: running, checks: bitcoind + sync-progress
interfaces:
  main: { type: api, port: 50001 } # TLS-terminated by StartOS; plaintext is bridge-only
actions:
  - config
tasks:
  - { action: 'bitcoind:autoconfig', severity: critical } # on Bitcoin's page, recurring
health_checks:
  - electrs # displayed "Electrum Server"; binds before it connects to Bitcoin
  - sync # displayed "Sync Progress"; compares indexed and Bitcoin tips
```
