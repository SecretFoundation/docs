# Slashing

A user can query and interact with the `slashing` module using the CLI. For more information about how slashing works on the Secret Network go to the [Node Runners](../../../infrastructure/maintaining-a-node-validator/node-runners.md) page and look for the '[Slashing For Downtime](../../../infrastructure/maintaining-a-node-validator/node-runners.md#slashing-for-downtime)' section.

See [Slashing](https://docs.cosmos.network/main/modules/slashing/) for the official Cosmos Network module documentation.

## Query <a href="#query" id="query"></a>

The `query` commands allow users to query `slashing` state:

```bash
secretcli query slashing --help
```

```bash
Available Commands:
  params        Query the current slashing parameters
  signing-info  Query a validator's signing information
  signing-infos Query signing information of all validators
```

### Params <a href="#params" id="params"></a>

The `params` command allows users to query genesis parameters for the slashing module.

```
secretcli query slashing params -oj | jq
```

#### Example Output

```json
{
  "signed_blocks_window": "22500",
  "min_signed_per_window": "0.500000000000000000",
  "downtime_jail_duration": "600s",
  "slash_fraction_double_sign": "0.050000000000000000",
  "slash_fraction_downtime": "0.000100000000000000"
}
```

#### Signed Blocks Window <a href="#signing-info" id="signing-info"></a>

`signed_blocks_window`, alongside `min_signed_per_window` is how validator uptime is calculated. With an average block time of 6 seconds, `22500` blocks is roughly 37 hours worth of blocks.

#### Min Signed Per Window

`min_signed_per_window` is a percentage. For Secret, that number is 50%. In other words, to become jailed, a validator must miss half of the `22500` blocks (as defined by `signed_blocks_window`) in order to become jailed. **Given that 22500 blocks takes roughly 37 hours, it'd require missing nearly 18 hours of consecutive blocks to become jailed and incur a downtime slashing event.**

#### Downtime Jail Duration

`downtime_jail_duration` is how many seconds must pass before a validator can become unjailed by running `secretd tx slashing unjail --from {wallet}`.

#### Slash Fraction Double Sign

`slash_fraction_double_sign` is the percent of all stake on the validator that is burned when a validator is slashed. For most networks including Secret, that value is 5%. Meaning, if 100 SCRT is delegated to the validator regardless of whether it's owned by the operator or delegators, 5 SCRT will be burned and permanently taken out of circulation.

#### Slash Fraction Downtime

`slash_fraction_downtime` is the percent of all stake on the validator that is burned when a validator is slashed. For most networks including Secret, that value is 0.01%. Meaning, if 100 SCRT is delegated to the validator regardless of whether it's owned by the operator or delegators, 0.01 SCRT will be burned and permanently taken out of circulation.

### Signing-info <a href="#signing-info" id="signing-info"></a>

The `signing-info` command allows users to query signing-info of the validator using consensus public key.

```bash
secretcli query slashing signing-info [public-key]
```

#### Example

```bash
secretcli query slashing signing-info \
    '{ "@type": "/cosmos.crypto.ed25519.PubKey","key": "iKZCEP93nVojf2UhQh72yT+d3XEgRlrX1NZBtJJCL2o=" }' 
```

#### Example Output:

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

```bash
secretcli query slashing signing-infos
```

#### Example Output

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

```
secretcli tx slashing --help
```

### Unjail <a href="#unjail" id="unjail"></a>

The `unjail` command allows users to unjail a validator previously jailed for downtime.

```
secretcli tx slashing unjail --from mykey [flags]
```

#### Example

```
secretd tx slashing unjail --from mykey
```

#### Example Output

```
// Some code
```
