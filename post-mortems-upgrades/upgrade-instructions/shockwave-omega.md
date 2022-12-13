# Shockwave Omega

## Secret Network Shockwave Omega Upgrade Instructions <a href="#secret-network-shockwave-omega-upgrade-instructions" id="secret-network-shockwave-omega-upgrade-instructions"></a>

### ⚠️ IMPORTANT NOTES ⚠️ <a href="#important-notes" id="important-notes"></a>

- All coordination efforts will be done in the "SN Validators" Telegram group.
- Make sure to [backup your validator](../../node-runners/validator-backup.md) before making any chnages.
- **Please read carefully before you begin the upgrade.**

## Check your hardware compatiblity before the upgrade

To check whether your hardware will be able to register on the network, you can run the `check-hw` tool of the new release (or the latest RC version, if not available). You can find it in the [Releases page](https://github.com/scrtlabs/SecretNetwork/releases).

Download the `check-hw` tar, extract and run:

```bash
tar -xzf chec_hw_<version>.tar.gz
cd check-hw
LOG_LEVEL=WARN ./check-hw
```

You should see some logs and if your hardware is compatible, you should receive at the end:

```bash
Platform Okay!
```

## Upgrading Manually <a href="#upgrading-manually" id="upgrading-manually"></a>

When the network reaches the halt height 6,537,300, you'll see this message in your node's log (`journalctl -fu secret-node`):

```bash
1:25PM ERR UPGRADE "v1.6" NEEDED at height: 6537300:
1:25PM ERR CONSENSUS FAILURE!!! err="UPGRADE \"v1.6\" NEEDED at height: 6537300
```

Then, the upgrade steps for v1.6 are:

⚠️ Note: if you have modified your systemd unit file (`/etc/systemd/system/secret-node.service`) you will need to re-apply those changes post installation and pre service restart.

```bash
# Stop the v1.5 node, to make sure that your process manager isn't trying to restart it while you upgrade
sudo systemctl stop secret-node

# Get & verify secretd v1.6

# Check what database type you're currently using:
awk -F \" '/^db_backend =/{print $2}' ~/.secretd/config/config.toml

# Uncomment the right binary based on the database type: `rocksdb` or `goleveldb`

## goleveldb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.6.0/secretnetwork_1.6.0_mainnet_goleveldb_amd64.deb"
# echo "ce9ba85d346fa460ed3fc98871f2a254b269fafa835fc555c9184f6405d8c80a secretnetwork_1.6.0_mainnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.6.0/secretnetwork_1.6.0_mainnet_rocksdb_amd64.deb"
# echo "65f795069fc3f703ef3bc1e856cb7499f5474e7b7889ca7d83e085be8b5488f1 secretnetwork_1.6.0_mainnet_rocksdb_amd64.deb" | sha256sum --check

# Install v1.6 binaries
sudo apt install -y ./secretnetwork_1.6.0_mainnet_*_amd64.deb

# re-apply any systemd unit file customizations

# Restart the node
sudo systemctl restart secret-node
```

After restarting the node with v1.6, you should see `INF applying upgrade "v1.6" at height: 6537300` in the logs (`journalctl -fu secret-node`). Once 67% of voting power comes online, you'll see blocks executing again.

## Upgrading Automatically Using Cosmovisor <a href="#upgrading-automatically-using-cosmovisor" id="upgrading-automatically-using-cosmovisor"></a>

Cosmovisor is a new process manager for cosmos blockchains. It can make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

⚠️ Cosmovisor is still new and best practices for using it are not yet established. If you don't feel adventurous at this time, we recommend [upgrading the manual way](#upgrading-manually).

For instructions on how to setup Cosmovisor, go [here](/validators/migration/cosmovisor.md).

## Details of Upgrade Time <a href="#details-of-upgrade-time" id="details-of-upgrade-time"></a>

When the network reaches the halt height 6,537,300, the Secret Network blockchain will be halted and validators will need to take action to upgrade the chain to the secretd v1.6 binary (be it manually or automatically).

The proposal targets the upgrade proposal block to be 6,537,300, anticipated to be on Tuesday December 13, 2022 at 12:00PM UTC.

The upgrade is anticipated to take approx 30 minutes, during which time, there will not be any on-chain activity on the network.

## In Case of an Upgrade Failure <a href="#in-case-of-an-upgrade-failure" id="in-case-of-an-upgrade-failure"></a>

In the event of an issue at upgrade time, we should coordinate via the "SN Validators" Telegram group.

If as a result of a software bug the network fails to produce new blocks with the v1.6 binaries, the SCRT Labs team will distribute a v1.5 binary with an empty v1.6 upgrade handler, which will essentially allow the chain to revert to v1.5 while continuing to produce new blocks.
