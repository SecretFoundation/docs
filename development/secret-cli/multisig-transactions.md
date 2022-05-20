# Multisig Transactions

Multisig transactions require signatures of multiple private keys. Generating and signing a transaction from a multisig account involves multiple parties. A multisig transaction is initiated by any key holder, and at least one of them would need to import other parties' public keys into their Keybase and generate a multisig public key to finalize and broadcast the multisig transaction.

For example, given a multisig key comprising the keys `p1`, `p2`, and `p3`, each of which is held by a distinct party, the user holding `p1` will need to import both `p2` and `p3` to generate the multisig account public key:

```
secretcli keys add \
  p2 \
  --pubkey=secretpub1addwnpepqtd28uwa0yxtwal5223qqr5aqf5y57tc7kk7z8qd4zplrdlk5ez5kdnlrj4

secretcli keys add \
  p3 \
  --pubkey=secretpub1addwnpepqgj04jpm9wrdml5qnss9kjxkmxzywuklnkj0g3a3f8l5wx9z4ennz84ym5t

secretcli keys add \
  p1p2p3 \
  --multisig-threshold=2 \
  --multisig=p1,p2,p3
```

When a new multisig public key `p1p2p3` has been stored its address will be used as signer of multisig transactions:

```
secretcli keys show p1p2p3 -a
```

You may also view multisig threshold, pubkey constituents and respective weights by viewing the JSON output of the key or passing the `--show-multisig` flag:

```
secretcli keys show p1p2p3 -o json

secretcli keys show p1p2p3 --show-multisig
```

The first step to create a multisig transaction is to initiate it on behalf of the multisig address created above using the following command:

```
secretcli tx bank send secret1570v2fq3twt0f0x02vhxpuzc9jc4yl30q2qned 1000000uscrt \
  --from=<multisig-address> \
  --generate-only > unsignedTx.json
```

The file `unsignedTx.json` contains the unsigned transaction encoded in JSON. `p1` can now sign the transaction with its own private key:

```
secretcli tx sign \
  unsignedTx.json \
  --multisig=<multisig-address> \
  --from=p1 \
  --output-document=p1signature.json
```

Once the signature is generated, `p1` transmits both `unsignedTx.json` and `p1signature.json` to `p2` or `p3`, which in turn will generate their respective signature:

```
secretcli tx sign \
  unsignedTx.json \
  --multisig=<multisig-address> \
  --from=p2 \
  --output-document=p2signature.json
```

`p1p2p3` is a 2-of-3 multisig key, therefore one additional signature is sufficient. Any the key holders can now generate the multisig transaction by combining the required signature files:

```
secretcli tx multisign \
  unsignedTx.json \
  p1p2p3 \
  p1signature.json p2signature.json > signedTx.json
```

The transaction can now be sent to the node:

```
secretcli tx broadcast signedTx.json
```
