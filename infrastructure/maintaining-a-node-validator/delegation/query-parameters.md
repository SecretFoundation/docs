# Query Parameters

Parameters define high level settings for staking. You can get the current values by using:

```bash
secretcli q staking params
```

With the above command you will get the values for:

* Unbonding time
* Maximum numbers of validators
* Coin denomination for staking

Example:

```bash
$ secretcli q staking params

{

"unbonding_time": "1814400000000000",

"max_validators": 50,

"max_entries": 7,

"historical_entries": 0,

"bond_denom": "uscrt"

}
```

All these values will be subject to updates though a `governance` process by `ParameterChange` proposals.
