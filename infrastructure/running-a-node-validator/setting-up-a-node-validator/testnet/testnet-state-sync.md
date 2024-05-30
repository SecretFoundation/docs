# Testnet State Sync

_**Note: This documentation assumes you have followed the instructions for**_ [_**Running a Full Node for Testnet**_](run-a-full-node.md)_**.**_

{% hint style="danger" %}
WARNING: This will erase your node database. If you are already running validator, be sure you backed up your `config/priv_validator_key.json` and `config/node_key.json` prior to running `unsafe-reset-all`.
{% endhint %}

The state-sync configuration in `~/.secretd/config/app.toml` is as follows:

```toml
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable). Must be a multiple of pruning-keep-every.
snapshot-interval = 2000

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all).
snapshot-keep-recent = 10
```

### 1. Set `SNAP_RPC` variable to a snapshot RPC

```bash
SNAP_RPC="http://rpc.testnet.secretsaturn.net"
```

Set the state-sync `BLOCK_HEIGHT` and fetch the `TRUST_HASH` from the snapshot RPC. The `BLOCK_HEIGHT` to sync is determined by finding the latest block that's a multiple of snapshot-interval.

```bash
BLOCK_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height | awk '{print $1 - ($1 % 2000)}'); \
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash)
```

### 2. Check variables to ensure they have been set

```bash
echo $BLOCK_HEIGHT $TRUST_HASH

# output should be something similar to:
# 3506000 FCB54D74A4A33F8C1CC18A7240D76D87CB192A89C17837C4DB6C6140612DDFEB
```

### 3. Set the required variables in \~/.secretd/config/config.toml

```bash
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ; \
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"http://rpc.testnet.secretsaturn.net:26657,http://secret-testnet-rpc.01no.de:26657\"| ; \
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ; \
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"| ; \
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.secretd/config/config.toml
```

### 4. Stop the node and reset the node database

{% hint style="danger" %}
WARNING: This will erase your node database. If you are already running validator, be sure you backed up your `config/priv_validator_key.json` and `config/node_key.json` prior to running `unsafe-reset-all`.
{% endhint %}

It is recommended to copy `data/priv_validator_state.json` to a backup and restore it after `unsafe-reset-all` to avoid potential double signing.

```bash
sudo systemctl stop secret-node && secretd tendermint unsafe-reset-all --home ~/.secretd/
```

### 5. Restart node and check logs

This generally takes several minutes to complete, but has been known to take up to 24 hours.

```bash
sudo systemctl restart secret-node && journalctl -fu secret-node
```
