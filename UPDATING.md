# Updating the upstream version

Electrs is built from source via the `electrs/` git submodule (see `.gitmodules`) — there is no `dockerTag` in the manifest, no cargo-install version pin in the `Dockerfile`. The submodule commit is the version pin.

## Determining the upstream version

- **electrs** (`romanz/electrs`, https://github.com/romanz/electrs)
  ```bash
  gh release view -R romanz/electrs --json tagName -q .tagName
  ```
  Compare against the commit currently checked out in the `electrs/` submodule:
  ```bash
  git -C electrs describe --tags --exact-match HEAD
  ```

## Applying the bump

- **electrs** — advance the submodule to the new tag and stage the gitlink:
  ```bash
  git -C electrs fetch --tags
  git -C electrs checkout v<new version>
  git add electrs
  ```
