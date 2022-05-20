# Prune Everything Nodes

#### Prune all blockchain data. <a href="#prune-all-blockchain-data" id="prune-all-blockchain-data"></a>

A node that prunes everything keeps none of the past blocks. These nodes have the smallest disk space requirements. This type of node cannot be used as an RPC and LCD endpoint, but can be used for sentry nodes or a validator node.

To setup your prune everything node you can follow the instructions below:

First follow the [Full Node Guide](https://docs.scrt.network/node-guides/run-full-node-mainnet.html)

Now stop the full node you want to convert to a prune everything node.

```
sudo systemctl stop secret-node
```

Full nodes should edit their `.secretd/config/config.toml`:

```
nano .secretd/config/app.toml
```

Proceed to make the following changes:

```
# Pruning sets the pruning strategy: syncable, nothing, everything
# syncable: only those states not needed for state syncing will be deleted (keeps last 100 + every 10000th)
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: all saved states will be deleted, storing only the current state
pruning = "everything"
```

Now you must reset the data on your full node, so it can sync in archive mode.

```
secretd unsafe-reset-all
```

Now proceed to restart your secret node with the following command.

```
sudo systemctl start secret-node
```

You now have a Prune Everything node running!
