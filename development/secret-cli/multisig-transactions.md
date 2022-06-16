# Multisig Transactions

Multisig transactions require signatures of multiple private keys, typically owned by multiple parties. A multisig transaction is initiated by any key holder, and at least one of them would need to import other parties' public keys into their Keybase and generate a multisig public key to finalize and broadcast multisig transactions.

## Show Multisig Address

When a new multisig public key `test_multisig` is stored its address will be the signer of multisig transactions:

```
secretcli keys show test_multisig -a

secret1whdl9yjy8c7p3062xjehf2m69evljp8yfcv9zt
```

## View Multisig Threshold

You may also view multisig threshold, pubkey constituents and respective weights by viewing the JSON output of the key or passing the `--show-multisig` flag:

```
secretcli keys show p1p2p3

- name: test_multisig
  type: multi
  address: secret1whdl9yjy8c7p3062xjehf2m69evljp8yfcv9zt
  pubkey: '{"@type":"/cosmos.crypto.multisig.LegacyAminoPubKey","threshold":2,"public_keys":[{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AiXwUPtwTJqxKZq/BjKi+7EFhqR2Aj9QT94lFzb5Ednp"},{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A7QMHOt+yLGddDxey51QLofwsTJWfqyzYmNOB9L1Oz1S"},{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}]}'
  mnemonic: ""
```

The `-p` flag can be used interchangeably with the `--pubkey` flag to only show the output of pubkey information.&#x20;

```
secretcli keys show test_multisig
```

### Make Viewing Multisig Keys Pretty&#x20;



## Initiate Multisig Transaction

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
