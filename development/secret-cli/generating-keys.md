# Generating Keys

After installing the secretcli, the next thing to do is to start generating your own keys (public and private) to begin receiving, sending, and bonding SCRT.&#x20;

## Generate a `secp256k1` Key

To generate a new _secp256k1_ key:

```
secretcli keys add <key-alias>
```

Note: The output of the above command contains a _**seed phrase**_. It's recommended to save the _seed phrase_ in a safe place in case you forget the password of the operating system's credentials store.

The above command will generate an output similar to:&#x20;

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

## Delete A Key

To delete a key use:&#x20;

```
secretcli keys delete test

Key reference will be deleted. Continue? [y/N]: y
Key deleted forever (uh oh!)
```

After deleting a key you will no longer have access to the associated key account. You may regenerate the deleted key using the secretcli and the keys seed phrase.&#x20;

## Regenerate Key From Seed Phrase

You can regenerate the key from the seed phrase with the following command:

```
secretcli keys add --recover <key-alias>

Enter your bip39 mnemonic
become inspire first replace ask luxury extend member social donor expire lock correct buddy skull task dizzy rather injury decline series reflect piece dumb

- name: test
  type: local
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""
```

## Backup And Export Key

You can also backup your key using `export` — which outputs to _stderr_:

_(copy and paste to a `<key-export-file>`)_

```
secretcli keys export <key-alias>
Enter passphrase to encrypt the exported key:

-----BEGIN TENDERMINT PRIVATE KEY-----
kdf: bcrypt
salt: 893759B19955BA1302328B751361854F
type: secp256k1

5IZ1t7TJUL+D/MeiLmxxpucmMJxyNA2CEI4CiJAfrQe97gNtf3YFqZImSyr7yC05
jD3mmUNSch52z/w513Xmyui67YSvvCNYExGGc4g=
=JWtz
-----END TENDERMINT PRIVATE KEY-----
```

## Import Key

You can import a key using the secretcli with:

```
secretcli keys import <key-alias> <key-export-file>
Enter passphrase to decrypt your key:
```

After importing your key, verify the key is imported with:&#x20;

```
secretcli keys show test

- name: test
  type: local
  address: secret1knpfllytv22umrlahglwmhjxkgavccjltxwnca
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A0QMBqFY4J39i6NrH4qR5uOEnyytpkyeWFg/e0sPd8NJ"}'
  mnemonic: ""
```

##

\
