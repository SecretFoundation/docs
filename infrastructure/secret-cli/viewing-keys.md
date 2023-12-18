# Viewing Keys

## Viewing Private Keys&#x20;

If you check your private keys, you'll now see `<key-alias>`:

```
secretcli keys show <key-alias>

- name: test
  type: local
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""
```

If you want to just see your secret address:

```
secretcli keys show <key-alias> -a

secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
```

You can see all your available keys by typing:

```
secretcli keys list

- name: test
  type: local
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""
- name: test2
  type: local
  address: secret1vcj7r8j96pmdtwdrupxuzpusq2dvxu5nvlylqw
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A7QMHOt+yLGddDxey51QLofwsTJWfqyzYmNOB9L1Oz1S"}'
  mnemonic: ""
```

## Viewing Validator Keys

View the validator operator's address via:

```
secretcli keys show <key-alias> --bech=val
```

View the validator pubkey for your node by typing:

```
secretd tendermint show-validator
```

**Note:** This is the Tendermint signing key, _not_ the operator key you will use in delegation transactions.&#x20;

## Warning

We strongly recommend _NOT_ using the same passphrase for multiple keys. The Tendermint team and the Interchain Foundation will not be responsible for the loss of funds.
