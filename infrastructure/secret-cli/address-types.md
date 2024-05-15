# Address Types

There are three primary Secret Network address types:

1. Secret
2. Secretvaloper
3. Secretpub

## Secret

Secret keys are for receiving and sending funds. They are made using:&#x20;

```
secretcli keys add <name of key>
```

The command will generate an output similar to the following:&#x20;

```
- name: test
  type: local
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

become inspire first replace ask luxury extend member social donor expire lock correct buddy skull task dizzy rather injury decline series reflect piece dumb
```

An example of what a secret key looks like is:&#x20;

* secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca

## Secretvaloper

Secretvaloper keys are used to associate a validator to it's operator, and to invoke staking commands. To view an accounts secretvaloper key use:&#x20;

```
secretcli keys show <account alias> --bech=val
```

The command will generate an output similar to the following:&#x20;

```
- name: test
  type: local
  address: secretvaloper14c29nyq8e9jgpcpw55e3n7ea4aktxg4xnurynd
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ai2I8uRsSxk7QjpEWShNL97ZIdqzq/YE8ymkbCpybS5P"}'
  mnemonic: ""
```

An example of what a secretvaloper key looks like is:

* secretvaloper14c29nyq8e9jgpcpw55e3n7ea4aktxg4xnurynd

## Secretpub

Secretpub keys are publicly available addresses that are distinct from the private / public key pair used for secret keys. They are primarily used by developers in Secret Network DApps, and by secretcli users to create multisig wallets with keys they do not own. To view an accounts secretpub key use:&#x20;

```
secretcli keys show <account alias> --pubkey
```

The command will generate an output containing the corresponding accounts secretpub key:&#x20;

```
{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}
```

