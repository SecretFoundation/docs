# Migration

⚠️ ⚠️ ⚠️

Please make sure you [backup your validator](https://docs.scrt.network/backup/backup-a-validator.html) before you migrate it. Do not forget!

The new node must be at a greater block-height than the old node before moving the key, or you will double-sign blocks!

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_1-run-a-new-full-node-on-a-new-machine)1. [Run a new full node](https://docs.scrt.network/node-guides/run-full-node-mainnet.html) on a new machine. <a href="#_1-run-a-new-full-node-on-a-new-machine" id="_1-run-a-new-full-node-on-a-new-machine"></a>

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machine)2. Confirm you have the recovery seed phrase information for the active key running on the old machine <a href="#_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi" id="_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi"></a>

You can also back it up with:

On the validator node on the old machine:

```
secretcli keys export mykey
```

This prints the private key to `stderr`, you can then paste in into the file `mykey.backup`.

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_3-recover-the-active-key-of-the-old-machine-on-the-new-machine)3. Recover the active key of the old machine on the new machine <a href="#_3-recover-the-active-key-of-the-old-machine-on-the-new-machine" id="_3-recover-the-active-key-of-the-old-machine-on-the-new-machine"></a>

This can be done with the mnemonics:

On the full node on the new machine:

```
secretcli keys add mykey --recover
```

Or with the backup file `mykey.backup` from the previous step:

On the full node on the new machine:

```
secretcli keys import mykey mykey.backup
```

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up)4. Wait for the new full node on the new machine to finish catching-up. <a href="#_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up" id="_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up"></a>

To check on the new full node if it finished catching-up:

On the full node on the new machine:

```
secretcli status | jq .sync_info
```

(`catching_up` should equal `false`)

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_5-after-the-new-node-has-caught-up-stop-the-validator-node)5. After the new node has caught-up, stop the validator node. <a href="#_5-after-the-new-node-has-caught-up-stop-the-validator-node" id="_5-after-the-new-node-has-caught-up-stop-the-validator-node"></a>

To prevent double signing, you should stop the validator node before stopping the new full node to ensure the new node is at a greater block height than the validator node.

If the new node is behind the old validator node, then you may double-sign blocks.

Please read about [the dangers in running a validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html#dangers-in-running-a-validator).

On the validator node on the old machine:

```
sudo systemctl stop secret-node
```

The validator should start missing blocks at this point.

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_6-stop-the-new-full-node)6. Stop the new full node. <a href="#_6-stop-the-new-full-node" id="_6-stop-the-new-full-node"></a>

On the full node on the new machine:

```
sudo systemctl stop secret-node
```

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_7-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine)7. Move the validator's private key from the old machine to the new machine. <a href="#_7-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine" id="_7-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine"></a>

On the old machine the file is `~/.secretd/config/priv_validator_key.json`.

You can copy it manually or for example you can copy the file to the new machine using ssh:

On the validator node on the old machine:

```
scp ~/.secretd/config/priv_validator_key.json ubuntu@new_machine_ip:~/.secretd/config/priv_validator_key.json
```

After being copied, the key (`priv_validator_key.json`) should then be removed from the old node's `config` directory to prevent double-signing if the node were to start back up.

On the validator node on the old machine:

```
mv ~/.secretd/config/priv_validator_key.json ~/.secretd/bak_priv_validator_key.json
```

#### [#](https://docs.scrt.network/node-guides/migrate-a-validator.html#\_8-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node)8. On the new server start the new full node which is now your validator node. <a href="#_8-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node" id="_8-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node"></a>

On the new machine:

```
sudo systemctl start secret-node
```

The new node should start signing blocks once caught-up.
