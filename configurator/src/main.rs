use std::fs::File;
use std::io::Write;

use serde::{
    Deserialize,
};

#[derive(Deserialize)]
#[serde(rename_all = "kebab-case")]
struct Config {
    bitcoind: BitcoinCoreConfig,
    log_filters: String,
    index_batch_size: Option<u16>,
    index_lookup_limit: Option<u16>,
}

#[derive(Deserialize)]
#[serde(tag = "type")]
enum BitcoinCoreConfig {
    #[serde(rename = "bitcoind")]
    Bitcoind {
        username: String,
        password: String,
    },
    #[serde(rename = "bitcoind-testnet")]
    BitcoindTestnet {
        username: String,
        password: String,
    },
}

fn main() -> Result<(), anyhow::Error> {
    let config: Config = serde_yaml::from_reader(File::open("/data/start9/config.yaml")?)?;

    {
        let mut outfile = File::create("/data/electrs.toml")?;

        let (bitcoin_rpc_user, bitcoin_rpc_pass, bitcoin_rpc_host, bitcoin_rpc_port, bitcoin_p2p_host, bitcoin_p2p_port, network) =
            match config.bitcoind {
                BitcoinCoreConfig::Bitcoind { username, password } => {
                    let hostname = format!("{}", "bitcoind.embassy");
                    let network = format!("{}", "bitcoin");
                    (username, password, hostname.clone(), 8332, hostname.clone(), 8333, network.clone())
                }
                BitcoinCoreConfig::BitcoindTestnet { username, password } => {
                    let hostname = format!("{}", "bitcoind-testnet.embassy");
                    let network = format!("{}", "testnet4");
                    (username, password, hostname.clone(), 48332, hostname.clone(), 8333, network.clone())
                }
            };

        let mut index_batch_size: String = "".to_string();
        if config.index_batch_size.is_some() {
            index_batch_size = format!(
                "index_batch_size = {}",
                config.index_batch_size.unwrap()
            );
        }

        let mut index_lookup_limit: String = "".to_string();
        if config.index_lookup_limit.is_some() {
            index_lookup_limit = format!(
                "index_lookup_limit = {}",
                config.index_lookup_limit.unwrap()
            );
        }

        write!(
            outfile,
            include_str!("electrs.toml.template"),
            bitcoin_rpc_user = bitcoin_rpc_user,
            bitcoin_rpc_pass = bitcoin_rpc_pass,
            bitcoin_rpc_host = bitcoin_rpc_host,
            bitcoin_rpc_port = bitcoin_rpc_port,
            bitcoin_p2p_host = bitcoin_p2p_host,
            bitcoin_p2p_port = bitcoin_p2p_port,
            network = network,
            log_filters = config.log_filters,
            index_batch_size = index_batch_size,
            index_lookup_limit = index_lookup_limit,
        )?;
    }

    Ok(())
}
