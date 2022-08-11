# Minting

Secret Network minting is based on the Comos SDK. For more information on minting [follow this link](https://docs.cosmos.network/master/modules/mint/).

## Available Commands

### Params

You can query for minting/inflation parameters via:

```bash
secretcli q mint params
```

```json
{
  "mint_denom": "uscrt",
  "inflation_rate_change": "0.130000000000000000",
  "inflation_max": "0.100000000000000000",
  "inflation_min": "0.050000000000000000",
  "goal_bonded": "0.670000000000000000",
  "blocks_per_year": "6311520"
}
```

#### Mint Denom

The denomination of the token being minted.

#### Inflation Rate Change&#x20;

The rate of uscrt inflation changing over-time.&#x20;

#### Inflation Max&#x20;

The maximum inflation rate of uscrt tokens over the course of a year.&#x20;

#### Inflation Min&#x20;

The minimum inflation rate of uscrt tokens over the course of a year.&#x20;

#### Goal Bonded&#x20;

The desired % of uscrt tokens bonded from the supply.&#x20;

#### Blocks Per Year

The number of minted blocks per year.&#x20;

### Inflation Value

To query for current inflation value:

```bash
secretcli q mint inflation
```

```bash
# Example inflation value 
0.053814121897161007
```

### Annual Provisions Value

To query for current annual provisions value:

```bash
secretcli q mint annual-provisions
```

```bash
# Example annual provisions value
56489172247714019.069384966908845650
```
