# Cosmovisor

## Setting up a node using Cosmovisor <a href="#setting-up-a-node-using-cosmovisor" id="setting-up-a-node-using-cosmovisor"></a>

* [Setting up a node using Cosmovisor](https://docs.scrt.network/cosmovisor.html#setting-up-a-node-using-cosmovisor)
* [Install Cosmovisor](https://docs.scrt.network/cosmovisor.html#install-cosmovisor)
* [Set up a new v1.2 node](https://docs.scrt.network/cosmovisor.html#set-up-a-new-v12-node)
* [Migrate a running v1.2 node](https://docs.scrt.network/cosmovisor.html#migrate-a-running-v12-node)
* [Prepare a v1.3 node upgrade (Shockwave Alpha)](https://docs.scrt.network/cosmovisor.html#prepare-a-v13-node-upgrade-shockwave-alpha)

Cosmovisor is a new process manager for cosmos blockchains. It can make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

You should review the docs for Cosmovisor located here: [https://docs.cosmos.network/master/run-node/cosmovisor.html](https://docs.cosmos.network/master/run-node/cosmovisor.html)

## [#](https://docs.scrt.network/cosmovisor.html#install-cosmovisor)Install Cosmovisor <a href="#install-cosmovisor" id="install-cosmovisor"></a>

```
# Get the Cosmovisor binary
wget -O - "https://github.com/cosmos/cosmos-sdk/releases/download/cosmovisor%2Fv1.1.0/cosmovisor-v1.1.0-linux-amd64.tar.gz" | sudo tar -xz -C /bin cosmovisor
sudo chmod +x /bin/cosmovisor

# Make the necessary directory structure for secretd v1.2
mkdir -p ~/.secretd/cosmovisor/genesis/bin

# Setup environment variables for every future bash session
# This will make sure to setup cosmovisor on you shell in
# in case you'll want to run the cosmovisor command manually
echo "# Setup Secret & Cosmovisor
export SCRT_ENCLAVE_DIR="${HOME}/.secretd/cosmovisor/current/bin"
export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${HOME}/.secretd/cosmovisor/current/bin"
export PATH="${PATH}:${HOME}/.secretd/cosmovisor/current/bin"
export DAEMON_NAME=secretd
export DAEMON_HOME="${HOME}/.secretd"
export DAEMON_ALLOW_DOWNLOAD_BINARIES=false
export DAEMON_LOG_BUFFER_SIZE=512
export DAEMON_RESTART_AFTER_UPGRADE=true
export DAEMON_DATA_BACKUP_DIR="${HOME}"
export UNSAFE_SKIP_BACKUP=true" >> ~/.profile
source ~/.profile

# Setup a systemd service
echo "[Unit]
Description=Cosmovisor Secret Network Node
After=network.target

[Service]
Type=simple
ExecStart=/bin/cosmovisor run start
User=${USER}
Restart=on-failure
StartLimitInterval=0
RestartSec=3
LimitNOFILE=65535
LimitMEMLOCK=209715200
Environment=SCRT_ENCLAVE_DIR=${HOME}/.secretd/cosmovisor/current/bin
Environment=LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${HOME}/.secretd/cosmovisor/current/bin
Environment=DAEMON_NAME=secretd
Environment=DAEMON_HOME=${HOME}/.secretd
Environment=DAEMON_ALLOW_DOWNLOAD_BINARIES=false
Environment=DAEMON_LOG_BUFFER_SIZE=512
Environment=DAEMON_RESTART_AFTER_UPGRADE=true
Environment=DAEMON_DATA_BACKUP_DIR=${HOME}
Environment=UNSAFE_SKIP_BACKUP=true

[Install]
WantedBy=multi-user.target
" | sudo tee /etc/systemd/system/cosmovisor.service > /dev/null

sudo systemctl daemon-reload
sudo systemctl enable cosmovisor
```

## [#](https://docs.scrt.network/cosmovisor.html#set-up-a-new-v1-2-node)Set up a new v1.2 node <a href="#set-up-a-new-v1-2-node" id="set-up-a-new-v1-2-node"></a>

```
# Make the necessary directory structure for v1.2
mkdir -p ~/.secretd/cosmovisor/genesis/bin

# Get v1.2 binaries
wget -P /tmp/ "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.2/secretnetwork_v1.2.2_mainnet_amd64.deb"

# Verify v1.2 binaries checksum
echo "1a51d3d9324979ef9a1f56023e458023488b4583bf4587abeed2d1f389aea947 /tmp/secretnetwork_v1.2.2_mainnet_amd64.deb" | sha256sum --check

# Extract v1.2 from archive
dpkg-deb -R /tmp/secretnetwork_v1.2.2_mainnet_amd64.deb /tmp/secretnetwork_v1.2.2_mainnet_amd64.deb.extracted

# Move v1.2 binaries to Cosmovisor's directory
mv /tmp/secretnetwork_v1.2.2_mainnet_amd64.deb.extracted/usr/{local/bin/secretd,lib/librust_cosmwasm_enclave.signed.so,lib/libgo_cosmwasm.so} ~/.secretd/cosmovisor/genesis/bin

# For a query node also move the query enclave
sudo mv /tmp/secretnetwork_v1.2.2_mainnet_amd64.deb.extracted/usr/lib/librust_cosmwasm_query_enclave.signed.so ~/.secretd/cosmovisor/genesis/bin
```

Now the Cosmovisor directory structure should look like this:

```
$ find ~/.secretd/cosmovisor
/home/ubuntu/.secretd/cosmovisor/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/secretd
```

Now you might want to checkout the [How To Join Secret Network as a Full Node](https://docs.scrt.network/node-guides/run-full-node-mainnet.html) guide for syncing a node from height 0 or [Sync with State-Sync](https://docs.scrt.network/node-guides/state-sync.html) for syncing a node from a more recent block height.

After making the proper configurations to your new node, launch it using `sudo systemctl start cosmovisor`. You should now see blocks executing in the logs (`journalctl -fu cosmovisor`).

## [#](https://docs.scrt.network/cosmovisor.html#migrate-a-running-v1-2-node)Migrate a running v1.2 node <a href="#migrate-a-running-v1-2-node" id="migrate-a-running-v1-2-node"></a>

```
# Make the necessary directory structure for v1.2
mkdir -p ~/.secretd/cosmovisor/genesis/bin

# Disable the old secret-node systemd service
sudo systemctl stop secret-node
sudo systemctl disable secret-node

# Move v1.2 binaries to Cosmovisor's directory
sudo mv /usr/local/bin/secretd /usr/lib/{libgo_cosmwasm.so,librust_cosmwasm_enclave.signed.so} ~/.secretd/cosmovisor/genesis/bin

# For a query node also move the query enclave
sudo mv /usr/lib/librust_cosmwasm_query_enclave.signed.so ~/.secretd/cosmovisor/genesis/bin

# Launch the Cosmovisor service
sudo systemctl start cosmovisor
```

Now the Cosmovisor directory structure should look like this:

```
$ find ~/.secretd/cosmovisor
/home/ubuntu/.secretd/cosmovisor/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/secretd
```

To relaunch your node, use `sudo systemctl start cosmovisor`. You should now see blocks executing in the logs (`journalctl -fu cosmovisor`).

## [#](https://docs.scrt.network/cosmovisor.html#prepare-a-v1-3-node-upgrade-shockwave-alpha)Prepare a v1.3 node upgrade (Shockwave Alpha) <a href="#prepare-a-v1-3-node-upgrade-shockwave-alpha" id="prepare-a-v1-3-node-upgrade-shockwave-alpha"></a>

The "Shockwave Alpha" upgrade is anticipated to be on Wednesday April 27th, 2022 at 2:00PM UTC. Below are instructions to prepare Cosmovisor for automatically upgrading your node to v1.3.

```
# Make the necessary directory structure for v1.3
mkdir -p ~/.secretd/cosmovisor/upgrades/v1.3/bin

# Get & verify v1.3 binaries

# Uncomment goleveldb or rocksdb:

# wget -P /tmp/ "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_1.3.0_mainnet_goleveldb_amd64.deb"
# echo "b5a4387fd3af477f1d7d0c8ab13debc9b9ad9abccb59c82b1a35cc8a90db902b /tmp/secretnetwork_1.3.0_mainnet_goleveldb_amd64.deb" | sha256sum --check

# or rocksdb
#wget -P /tmp/ "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_1.3.0_mainnet_rocksdb_amd64.deb"
#echo "a1fc48003b3b563aae216901fc5821bb11164746c61b86507bc813cb49bd85cb /tmp/secretnetwork_1.3.0_mainnet_rocksdb_amd64.deb" | sha256sum --check


# Extract v1.3 from archive
dpkg-deb -R /tmp/secretnetwork_1.3.0_mainnet_*_amd64.deb /tmp/secretnetwork_1.3.0_mainnet_amd64.deb.extracted

# Move v1.3 binaries to Cosmovisor's directory
mv /tmp/secretnetwork_1.3.0_mainnet_amd64.deb.extracted/usr/{local/bin/secretd,lib/librust_cosmwasm_enclave.signed.so,librust_cosmwasm_query_enclave.signed.so,lib/libgo_cosmwasm.so} ~/.secretd/cosmovisor/upgrades/v1.3/bin
```

Now the Cosmovisor directory structure should look like this:

```
$ find ~/.secretd/cosmovisor
/home/ubuntu/.secretd/cosmovisor/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/secretd
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/librust_cosmwasm_query_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/secretd
```

If set up properly, when the time comes Cosmovisor will perform an automatic v1.2 to v1.3 upgrade.
