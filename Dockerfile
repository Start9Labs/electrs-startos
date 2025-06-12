FROM rust:1.83-slim-bookworm AS builder

RUN apt-get update -qqy && \
    apt-get upgrade -qqy && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    clang \
    cmake \
    librocksdb-dev && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

WORKDIR /build
COPY ./electrs .
ENV ROCKSDB_INCLUDE_DIR=/usr/include
ENV ROCKSDB_LIB_DIR=/usr/lib
RUN rustup toolchain install stable
RUN cargo +stable install --locked --path .

FROM debian:bookworm-slim AS final

RUN apt-get update -qqy && \
    apt-get upgrade -qqy && \
    DEBIAN_FRONTEND=noninteractive apt-get install -qqy --no-install-recommends \
    bash \
    curl \
    ca-certificates \
    librocksdb7.8 && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ARG ARCH
ARG PLATFORM

COPY --from=builder /usr/local/cargo/bin/electrs /bin/electrs

WORKDIR /data

STOPSIGNAL SIGINT
