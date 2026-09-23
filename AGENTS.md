# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`daemon_rpc_addr` must stay on Bitcoin's bridge-only `rpc-local` binding.** Bindex fetches blocks and spent outputs over HTTP REST on that address; the exported `rpc` binding lands on a JSON-RPC-only proxy.
- **Omit the address rather than defaulting it while bitcoind is unresolved.** The TOML field is `z.string().optional()` precisely so it can be absent until the reactive read heals it in.
- **Keep the `tw-reuse` oneshot until #89 closes.** Without `tcp_tw_reuse=1` bindex's connection churn exhausts the container's ephemeral ports within a minute of indexing and electrs crash-loops; upstream only escapes it by talking to loopback. README § Image and Container Runtime; the issue carries the removal test.
- **Delete `db-0.11` in `main`, not in a migration.** It is what a downgrade to the previous release restores, so it has to survive until Bitcoin serves `rpc-local`.
- **Don't set `auth` in `electrs.toml`.** electrs exits if `auth` and `cookie_file` are both present; the model pins `auth` to undefined for that reason.
- **Sync is the indexed tip, not Electrum RPC availability.** Electrs answers wallet queries from a partial index; report success only when `blockchain.headers.subscribe` is within one block of Bitcoin's REST `chaininfo` height. Probe `blockchain.block.header(0)` first because `headers.subscribe` panics upstream on an empty index.
- **Don't name a literal external port in docs.** StartOS assigns it and never changes it for an existing binding, so it is per-server — `start-cli package host binding list electrs electrum` reads the live value.
