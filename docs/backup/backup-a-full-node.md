# Backup a Full Node

Why you might want to backup your node ID:

- In case you are a seed node.
- In case you are a persistent peer for other full nodes, archive nodes, or validators.
- In case you manage a setup of senty nodes and use node IDs in your config files.

To see the associated public key:

```bash
secretd tendermint show-validator
```

# Full Node Private key

1. Backup `~/.secretd/config/node_key.json`.


# Full Node Data

1. Gracefully shut down the node:

   ```bash
   sudo systemctl stop secret-node
   ```

2. Backup the `~/.secretd/data/` directory except for the `~/.secretd/data/priv_validator_state.json` file.
3. Backup the `~/.secretd/.compute/` directory.
4. Restart the node:

   ```bash
   sudo systemctl start secret-node
   ```
