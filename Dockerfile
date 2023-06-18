FROM rust:1.69.0-slim AS builder

ARG VERSION

WORKDIR /build

RUN apt-get update
RUN apt-get install -y git clang cmake libsnappy-dev

COPY ./electrs .

RUN cargo install --locked --path .

FROM debian:bullseye-slim

RUN apt update && apt upgrade -y && apt install -y ca-certificates bash curl netcat tini wget

#Let debian repos be fetched securely:
#RUN sed -i "s/http:\/\//https:\/\//g" /etc/apt/sources.list

ARG PLATFORM
ARG ARCH
RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

COPY --from=builder /usr/local/cargo/bin/electrs /usr/local/bin/electrs

#ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
#ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
#RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-electrum.sh /usr/local/bin/check-electrum.sh
RUN chmod a+x /usr/local/bin/check-electrum.sh
ADD ./check-synced.sh /usr/local/bin/check-synced.sh
RUN chmod a+x /usr/local/bin/check-synced.sh

WORKDIR /data

STOPSIGNAL SIGINT
