FROM rust:1.91.1-slim-trixie AS builder

RUN apt-get update -qqy && \
    apt-get upgrade -qqy && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    build-essential \
    libclang-dev \
    librocksdb-dev && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

WORKDIR /build
COPY ./electrs .
ENV ROCKSDB_INCLUDE_DIR=/usr/include
ENV ROCKSDB_LIB_DIR=/usr/lib
RUN rustup toolchain install stable
RUN cargo +stable install --locked --path .

FROM debian:trixie-slim AS final

RUN apt-get update -qqy && \
    apt-get upgrade -qqy && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    bash \
    curl \
    tini \
    netcat-openbsd \
    ca-certificates \
    librocksdb9.10 && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ARG ARCH
ARG PLATFORM
RUN curl -sLo /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

COPY --from=builder /usr/local/cargo/bin/electrs /bin/electrs

ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-electrum.sh /usr/local/bin/check-electrum.sh
RUN chmod a+x /usr/local/bin/check-electrum.sh
ADD ./check-synced.sh /usr/local/bin/check-synced.sh
RUN chmod a+x /usr/local/bin/check-synced.sh

WORKDIR /data

STOPSIGNAL SIGINT

ENTRYPOINT ["docker_entrypoint.sh"]
