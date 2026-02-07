<p align="center">
  <img src="icon.png" alt="Electrs Logo" width="21%">
</p>

# Electrs on StartOS

> **Upstream docs:** <https://github.com/romanz/electrs>
>
> Everything not listed in this document should behave the same as upstream
> Electrs v0.11.0. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[Electrs](https://github.com/romanz/electrs) is an efficient Electrum Server implementation in Rust, optimized for personal use. It indexes the Bitcoin blockchain and serves Electrum protocol queries to wallets.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | Custom `dockerBuild` (built from source) |
| Architectures | x86_64, aarch64 |
| Entrypoint | `electrs` |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | Configuration and index database |
| (bitcoind dependency) | `/mnt/bitcoind` | Read-only access to Bitcoin Core data for cookie auth |
| (assets) | `/assets` | Scripts for health checks |

**StartOS-specific files:**

- `electrs.toml` — configuration file managed by StartOS
- `db/` — RocksDB index database (excluded from backups)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Bitcoin connection | Manual configuration (RPC address, cookie path) | Auto-configured via dependency |
| Configuration | CLI arguments or config file | Configure action in StartOS UI |
| Initial sync | ~6.5 hours for full blockchain | Same (depends on hardware) |

**Key difference:** On StartOS, the Bitcoin Core connection is fully automatic — Electrs connects to `bitcoind.startos:8332` for RPC and `bitcoind.startos:8333` for P2P, using cookie authentication from the mounted dependency volume.

**First run:** Initial indexing takes several hours depending on your hardware. The service will show "loading" status until sync completes.

---

## Configuration Management

| Setting | Upstream Method | StartOS Method |
|---------|-----------------|----------------|
| `cookie_file` | Config/CLI | Fixed: `/mnt/bitcoind/.cookie` |
| `daemon_rpc_addr` | Config/CLI | Fixed: `bitcoind.startos:8332` |
| `daemon_p2p_addr` | Config/CLI | Fixed: `bitcoind.startos:8333` |
| `network` | Config/CLI | Fixed: `bitcoin` |
| `electrum_rpc_addr` | Config/CLI | Fixed: `0.0.0.0:50001` |
| `log_filters` | Config/CLI | Configure action: "Log Level" |
| `index_batch_size` | Config/CLI | Configure action: "Index Batch Size" |
| `index_lookup_limit` | Config/CLI | Configure action: "Index Lookup Limit" |

**Configuration options NOT exposed on StartOS:**

- `db_dir` — fixed to `/data/db`
- `skip_block_download_wait` — not exposed
- `jsonrpc_timeout` — not exposed
- `server_banner` — not exposed
- `signet_magic` — not applicable (mainnet only)

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Electrum | 50001 | TCP (Electrum protocol) | Wallet connections (unencrypted) |
| Electrum SSL | 50002 | TCP+SSL | Wallet connections (encrypted) |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Configure

| Property | Value |
|----------|-------|
| ID | `config` |
| Name | Configure |
| Visibility | Enabled (always visible) |
| Availability | Any status |
| Purpose | Adjust Electrs settings |

**Options:**

| Setting | Default | Description |
|---------|---------|-------------|
| Log Level | INFO | Verbosity: ERROR, WARN, INFO, DEBUG, TRACE |
| Index Batch Size | 10 | Max blocks to request from Bitcoin Core per batch (1-10000) |
| Index Lookup Limit | 0 | Max transactions to lookup before timeout (0 = unlimited) |

---

## Dependencies

| Dependency | Required | Purpose |
|------------|----------|---------|
| Bitcoin Core | **Yes** | Provides blockchain data via RPC and P2P |

The service automatically:
- Connects to Bitcoin Core RPC at `bitcoind.startos:8332`
- Connects to Bitcoin Core P2P at `bitcoind.startos:8333`
- Uses cookie authentication from the mounted volume
- Restarts if the Bitcoin Core cookie file changes

**Bitcoin Core requirements:**
- `server=1` must be enabled (default on StartOS)
- `txindex=1` is NOT required (unlike some other Electrum servers)
- Works with pruned nodes

---

## Backups and Restore

**Included in backup:**

- `main` volume configuration files (`electrs.toml`)

**Excluded from backup:**

- `db/` directory — the RocksDB index database

**Restore behavior:**

- Configuration is restored
- Index database must be rebuilt from scratch (will re-sync on first start)
- Re-indexing takes several hours

---

## Health Checks

| Check | Method | Grace Period |
|-------|--------|--------------|
| Electrum Server | Port 50001 listening | Default |
| Sync Progress | Custom script | Default |

**Messages:**

- Server ready: "Electrum server is ready and accepting connections"
- Server error: "Electrum server is unreachable"
- Sync: Shows progress or "loading" during initial sync

---

## Limitations and Differences

1. **Mainnet only** — network is fixed to `bitcoin`; testnet/signet not supported
2. **Fixed Bitcoin connection** — must use the StartOS Bitcoin Core dependency; cannot connect to external Bitcoin nodes
3. **Custom-built image** — built from source rather than using pre-built binaries
4. **Index excluded from backups** — restoring from backup requires full re-indexing
5. **Limited configuration** — some advanced options (server banner, timeouts) not exposed

---

## What Is Unchanged from Upstream

- Full Electrum protocol v1.4 support
- RocksDB index storage
- Fast synchronization performance
- Low CPU/memory usage after initial sync
- Efficient mempool tracking
- All standard Electrum wallet compatibility
- Query functionality (balance, history, transactions)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: electrs
upstream_version: 0.11.0
image: dockerBuild (custom)
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  electrum: 50001
  electrum_ssl: 50002
dependencies:
  - bitcoind (required)
fixed_config:
  cookie_file: /mnt/bitcoind/.cookie
  daemon_rpc_addr: bitcoind.startos:8332
  daemon_p2p_addr: bitcoind.startos:8333
  network: bitcoin
  electrum_rpc_addr: 0.0.0.0:50001
startos_managed_config:
  - log_filters
  - index_batch_size
  - index_lookup_limit
actions:
  - config (enabled, any)
health_checks:
  - port_listening: 50001
  - sync_progress: custom script
backup_volumes:
  - main (excludes /db)
```
