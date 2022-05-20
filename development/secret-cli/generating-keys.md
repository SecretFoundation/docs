# Generating Keys

You'll need a private account and public key pair (a.k.a. `sk, pk` respectively)\ to be able to receive funds, send txs, bond txs, etc.

To generate a new _secp256k1_ key:

```
secretcli keys add <key-alias>
```

The output of the above command contains a _seed phrase_. It's recommended to save the _seed phrase_ in a safe place in case you forget the password of the operating system's credentials store.

You can regenerate the key from the seed phrase with the following command:

```
secretcli keys add --recover <key-alias>
```

You can also backup your key using `export` — which outputs to _stderr_:

_(copy and paste to a `<key-export-file>`)_

```
secretcli keys export <key-alias>
```

and import it with:

```
secretcli keys import <key-alias> <key-export-file>
```

If you check your private keys, you'll now see `<key-alias>`:

```
secretcli keys show <key-alias>
```

If you want to just see your secret address:

```
secretcli keys show <key-alias> -a
```

View the validator operator's address via:

```
secretcli keys show <key-alias> --bech=val
```

You can see all your available keys by typing:

```
secretcli keys list
```

View the validator pubkey for your node by typing:

```
secretd tendermint show-validator
```

Note: this is the Tendermint signing key, _not_ the operator key you will use in delegation transactions.

Warning

We strongly recommend _NOT_ using the same passphrase for multiple keys. The Tendermint team and the Interchain Foundation will not be responsible for the loss of funds.

#### [#](https://docs.scrt.network/cli/secretcli.html#generate-multisig-public-keys) <a href="#generate-multisig-public-keys" id="generate-multisig-public-keys"></a>

\
