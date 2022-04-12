# :warning: DRAFT :warning:

# :warning: THIS DOCUMENT IS NOT FINAL YET :warning:

# :warning: DO NOT MAKE ANY CHANGES TO YOUR NODES BASED ON THIS DOC :warning:

# Secret Network v1.3 "Shockwave Alpha" Network Upgrade Instructions

## :warning: IMPORTANT NOTES :warning:

- All coordination efforts will be done in the "SN Validators" Telegram group.
- Make sure to [backup your validator](./backup/backup-a-validator.md) before making any chnages.
- Please read carefully before you begin the upgrade.

- [:warning: DRAFT :warning:](#warning-draft-warning)
- [:warning: THIS DOCUMENT IS NOT FINAL YET :warning:](#warning-this-document-is-not-final-yet-warning)
- [:warning: DO NOT MAKE ANY CHANGES TO YOUR NODES BASED ON THIS DOC :warning:](#warning-do-not-make-any-changes-to-your-nodes-based-on-this-doc-warning)
- [Secret Network v1.3 "Shockwave Alpha" Network Upgrade Instructions](#secret-network-v13-shockwave-alpha-network-upgrade-instructions)
  - [:warning: IMPORTANT NOTES :warning:](#warning-important-notes-warning)
- [Upgrading Automatically Using Cosmovisor](#upgrading-automatically-using-cosmovisor)
- [Upgrading Manually](#upgrading-manually)
- [Details of Upgrade Time](#details-of-upgrade-time)
- [In Case of an Upgrade Failure](#in-case-of-an-upgrade-failure)

# Upgrading Automatically Using Cosmovisor

The Secret Network blockchain will halt when network reaches the halt height. Cosmovisor, if configured properly, will then switch the binary used to v1.3, and the chain will proceed post upgrade.

We highly recommend validators use Cosmovisor to run their nodes. This will make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

You should review the docs for Cosmovisor located here: https://docs.cosmos.network/master/run-node/cosmovisor.html

Below are instructions to migrate your v1.2 node to use Cosmovisor, and then set it up for the v1.3 upgrade. This migration is a one-time deal, future upgrades will only require you to copy new binaries into their designated directory.

To install Cosmovisor:

```bash
wget -O - "https://github.com/cosmos/cosmos-sdk/releases/download/cosmovisor%2Fv1.1.0/cosmovisor-v1.1.0-linux-amd64.tar.gz" | tar -xz -C /tmp
sudo mv /tmp/cosmovisor /bin/cosmovisor
sudo chmod +x /bin/cosmovisor
```

After this, you must make the necessary directory structure for Cosmosvisor in your daemon home directory (`~/.secretd`). At this point we still assume that you have a v1.2 node running.

```bash
# Setup Cosmovisor with secretd v1.2
mkdir -p ~/.secretd/cosmovisor/genesis/bin

# Copy v1.2 binaries to Cosmovisor's directory
sudo cp /usr/local/bin/secretd /usr/lib/{libgo_cosmwasm.so,librust_cosmwasm_enclave.signed.so} ~/.secretd/cosmovisor/genesis/bin

# Prepare Cosmovisor for secretd v1.3
mkdir -p ~/.secretd/cosmovisor/upgrades/v1.3/bin

# Get secretd v1.3
wget -P /tmp/ "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_v1.3.0_mainnet_amd64.deb"

# Verify v1.3 checksum
echo "TODO /tmp/secretnetwork_v1.3.0_mainnet_amd64.deb" | sha256sum --check

# Extract v1.3 from archive
dpkg-deb -R /tmp/secretnetwork_v1.3.0_mainnet_amd64.deb /tmp/secretnetwork_v1.3.0_mainnet_amd64.deb.extracted

# Copy v1.3 binaries to Cosmovisor's directory
cp /tmp/secretnetwork_v1.3.0_mainnet_amd64.deb.extracted/usr/{local/bin/secretd,lib/librust_cosmwasm_enclave.signed.so,lib/libgo_cosmwasm.so} ~/.secretd/cosmovisor/upgrades/v1.3/bin
```

Now the Cosmovisor directory structure should look like:

```console
$ find ~/.secretd/cosmovisor
/home/ubuntu/.secretd/cosmovisor/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/
/home/ubuntu/.secretd/cosmovisor/genesis/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/genesis/bin/secretd
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/libgo_cosmwasm.so
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/librust_cosmwasm_enclave.signed.so
/home/ubuntu/.secretd/cosmovisor/upgrades/v1.3/bin/secretd
```

Cosmovisor requires some environment variables be set in order to function properly. We recommend setting these in your `~/.profile` so it is automatically set in every session.

For validators we recommmend setting

- `DAEMON_ALLOW_DOWNLOAD_BINARIES=false` for security reasons.
- `DAEMON_LOG_BUFFER_SIZE=512` to avoid a bug with extra long log lines crashing the server.
- `DAEMON_RESTART_AFTER_UPGRADE=true` for unattended upgrades.

```bash
echo "# Setup Cosmovisor" >> ~/.profile
echo "export DAEMON_NAME=secretd" >> ~/.profile
echo "export DAEMON_HOME=$HOME/.secretd" >> ~/.profile
echo "export DAEMON_ALLOW_DOWNLOAD_BINARIES=false" >> ~/.profile
echo "export DAEMON_LOG_BUFFER_SIZE=512" >> ~/.profile
echo "export DAEMON_RESTART_AFTER_UPGRADE=true" >> ~/.profile
echo "export DAEMON_DATA_BACKUP_DIR=$HOME" >> ~/.profile
echo "export UNSAFE_SKIP_BACKUP=true" >> ~/.profile
source ~/.profile
```

You may leave out `UNSAFE_SKIP_BACKUP=true`, however the backup takes a decent amount of time and public snapshots of old states are available.

Now, to switch your process manager to use Cosmovisor, stop your v1.2 node:

```bash
sudo systemctl stop secret-node
```

Edit the service file to use Cosmovisor:

```bash
echo "[Unit]
Description=Secret node service
After=network.target

[Service]
Type=simple
ExecStart=/bin/cosmovisor run
User=$USER
Restart=on-failure
StartLimitInterval=0
RestartSec=3
LimitNOFILE=65535
LimitMEMLOCK=209715200
Environment=SCRT_ENCLAVE_DIR=$HOME/.secretd/cosmovisor/current/bin
Environment=LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$HOME/.secretd/cosmovisor/current/bin
Environment=DAEMON_NAME=secretd
Environment=DAEMON_HOME=$HOME
Environment=DAEMON_ALLOW_DOWNLOAD_BINARIES=false
Environment=DAEMON_LOG_BUFFER_SIZE=512
Environment=DAEMON_RESTART_AFTER_UPGRADE=true
Environment=DAEMON_DATA_BACKUP_DIR=$HOME
Environment=UNSAFE_SKIP_BACKUP=true

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/secret-node.service
```

Apply the changes and restart the v1.2 node:

```bash
sudo systemctl daemon-reload
sudo systemctl restart secret-node
```

You should now see blocks executing in the logs (`journalctl -fu secret-node`). When the network reaches the halt height, the Secret Network blockchain will halt. Cosmovisor, if configured properly, will then switch the binary used to v1.3, and the chain will proceed post upgrade.

# Upgrading Manually

When the network reaches the halt height TODO, you'll see this message in your node's log (`journalctl -fu secret-node`):

```
1:25PM ERR UPGRADE "v1.3" NEEDED at height: TODO:
1:25PM ERR CONSENSUS FAILURE!!! err="UPGRADE \"v1.3\" NEEDED at height: TODO
```

Then, the upgrade steps for v1.3 are:

```bash
# Stop the v1.2 node, to make sure that your process manager isn't trying to restart your v1.2 node
sudo systemctl stop secret-node

# Get secretd v1.3
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_v1.3.0_mainnet_amd64.deb"

# Verify v1.3 checksum
echo "TODO secretnetwork_v1.3.0_mainnet_amd64.deb" | sha256sum --check

# Install v1.3 binaries
sudo apt install -y ./secretnetwork_v1.3.0_mainnet_amd64.deb

# Restart the node
sudo systemctl restart secret-node
```

After restarting the node with v1.3, you should see `INF applying upgrade "v1.3" at height: TODO` in the logs (`journalctl -fu secret-node`). Once 67% of voting power comes online, you'll see blocks executing again.

# Details of Upgrade Time

When the network reaches the halt height TODO, the Secret Network blockchain will be halted and validators will need to take action to upgrade the chain to the secretd v1.3 binary (be it manually or automatically).

The proposal targets the upgrade proposal block to be TODO, anticipated to be at Wednesday April 27th 2:00PM UTC. This uses a 7 day average block time of 6.0505 seconds per block, derived from https://www.mintscan.io/secret/blocks/TODO with #100,000 as a block window. Note that block times have high variance, so keep monitoring the time.

The upgrade is anticipated to take approx 30 minutes, during which time, there will not be any on-chain activity on the network.

# In Case of an Upgrade Failure

In the event of an issue at upgrade time, we should coordinate via the "SN Validators" Telegram group.

If as a result of a software bug the network fails to produce new blocks with the v1.3 binaries, the SCRT Labs team will distribute a v1.2 binary with an empty v1.3 upgrade handler, which will essentially allow the chain to revert to v1.2 while continuing to produce new blocks.
