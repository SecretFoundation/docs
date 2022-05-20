# Account



#### Get Tokens <a href="#get-tokens" id="get-tokens"></a>

On a testnet, getting tokens is usually done via a faucet. You can get tokens for testing purposes using the Secret Network faucet [HERE](https://faucet.secrettestnet.io/)

#### [#](https://docs.scrt.network/cli/secretcli.html#query-account-balance)Query Account Balance <a href="#query-account-balance" id="query-account-balance"></a>

After receiving tokens to your address, you can view your account's balance by typing:

```
secretcli query bank balances <secret-address>
```

Get your `<secret-address>` using:

```
secretcli keys show -a <key-alias>
```

(the _-a_ flag is used to display the address only)

You can also supply your address with the following command:

```
secretcli query bank balances $(secretcli keys show -a <key-alias>)
```

Note

When querying an account balance with zero tokens, you will get the error: `No account with address <secret-address> was found in the state.` This can also happen if you fund the account before your node is fully synced. These are both normal.

### [#](https://docs.scrt.network/cli/secretcli.html#send-tokens)Send Tokens <a href="#send-tokens" id="send-tokens"></a>

Use the following command to send tokens from one account to another:

```
secretcli tx bank send <sender-key-alias-or-address> <recipient-address> 10uscrt \
	--memo <tx-memo> \
	--chain-id=<chain-id>
```

Note

The `amount` argument accepts the format `<value|coin_name>`.

Note

You may want to cap the maximum gas consumed by transactions via the `--gas` flag.

If you pass `--gas=auto`, the gas supply is automatically estimated before transaction execution.

Innacurrate gas estimates may occur inbetween the end of the simulation and the actual execution of a transaction. An adjustment needs to be applied on top of the original estimate for the transaction to be broadcasted successfully. Adjustment are controlled via the `--gas-adjustment` flag, with a default value of 1.0.

To view updated balances of origin and destination accounts use:

```
secretcli query bank balances <secret-address>
secretcli query bank balances <recipient-address>
```

You can also check balances at any block using the `--block` flag:

```
secretcli query bank balances <secret-address> --block=<block_height>
```

You can simulate a transaction without actually broadcasting it by appending the `--dry-run` flag:

```
secretcli tx bank send <sender-key-alias-or-address> <recipient-address> 10uscrt \
  --chain-id=<chain-id> \
  --dry-run
```

Furthermore, you can build a transaction and print its JSON format to STDOUT by appending `--generate-only` to the list of arguments:

```
secretcli tx bank send <sender-key-alias-or-address> <recipient-address> 10uscrt \
  --chain-id=<chain-id> \
  --generate-only > unsignedSendTx.json
```

```
secretcli tx sign \
  --chain-id=<chain-id> \
  --from=<key-alias> \
  unsignedSendTx.json > signedSendTx.json
```

Note

The `--generate-only` flag prevents `secretcli` from accessing the local keybase. When the flag is supplied `<sender-key-alias-or-address>` must be an address.

You can validate transaction signatures by typing the following:

```
secretcli tx sign --validate-signatures --from=<key-alias> signedSendTx.json
```

You can broadcast the signed transaction to a node by providing the JSON file using:

```
secretcli tx broadcast --node=<node> signedSendTx.json
```
