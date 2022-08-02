# Migrating a Validator

{% hint style="danger" %}
Ensure you [backup your validator](https://docs.scrt.network/backup/backup-a-validator.html) before you migrate it. Do not forget!
{% endhint %}

### [Run A Full Node](https://docs.scrt.network/node-guides/run-full-node-mainnet.html) On A New Machine <a href="#_1-run-a-new-full-node-on-a-new-machine" id="_1-run-a-new-full-node-on-a-new-machine"></a>

### Verify Mnemonics Are Backed Up <a href="#_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi" id="_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi"></a>

If you don't have the mnemonics saved, you can back it up with:

```bash
# from the validator machine
secretd keys export mykey
```

This prints the private key to `stderr`, you can then paste in into the file `mykey.backup`.

### Sync Full Node <a href="#_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up" id="_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up"></a>

To check on the new full node if it finished catching-up:

```bash
# on the new full node
secretd status | jq .SyncInfo

# expected output should be similar to:
{
  "latest_block_hash": "EEE123FB3679525B7603B91CDB654879EA25375865AC58DC275C562E2EC07A5A",
  "latest_app_hash": "8BC5C45BA7D049F32D999AF8E9D8346BCD8B7A4DB958EA6B2C5322B96971DB95",
  "latest_block_height": "3944928",
  "latest_block_time": "2022-06-20T19:16:30.14988796Z",
  "earliest_block_hash": "76BA3679B642D2FFB5ED967A241021C73D2B2058F42792FCD1ACAC9D64C87603",
  "earliest_app_hash": "05F67C619449262C8898D533B91A6FEAAB5F5652FB45EB5AFE1E972402B8EDF0",
  "earliest_block_height": "3344001",
  "earliest_block_time": "2022-05-11T15:32:59.767672375Z",
  "catching_up": false
}
```

{% hint style="warning" %}
Only continue if `catching_up` is `false`
{% endhint %}

### Stop Validator Node <a href="#_5-after-the-new-node-has-caught-up-stop-the-validator-node" id="_5-after-the-new-node-has-caught-up-stop-the-validator-node"></a>

{% hint style="danger" %}
To prevent double signing, you should stop the validator node before stopping the new full node to ensure the new node is at a greater block height than the validator node.
{% endhint %}

Please read about [the dangers in running a validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html#dangers-in-running-a-validator).

```bash
# on the validator node
sudo systemctl stop secret-node
```

The validator should start missing blocks at this point. This is the desired behavior!

### Migrate priv\_validator\_key.json <a href="#_7-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine" id="_7-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine"></a>

On the validator node, the file is `~/.secretd/config/priv_validator_key.json`.

You can copy it manually or for example you can copy the file to the new machine using ssh:

```bash
# on the validator node/old machine
scp ~/.secretd/config/priv_validator_key.json ubuntu@new_machine_ip:~/.secretd/config/priv_validator_key.json
```

After being copied, the key (`priv_validator_key.json`) should then be removed from the old node's `config` directory to prevent double-signing if the node were to start back up.

```bash
# on the validator node/old machine
mv ~/.secretd/config/priv_validator_key.json ~/.secretd/bak_priv_validator_key.json
```

#### Restart Your Migrated Validator <a href="#_8-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node" id="_8-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node"></a>

```bash
# on the new machine/new validator
sudo systemctl restart secret-node
```

The new node should start signing blocks once caught up.
