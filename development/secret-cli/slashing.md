# Slashing

A user can query and interact with the `slashing` module using the CLI. For more information about how slashing works on the Secret Network go to the [Node Runners](../../node-runners/) page and look for the '[Slashing For Downtime](../../node-runners/#slashing-for-downtime)' section.

## Query <a href="#query" id="query"></a>

The `query` commands allow users to query `slashing` state:/

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
secretcli query slashing params
```

#### Example Output&#x20;

```json
{
  "signed_blocks_window": "22500",
  "min_signed_per_window": "0.500000000000000000",
  "downtime_jail_duration": "600s",
  "slash_fraction_double_sign": "0.050000000000000000",
  "slash_fraction_downtime": "0.000100000000000000"
}
```

#### Signed Blocks Window  <a href="#signing-info" id="signing-info"></a>

#### Min Signed Per Window&#x20;

#### Downtime Jail Duration&#x20;

#### Slash Fraction Double Sign&#x20;

#### Slash Fraction Downtime&#x20;

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

#### Example Output&#x20;

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

#### Example Output&#x20;

```
// Some code
```
