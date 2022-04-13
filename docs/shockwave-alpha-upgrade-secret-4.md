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
- [Upgrading Manually](#upgrading-manually)
- [Upgrading Automatically Using Cosmovisor](#upgrading-automatically-using-cosmovisor)
- [Details of Upgrade Time](#details-of-upgrade-time)
- [In Case of an Upgrade Failure](#in-case-of-an-upgrade-failure)

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

# Upgrading Automatically Using Cosmovisor

Cosmovisor is a new process manager for cosmos blockchains. It can make low-downtime upgrades smoother, as validators don't have to manually upgrade binaries during the upgrade, and instead can pre-install new binaries, and Cosmovisor will automatically update them based on on-chain SoftwareUpgrade proposals.

:warning: Cosmovisor is still new and best practices for using it are not yet established. If you don't feel adventurous at this time, we recommend [upgrading the manual way](#upgrading-manually).

For instructions on how to setup Cosmovisor, go [here](./cosmovisor.md).

# Details of Upgrade Time

When the network reaches the halt height TODO, the Secret Network blockchain will be halted and validators will need to take action to upgrade the chain to the secretd v1.3 binary (be it manually or automatically).

The proposal targets the upgrade proposal block to be TODO, anticipated to be on Wednesday April 27th, 2022 at 2:00PM UTC. This uses a 7 day average block time of 6.0505 seconds per block, derived from https://www.mintscan.io/secret/blocks/TODO with #100,000 as a block window. Note that block times have high variance, so keep monitoring the time.

The upgrade is anticipated to take approx 30 minutes, during which time, there will not be any on-chain activity on the network.

# In Case of an Upgrade Failure

In the event of an issue at upgrade time, we should coordinate via the "SN Validators" Telegram group.

If as a result of a software bug the network fails to produce new blocks with the v1.3 binaries, the SCRT Labs team will distribute a v1.2 binary with an empty v1.3 upgrade handler, which will essentially allow the chain to revert to v1.2 while continuing to produce new blocks.
