# Archive Nodes

## Archive All Blockchain Data. <a href="#archive-all-blockchain-data" id="archive-all-blockchain-data"></a>

An archive node keeps all the past blocks. An archive node makes it convenient to query the past state of the chain at any point in time. Finding out what an account's balance, stake size, etc at a certain block was, or which extrinsics resulted in a certain state change are fast operations when using an archive node. However, an archive node takes up a lot of disk space - nearly 2TB for `secret-4` as of Feb 1, 2023.

### Recommended Requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 32GB RAM
* 3TB NVMe SSD
* 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

More on hardware support [here](./hardware-compliance).

{% hint style="info" %}
Note that syncing from scratch/following these instructions takes several weeks, since state-sync is not available for Archive Nodes.
{% endhint %}

To setup your archive node you can follow the instructions below:

### Install latest `secretd`

Download the secretd .deb from the [latest release](https://github.com/scrtlabs/SecretNetwork/releases/latest).

**Note**: As of writing these lines the latest release is `v1.6.1` will be referenced as so for the rest of this document.

**Node**: Archive nodes are only available with `goleveldb`. If this doesn't mean anything to you, just proceed with this guide as usual.

```bash
# Get the v1.6.1 binaries
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.6.1/secretnetwork_1.6.1_mainnet_goleveldb_amd64.deb"

# Verify the v1.6.1 binaries
echo '2c043fb25f2b4f97eeda52a4033aff0ceb86f5dbb4738791f00eacdb8e065dfe secretnetwork_1.6.1_mainnet_goleveldb_amd64.deb' | sha256sum --check
```

#### Install `secretd`

```bash
sudo dpkg -i secretnetwork_1.6.1_mainnet_goleveldb_amd64.deb

# verify installation
secretd version
# 1.6.1
```

### Setup the Node

Setup the node using the [Running a Full Node](node-setup/setup-full-node.md#\_4-download-a-copy-of-the-genesis-block-file-genesis-json) guide. You should stop at the [Set minimum-gas-price Parameter](node-setup/setup-full-node.md#set-minimum-gas-price-parameter) step.

{% hint style="danger" %}
Do NOT begin syncing yet!
{% endhint %}

### Install v1.2.0-archive `secretd`

Now that you have registered the node with the latest version, install `v1.2.0-archive`.

```bash
# Get the v1.2.0-archive binaries
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.0-archive/secretnetwork_1.2.0-archive_amd64.deb"

# Install the v1.2.0-archive binaries
sudo dpkg -i secretnetwork_1.2.0-archive_amd64.deb
```

### &#x20;Set Pruning Parameter

```bash
pruning="nothing"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.secretd/config/app.toml
```

### Begin Syncing

Note that the `secret-node` system file is created in a previous step.

```bash
sudo systemctl enable secret-node && sudo systemctl start secret-node
```

If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C).
It might take a while for blocks to start streaming, so grab some 🍿 while you wait!

```bash
journalctl -f -u secret-node
```

```json
-- Logs begin at Mon 2020-02-10 16:41:59 UTC. --
Nov 09 11:16:31 scrt-node-01 secretd[619529]: 11:16AM INF indexed block height=12 module=txindex
Nov 09 11:16:35 scrt-node-01 secretd[619529]: 11:16AM INF Ensure peers module=pex numDialing=0 numInPeers=0 numOutPeers=0 numToDial=10
Nov 09 11:16:35 scrt-node-01 secretd[619529]: 11:16AM INF No addresses to dial. Falling back to seeds module=pex
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF Timed out dur=4983.86819 height=13 module=consensus round=0 step=1
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF received proposal module=consensus proposal={"Type":32,"block_id":{"hash":"0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4","parts":{"hash":"58F6211ED5D6795E2AE4D3B9DBB1280AD92B2EE4EEBAA2910F707C104258D2A0","total":1}},"height":13,"pol_round":-1,"round":0,"signature":"eHY9dH8dG5hElNEGbw1U5rWqPp7nXC/VvOlAbF4DeUQu/+q7xv5nmc0ULljGEQR8G9fhHaMQuKjgrxP2KsGICg==","timestamp":"2021-11-09T11:16:36.7744083Z"}
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF received complete proposal block hash=0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4 height=13 module=consensus
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF finalizing commit of block hash=0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4 height=13 module=consensus num_txs=0 root=E4968C9B525DADA22A346D5E158C648BC561EEC351F402A611B9DA2706FD8267
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF minted coins from module account amount=6268801uscrt from=mint module=x/bank
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF executed block height=13 module=state num_invalid_txs=0 num_valid_txs=0
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF commit synced commit=436F6D6D697449447B5B373520353520323020352032342031312032333820353320383720313137203133372031323020313638203234302035302032323020353720343520363620313832203138392032333920393920323439203736203338203131322035342032332033203233362034375D3A447D
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF committed state app_hash=4B371405180BEE3557758978A8F032DC392D42B6BDEF63F94C2670361703EC2F height=13 module=state num_txs=0
^C
```

You now have an Archive node running!

### Execute upgrades

Syncing a node from scratch means that from time to time you'll need to perform an upgrade (at the block height that the upgrade was originally took place on mainnet).

You will need to use the [designated archive-node binaries](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.0-archive) when available. For the rest of the upgrades, use the binaries for the respective version from the [releases page](https://github.com/scrtlabs/SecretNetwork/releases).

As of the writing of these lines, the upgrade timing (in block-height) are:

* v1.3.0 - block height `3,343,000` ([binaries](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.0-archive)).
* v1.4.0 - block height `5,309,200` ([binaries](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.0-archive)).
* v1.5.0 - block height `5,941,700` ([binaries](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.5.1)).
* v1.6.0 - block height `6,537,300` ([binaries](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.6.0)).

For more detailed upgrade instructions, you can refer to the [v1.5.0 upgrade instructions](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.5.0).
