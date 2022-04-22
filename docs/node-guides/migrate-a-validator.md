# Migrate a Validator

:warning: :warning: :warning:

Please make sure you [backup your validator](./backup/backup-a-validator.md) before you migrate it. Do not forget!

The new node must be at a greater block-height than the old node before moving the key, or you will double-sign blocks!

### 1. [Run a new full node](run-full-node-mainnet.md) on a new machine.

### 2. Confirm you have the recovery seed phrase information for the active key running on the old machine

You can also back it up with:

On the validator node on the old machine:

```bash
secretcli keys export mykey
```

This prints the private key to `stderr`, you can then paste in into the file `mykey.backup`.

### 3. Recover the active key of the old machine on the new machine

This can be done with the mnemonics:

On the full node on the new machine:

```bash
secretcli keys add mykey --recover
```

Or with the backup file `mykey.backup` from the previous step:

On the full node on the new machine:

```bash
secretcli keys import mykey mykey.backup
```

### 4. Wait for the new full node on the new machine to finish catching-up.

To check on the new full node if it finished catching-up:

On the full node on the new machine:

```bash
secretcli status | jq .sync_info
```

(`catching_up` should equal `false`)

### 5. After the new node has caught-up, stop the validator node.

To prevent double signing, you should stop the validator node before stopping the new full node to ensure the new node is at a greater block height than the validator node.

If the new node is behind the old validator node, then you may double-sign blocks.

Please read about [the dangers in running a validator](join-validator-mainnet.md#dangers-in-running-a-validator).

On the validator node on the old machine:

```bash
sudo systemctl stop secret-node
```

The validator should start missing blocks at this point.

### 6. Stop the new full node. 

On the full node on the new machine:

```bash
sudo systemctl stop secret-node
```

### 7. Move the validator's private key from the old machine to the new machine.

On the old machine the file is `~/.secretd/config/priv_validator_key.json`.

You can copy it manually or for example you can copy the file to the new machine using ssh:

On the validator node on the old machine:

```bash
scp ~/.secretd/config/priv_validator_key.json ubuntu@new_machine_ip:~/.secretd/config/priv_validator_key.json
```

After being copied, the key (`priv_validator_key.json`) should then be removed from the old node's `config` directory to prevent double-signing if the node were to start back up.

On the validator node on the old machine:

```bash
mv ~/.secretd/config/priv_validator_key.json ~/.secretd/bak_priv_validator_key.json
```

### 8. On the new server start the new full node which is now your validator node.

On the new machine:

```bash
sudo systemctl start secret-node
```

The new node should start signing blocks once caught-up.
