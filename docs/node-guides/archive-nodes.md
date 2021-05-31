# Archive Nodes

### Archive all blockchain data.

An archive node keeps all the past blocks. An archive node makes it convenient to query the past state of the chain at any point in time. Finding out what an account's balance, stake size, etc at a certain block was, or which extrinsics resulted in a certain state change are fast operations when using an archive node. However, an archive node takes up a lot of disk space - nearly 400GB for secret-2 as of May 31, 2021.

To setup your archive node you can follow the instructions below:

First follow the [Full Node Guide](run-full-node-mainnet.md)

Now stop the full node you want to convert to an archive node.

```bash
sudo systemctl stop secret-node
```

Full nodes should edit their `.secretd/config/config.toml`:

```bash
nano /.secretd/config/app.toml
```

Proceed to make the following changes:

```bash
# Pruning sets the pruning strategy: syncable, nothing, everything
# syncable: only those states not needed for state syncing will be deleted (keeps last 100 + every 10000th)
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: all saved states will be deleted, storing only the current state
pruning = "nothing"
```

Now you must reset the data on your full node, so it can sync in archive mode.
```bash
secretd unsafe-reset-all
```

Now proceed to restart your secret node with the following command.

```bash
sudo systemctl start secret-node
```

You now have an Archive node running!