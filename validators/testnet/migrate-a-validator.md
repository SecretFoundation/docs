# Migrate A Validator

⚠️ ⚠️ ⚠️

Please make sure you [backup your validator](https://docs.scrt.network/testnet/run-full-node-testnet.html) before you migrate it.

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_1-run-a-new-full-node-on-a-new-machine)1. [Run a new full node](https://docs.scrt.network/testnet/run-full-node-testnet.html) on a new machine. <a href="#_1-run-a-new-full-node-on-a-new-machine" id="_1-run-a-new-full-node-on-a-new-machine"></a>

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machine)2. Confirm you have the recovery seed phrase information for the active key running on the old machine <a href="#_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi" id="_2-confirm-you-have-the-recovery-seed-phrase-information-for-the-active-key-running-on-the-old-machi"></a>

You can also back it up with:

On the validator node on the old machine:

```
secretcli keys export mykey
```

This prints the private key to `stderr`, you can then paste in into the file `mykey.backup`.

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_3-recover-the-active-key-of-the-old-machine-on-the-new-machine)3. Recover the active key of the old machine on the new machine <a href="#_3-recover-the-active-key-of-the-old-machine-on-the-new-machine" id="_3-recover-the-active-key-of-the-old-machine-on-the-new-machine"></a>

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

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up)4. Wait for the new full node on the new machine to finish catching-up. <a href="#_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up" id="_4-wait-for-the-new-full-node-on-the-new-machine-to-finish-catching-up"></a>

To check on the new full node if it finished catching-up:

On the full node on the new machine:

```
secretcli status | jq .sync_info
```

(`catching_up` should equal `false`)

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_5-after-the-new-node-have-caught-up-stop-the-validator-node-and-then-stop-the-new-full-node)5. After the new node have caught-up, stop the validator node and then stop the new full node. <a href="#_5-after-the-new-node-have-caught-up-stop-the-validator-node-and-then-stop-the-new-full-node" id="_5-after-the-new-node-have-caught-up-stop-the-validator-node-and-then-stop-the-new-full-node"></a>

To prevert double signing, you should stop the validator node and only then stop the new full node.

Please read about [the dangers in running a validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html#dangers-in-running-a-validator).

On the validator node on the old machine:

```
sudo systemctl stop secret-node
```

On the full node on the new machine:

```
sudo systemctl stop secret-node
```

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_6-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine)6. Move the validator's private key from the old machine to the new machine. <a href="#_6-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine" id="_6-move-the-validator-s-private-key-from-the-old-machine-to-the-new-machine"></a>

On the old machine the file is `~/.secretd/config/priv_validator_key.json`.

You can copy it manually or for example you can copy the file to the new machine using ssh:

On the validator node on the old machine:

```
scp ~/.secretd/config/priv_validator_key.json ubuntu@new_machine_ip:~/.secretd/config/priv_validator_key.json
```

#### [#](https://docs.scrt.network/testnet/migrate-a-testnet-validator.html#\_7-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node)7. On the new server start the new full node which is now your validator node. <a href="#_7-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node" id="_7-on-the-new-server-start-the-new-full-node-which-is-now-your-validator-node"></a>

On the new machine:

```
sudo systemctl start secret-node
```
