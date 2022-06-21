# Slashing

You can find slashing related CLI commands under [Validators/Slashing](https://docs.scrt.network/cli/join-validator-mainnet.html#Slashing).

A user can query and interact with the `slashing` module using the CLI.

[Norfmenn](https://app.gitbook.com/u/eDRsA9E9i6eX2gnIzh49LPEHA1v2 "mention") please take a look at this and rewrite it if necessary. The example outputs are from running the commands on secret, so they should be fine&#x20;

## Query <a href="#query" id="query"></a>

The `query` commands allow users to query `slashing` state.

`secretcli query slashing --help`

### Params <a href="#params" id="params"></a>

The `params` command allows users to query genesis parameters for the slashing module.

`secretcli query slashing params`

example output:

```json
{
  "signed_blocks_window": "22500",
  "min_signed_per_window": "0.500000000000000000",
  "downtime_jail_duration": "600s",
  "slash_fraction_double_sign": "0.050000000000000000",
  "slash_fraction_downtime": "0.000100000000000000"
}
```

### Signing-info <a href="#signing-info" id="signing-info"></a>

The `signing-info` command allows users to query signing-info of the validator using consensus public key.

`secretcli query slashing signing-infos`

example:

```
secretcli query slashing signing-info '{ "@type": "/cosmos.crypto.ed25519.PubKey", "key": "iKZCEP93nVojf2UhQh72yT+d3XEgRlrX1NZBtJJCL2o=" }' 
```

example output:

```json
{
  "address": "secretvalcons1hgsv6kc667du838csfuy7swcdq2z5mdtuje4wa",
  "start_height": "3117888",
  "index_offset": "237143",
  "jailed_until": "1970-01-01T00:00:00Z",
  "tombstoned": false,
  "missed_blocks_counter": "38"
}
```

### Signing-infos <a href="#signing-infos" id="signing-infos"></a>

The `signing-infos` command allows users to query signing infos of all validators.

`secretcli query slashing signing-infos`

```json
{
  "info": [
    // ...
    {
      "address": "secretvalcons1hgsv6kc667du838csfuy7swcdq2z5mdtuje4wa",
      "start_height": "3117888",
      "index_offset": "237143",
      "jailed_until": "1970-01-01T00:00:00Z",
      "tombstoned": false,
      "missed_blocks_counter": "38"
    },
    // ...
  ]
}
```

## Transactions <a href="#transactions" id="transactions"></a>

The `tx` commands allow users to interact with the `slashing` module.

`secretd tx slashing --help`

## Unjail <a href="#unjail" id="unjail"></a>

The `unjail` command allows users to unjail a validator previously jailed for downtime.

`secretd tx slashing unjail --from mykey [flags]`

Example:

`secretd tx slashing unjail --from mykey`
