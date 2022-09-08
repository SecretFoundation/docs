# Shockwave Delta (pulsar-2 testnet)

## Secret Network v1.4 "Shockwave Delta" Testnet Upgrade Instructions <a href="#secret-network-v1-4-shockwave-delta-testnet-upgrade-instructions" id="secret-network-v1-4-shockwave-delta-testnet-upgrade-instructions"></a>

## Upgrading Manually <a href="#upgrading-manually" id="upgrading-manually"></a>

When the network reaches the halt height TODO, you'll see this message in your node's log (`journalctl -fu secret-node`):

```bash
1:25PM ERR UPGRADE "v1.4" NEEDED at height: TODO:
1:25PM ERR CONSENSUS FAILURE!!! err="UPGRADE \"v1.4\" NEEDED at height: TODO
```

Then, the upgrade steps for v1.4 are:

⚠️ Note: uncomment the right binary based on the database type on the node that you're upgrading: `rocksdb` vs. `goleveldb`.

```bash
# Stop the v1.3 node, to make sure that your process manager isn't trying to restart it while you upgrade
sudo systemctl stop secret-node

# Get & verify secretd v1.4

## goleveldb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.4.0-beta.4/secretnetwork_1.4.0-beta.4_testnet_goleveldb_amd64.deb"
# echo "bee2d1e45d98dd3e3475b78435d4c12d4283fcbbab5b7441a07117454515429a secretnetwork_1.4.0-beta.4_testnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.4.0-beta.4/secretnetwork_1.4.0-beta.4_testnet_rocksdb_amd64.deb"
# echo "18f1ee69af50e810785137ba39ee54b4456d741cf71fc9dd4d29acd7b9f6c2ad secretnetwork_1.4.0-beta.4_testnet_rocksdb_amd64.deb" | sha256sum --check

# Install v1.4 binaries
sudo apt install -y ./secretnetwork_1.4.0-beta.4_testnet_*_amd64.deb

# Restart the node
sudo systemctl restart secret-node
```

After restarting the node with v1.4, you should see `INF applying upgrade "v1.4" at height: TODO` in the logs (`journalctl -fu secret-node`). Once 67% of voting power comes online, you'll see blocks executing again.

## Upgrading Automatically Using Cosmovisor <a href="#upgrading-automatically-using-cosmovisor" id="upgrading-automatically-using-cosmovisor"></a>

Cosmovisor is a new process manager for cosmos blockchains. It can make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

⚠️ Cosmovisor is still new and best practices for using it are not yet established. If you don't feel adventurous at this time, we recommend [upgrading the manual way](#upgrading-manually).

For instructions on how to setup Cosmovisor, go [here](/validators/migration/cosmovisor.md).

## Details of Upgrade Time <a href="#details-of-upgrade-time" id="details-of-upgrade-time"></a>

When the network reaches the halt height TODO, the Secret Network blockchain will be halted and validators will need to take action to upgrade the chain to the secretd v1.4 binary (be it manually or automatically).

The proposal targets the upgrade proposal block to be TODO, anticipated to be on Thursday Septmber 8, 2022 at 2:00PM UTC. This uses a 7 day average block time, derived from [https://www.mintscan.io/secret/blocks/3343000](https://www.mintscan.io/secret/blocks/TODO) with #100,000 as the block time calculation window. Note that block times have high variance, so keep monitoring the time.

The upgrade is anticipated to take approx 30 minutes, during which time, there will not be any on-chain activity on the network.

## In Case of an Upgrade Failure <a href="#in-case-of-an-upgrade-failure" id="in-case-of-an-upgrade-failure"></a>

In the event of an issue at upgrade time, we should coordinate via the "SN Testnet Validators" Telegram group.

If as a result of a software bug the network fails to produce new blocks with the v1.4 binaries, the SCRT Labs team will distribute a v1.3 binary with an empty v1.4 upgrade handler, which will essentially allow the chain to revert to v1.3 while continuing to produce new blocks.
