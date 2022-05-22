# Sync with State-Sync

## Introduction

State-sync is a module built into the Cosmos SDK to allow validators to rapidly join the network by syncing your node with a snapshot enabled RPC from a trusted block height.

This greatly reduces the time required for a validator or sentry to sync with the network from days to minutes. The limitations of this are that there is not a full transaction history, just the most recent state that the state-sync RPC has stored. An advantage of state-sync is that the database is very small in comparison to a fully synced node, therefore using state-sync to resync your node to the network can help keep running costs lower by minimising storage usage.

By syncing to the network with state-sync, a node can avoid having to go through all the upgrade procedures and can sync with the most recent binary only.

:warning: NOTE: For nodes that are intended to serve data for dapps, explorers or any other RPC requiring full history, state-syncing to the network would not be appropriate.

## Mainnet State Sync

Lavender.Five Nodes and SecretNFT are operating and maintaining the snapshot RPCs.

**NOTE: This documentation assumes you have followed the instructions for [Running a Full Node](./run-full-node-mainnet.md).**

The state-sync configuration is as follows:

```bash
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable). Must be a multiple of pruning-keep-every.
snapshot-interval = 2000

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all).
snapshot-keep-recent = 10
```

### On The Node To Be State-Sync'd

1. Set `SNAP_RPC` variable to the Lavender.Five snapshot RPC

```bash
SNAP_RPC="http://155.138.198.97:26657"
```

1. Set the state-sync `BLOCK_HEIGHT` and fetch the `TRUST_HASH` from the snapshot RPC. The `BLOCK_HEIGHT` to sync is determined by finding the latest block that's a multiple of snapshot-interval.

```bash
BLOCK_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height | awk '{print $1 - ($1 % 2000)}'); \
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash)
```

3. Check variables to ensure they have been set

```bash
echo $BLOCK_HEIGHT $TRUST_HASH

# output should be something similar to:
# 3506000 FCB54D74A4A33F8C1CC18A7240D76D87CB192A89C17837C4DB6C6140612DDFEB
```

4. Set the required variables in `~/.secretd/config/config.toml`

```bash
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ; \
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"http://155.138.198.97:26657,http://45.63.94.236:26657\"| ; \
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ; \
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"| ; \
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.secretd/config/config.toml
```

5. Stop the node and reset the node database

:warning: WARNING: This will erase your node database. If you are already running validator, be sure you backed up your `config/priv_validator_key.json` and `config/node_key.json` prior to running `unsafe-reset-all`.

It is recommended to copy `data/priv_validator_state.json` to a backup and restore it after `unsafe-reset-all` to avoid potential double signing.

```bash
systemctl stop secret-node && secretd tendermint unsafe-reset-all --home ~/.secretd/
```

6. Restart node and check logs

This generally takes several minutes to complete.

```bash
sudo systemctl restart secret-node && journalctl -fu secret-node
```

Credit to KingNodes for providing the framework for this doc.
