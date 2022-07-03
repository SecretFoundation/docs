# Archive Nodes

#### Archive all blockchain data. <a href="#archive-all-blockchain-data" id="archive-all-blockchain-data"></a>

An archive node keeps all the past blocks. An archive node makes it convenient to query the past state of the chain at any point in time. Finding out what an account's balance, stake size, etc at a certain block was, or which extrinsics resulted in a certain state change are fast operations when using an archive node. However, an archive node takes up a lot of disk space - nearly 1.2TB for `secret-4` as of May 31, 2022.

#### Recommended Requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 32GB RAM
* 2TB NVMe SSD
* 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

{% hint style="info" %}
Note that syncing from scratch/following these instructions takes several weeks.
{% endhint %}

To setup your archive node you can follow the instructions below:

### 1. Install `secretd` 1.2.2

Download the secretd .deb

```
wget https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.2/secretnetwork_v1.2.2_mainnet_amd64.deb
# check the hash of the downloaded binary
echo "1a51d3d9324979ef9a1f56023e458023488b4583bf4587abeed2d1f389aea947 secretnetwork_v1.2.2_mainnet_amd64.deb" | sha256sum --check
```

Install \`secretd\`

```
sudo dpkg -i secretnetwork_v1.2.2_mainnet_amd64.deb

# verify installation
secretd version
# 1.2.2
```

### 2. Setup SGX

Setup [SGX](node-setup/install-sgx.md). For more information on SGX, see instructions for [setup](https://docs.scrt.network/node-guides/setup-sgx.html) and [verification](https://docs.scrt.network/node-guides/verify-sgx.html). See [registration](https://docs.scrt.network/node-guides/registration.html) if you'd like a more comprehensive overview on what's happening in these steps.

### 3. Setup the Node

Execute steps 2 through 8 of [Running a Full Node](node-setup/setup-full-node.md#\_4-download-a-copy-of-the-genesis-block-file-genesis-json).

{% hint style="danger" %}
Do NOT begin syncing yet!
{% endhint %}

### 4. Set Pruning Parameter

```
pruning="nothing"
sed -i -e "s/^pruning *=.*/pruning = \"$pruning\"/" $HOME/.secretd/config/app.toml
```

### 5. Optimizations <a href="#_20-optimization" id="_20-optimization"></a>

In order to be able to handle NFT minting and other Secret Contract-heavy operations, it's recommended to update your SGX memory enclave cache:

```
sed -i.bak -e "s/^contract-memory-enclave-cache-size *=.*/contract-memory-enclave-cache-size = \"15\"/" ~/.secretd/config/app.toml
```

Also checkout[ this document](https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa) by `[ block pane ]` for fine tuning your machine for better uptime.&#x20;

### 6. Begin Syncing

Note that the `secret-node` system file is created in a previous step.

```
sudo systemctl enable secret-node && sudo systemctl start secret-node
```

If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C).

```
journalctl -f -u secret-node
```

```
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

### 7. Execute Shockwave Upgrade at Block 3,343,000

At block 3,343,000 the node will halt and must be upgraded. You can upgrade the node by following the [upgrade instructions](https://github.com/SecretFoundation/docs/blob/main/docs/shockwave-alpha-upgrade-secret-4.md).&#x20;

{% hint style="info" %}
Ensure you restarted your node after executing the upgrade.
{% endhint %}

### 8. Continue Syncing

At this point you should be on `secretd` version 1.3.1, and syncing to the current block.
