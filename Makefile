ELECTRS_SRC := $(shell find ./electrs/src) electrs/Cargo.toml electrs/Cargo.lock
CONFIGURATOR_SRC := $(shell find ./configurator -name target -prune -o -type f -print) configurator/Cargo.toml configurator/Cargo.lock
PKG_VERSION := $(shell yq ".version" manifest.yaml)
PKG_ID := $(shell yq ".id" manifest.yaml)
UID := $(shell id -u)
GID := $(shell id -g)
TS_FILES := $(shell find . -name \*.ts )

.DELETE_ON_ERROR:

all: verify

clean:
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js
	rm -fr docker-images/

verify: $(PKG_ID).s9pk
	@start-sdk verify s9pk $(PKG_ID).s9pk
	@echo " Done!"
	@echo "   Filesize: $(shell du -h $(PKG_ID).s9pk) is ready"

install:
ifeq (,$(wildcard ~/.embassy/config.yaml))
	@echo; echo "You must define \"host: http://server-name.local\" in ~/.embassy/config.yaml config file first"; echo
else
	start-cli package install $(PKG_ID).s9pk
endif

# for rebuilding just the arm image. will include docker-images/x86_64.tar into the s9pk if it exists
arm: docker-images/aarch64.tar scripts/embassy.js
	start-sdk pack

# for rebuilding just the x86 image. will include docker-images/aarch64.tar into the s9pk if it exists
x86: docker-images/x86_64.tar scripts/embassy.js
	start-sdk pack

$(PKG_ID).s9pk: manifest.yaml instructions.md electrs/LICENSE icon.png scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
	start-sdk pack

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh check-synced.sh check-electrum.sh configurator/target/x86_64-unknown-linux-musl/release/configurator $(ELECTRS_SRC)
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 --build-arg ARCH=x86_64 --build-arg PLATFORM=amd64 -o type=docker,dest=docker-images/x86_64.tar .

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh check-synced.sh check-electrum.sh configurator/target/aarch64-unknown-linux-musl/release/configurator $(ELECTRS_SRC)
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 --build-arg ARCH=aarch64 --build-arg PLATFORM=arm64 -o type=docker,dest=docker-images/aarch64.tar .

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --user $(UID):$(GID) --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src messense/rust-musl-cross:aarch64-musl cargo build --release
	docker run --user $(UID):$(GID) --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src messense/rust-musl-cross:aarch64-musl musl-strip target/aarch64-unknown-linux-musl/release/configurator
# Docker 26 + buildkit 0.13.2 seem to have issues with building a context that contains multiple hardlinked files, work-around that by breaking the hardlink
	cp configurator/target/aarch64-unknown-linux-musl/release/configurator configurator/target/aarch64-unknown-linux-musl/release/configurator.tmp
	mv configurator/target/aarch64-unknown-linux-musl/release/configurator.tmp configurator/target/aarch64-unknown-linux-musl/release/configurator

configurator/target/x86_64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --user $(UID):$(GID) --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src messense/rust-musl-cross:x86_64-musl cargo build --release
	docker run --user $(UID):$(GID) --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src messense/rust-musl-cross:x86_64-musl musl-strip target/x86_64-unknown-linux-musl/release/configurator
	cp configurator/target/x86_64-unknown-linux-musl/release/configurator configurator/target/x86_64-unknown-linux-musl/release/configurator.tmp
	mv configurator/target/x86_64-unknown-linux-musl/release/configurator.tmp configurator/target/x86_64-unknown-linux-musl/release/configurator

scripts/embassy.js: $(TS_FILES)
	deno run --allow-read --allow-write --allow-env --allow-net scripts/bundle.ts
