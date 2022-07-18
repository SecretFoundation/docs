# Shockwave Alpa

## Secret Network v1.3 "Shockwave Alpha" Network Upgrade Instructions <a href="#secret-network-v1-3-shockwave-alpha-network-upgrade-instructions" id="secret-network-v1-3-shockwave-alpha-network-upgrade-instructions"></a>

### ⚠️ IMPORTANT NOTES ⚠️ <a href="#important-notes" id="important-notes"></a>

* All coordination efforts will be done in the "SN Validators" Telegram group.
* Make sure to [backup your validator](https://docs.scrt.network/backup/backup-a-validator.html) before making any chnages.
* Please read carefully before you begin the upgrade.

### Table of Contents <a href="#table-of-contents" id="table-of-contents"></a>

* [Secret Network v1.3 "Shockwave Alpha" Network Upgrade Instructions](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#secret-network-v13-shockwave-alpha-network-upgrade-instructions)
  * [⚠️ IMPORTANT NOTES ⚠️](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#warning-important-notes-warning)
  * [Table of Contents](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#table-of-contents)
* [Upgrading Manually](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#upgrading-manually)
* [Upgrading Automatically Using Cosmovisor](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#upgrading-automatically-using-cosmovisor)
* [Details of Upgrade Time](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#details-of-upgrade-time)
* [In Case of an Upgrade Failure](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#in-case-of-an-upgrade-failure)

## Upgrading Manually <a href="#upgrading-manually" id="upgrading-manually"></a>

When the network reaches the halt height 3,343,000, you'll see this message in your node's log (`journalctl -fu secret-node`):

```bash
1:25PM ERR UPGRADE "v1.3" NEEDED at height: 3343000:
1:25PM ERR CONSENSUS FAILURE!!! err="UPGRADE \"v1.3\" NEEDED at height: 3343000
```

Then, the upgrade steps for v1.3 are:

⚠️ Note: uncomment the right binary based on the database type on the node that you're upgrading: `rocksdb` vs. `goleveldb`.

```bash
# Stop the v1.2 node, to make sure that your process manager isn't trying to restart it while you upgrade
sudo systemctl stop secret-node

# Get & verify secretd v1.3

# goleveldb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_1.3.0_mainnet_goleveldb_amd64.deb"
# echo "b5a4387fd3af477f1d7d0c8ab13debc9b9ad9abccb59c82b1a35cc8a90db902b secretnetwork_1.3.0_mainnet_goleveldb_amd64.deb" | sha256sum --check

# rocksdb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.0/secretnetwork_1.3.0_mainnet_rocksdb_amd64.deb"
# echo "a1fc48003b3b563aae216901fc5821bb11164746c61b86507bc813cb49bd85cb secretnetwork_1.3.0_mainnet_rocksdb_amd64.deb" | sha256sum --check

# Install v1.3 binaries
sudo apt install -y ./secretnetwork_1.3.0_mainnet_*_amd64.deb

# Restart the node
sudo systemctl restart secret-node
```

After restarting the node with v1.3, you should see `INF applying upgrade "v1.3" at height: 3343000` in the logs (`journalctl -fu secret-node`). Once 67% of voting power comes online, you'll see blocks executing again.

## Upgrading Automatically Using Cosmovisor <a href="#upgrading-automatically-using-cosmovisor" id="upgrading-automatically-using-cosmovisor"></a>

Cosmovisor is a new process manager for cosmos blockchains. It can make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

⚠️ Cosmovisor is still new and best practices for using it are not yet established. If you don't feel adventurous at this time, we recommend [upgrading the manual way](https://docs.scrt.network/shockwave-alpha-upgrade-secret-4.html#upgrading-manually).

For instructions on how to setup Cosmovisor, go [here](https://docs.scrt.network/cosmovisor.html).

## Details of Upgrade Time <a href="#details-of-upgrade-time" id="details-of-upgrade-time"></a>

When the network reaches the halt height 3343000, the Secret Network blockchain will be halted and validators will need to take action to upgrade the chain to the secretd v1.3 binary (be it manually or automatically).

The proposal targets the upgrade proposal block to be 3343000, anticipated to be on Wednesday May 11, 2022 at 2:00PM UTC. This uses a 7 day average block time, derived from [https://www.mintscan.io/secret/blocks/3343000](https://www.mintscan.io/secret/blocks/3343000) with #100,000 as the block time calculation window. Note that block times have high variance, so keep monitoring the time.

The upgrade is anticipated to take approx 30 minutes, during which time, there will not be any on-chain activity on the network.

## In Case of an Upgrade Failure <a href="#in-case-of-an-upgrade-failure" id="in-case-of-an-upgrade-failure"></a>

In the event of an issue at upgrade time, we should coordinate via the "SN Validators" Telegram group.

If as a result of a software bug the network fails to produce new blocks with the v1.3 binaries, the SCRT Labs team will distribute a v1.2 binary with an empty v1.3 upgrade handler, which will essentially allow the chain to revert to v1.2 while continuing to produce new blocks.
