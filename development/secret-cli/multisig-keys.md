# Multisig Keys

You can generate and print a multisig public key by typing:

```
secretcli keys add --multisig=name1,name2,name3[...] --multisig-threshold=K <new-key-alias>
```

`K` is the minimum number of private keys that must have signed the transactions carrying the public key's address as a signer.

The `--multisig` flag must contain the name of public keys to be combined into a public key that will be generated and stored as `new-key-alias` in the local database.

All names supplied through `--multisig` must already exist in the local database. Unless the flag `--nosort` is set. The order of the supplied keys on the command line does not matter, i.e. the following commands generate two identical keys:

```
secretcli keys add --multisig=foo,bar,baz --multisig-threshold=2 <multisig-address>
secretcli keys add --multisig=baz,foo,bar --multisig-threshold=2 <multisig-address>
```

Multisig addresses can also be generated on-the-fly and printed by typing:

```
secretcli keys show --multisig-threshold K name1 name2 name3 [...]
```

For more information on generating, signing and broadcasting transactions using multiple signatures see [Multisig Transactions](https://docs.scrt.network/cli/secretcli.html#multisig-transactions).
