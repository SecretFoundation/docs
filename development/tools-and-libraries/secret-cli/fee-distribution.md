# Fee Distribution

## Query Distribution Parameters <a href="#query-distribution-parameters" id="query-distribution-parameters"></a>

To check current distribution parameters, run:

```bash
secretcli q distribution params 
```

```json
# secretcli q distribution params | jq

{
  "community_tax": "0.020000000000000000",
  "base_proposer_reward": "0.010000000000000000",
  "bonus_proposer_reward": "0.040000000000000000",
  "withdraw_addr_enabled": true,
  "secret_foundation_tax": "0.000000000000000000",
  "secret_foundation_address": ""
}
```

### Query Distribution Community Pool <a href="#query-distribution-community-pool" id="query-distribution-community-pool"></a>

To query all coins in the community pool under Governance control:

```
secretcli q distribution community-pool
```

```json
# secretcli q distribution community-pool | jq

{
  "pool": [
    {
      "denom": "uscrt",
      "amount": "1137703297907070.071620483588359560"
    }
  ]
}
```

### Query Outstanding Validator rewards <a href="#query-outstanding-validator-rewards" id="query-outstanding-validator-rewards"></a>

To check current outstanding (un-withdrawn) rewards, run:

```bash
secretcli q distribution validator-outstanding-rewards <validator-address>
```

```json
# secretcli q distribution validator-outstanding-rewards <validator-address> | jq

{
  "rewards": []
}
```

### Query Validator Commission <a href="#query-validator-commission" id="query-validator-commission"></a>

To check current outstanding commission for a validator, run:

```bash
secretcli q distribution commission <validator-operator-address>
```

```json
# secretcli q distribution commission <validator-operator-address> | jq

{
  "commission": []
}
```

### Query Validator Slashes <a href="#query-validator-slashes" id="query-validator-slashes"></a>

To check historical slashes for a validator, run:

```
secretcli q distribution slashes <validator-operator-address> <start-height> <end-height>
```

```json
# secretcli q distribution slashes secretvaloper1t5wtcuwjkdct9qkw2h6m48zu2hectpd6ulmekk 1000 10000 | jq

{
  "slashes": [],
  "pagination": {
    "next_key": null,
    "total": "0"
  }
}
```

### Query Delegator Rewards <a href="#query-delegator-rewards" id="query-delegator-rewards"></a>

To check current rewards for a delegation (were they to be withdrawn), run:

```bash
secretcli q distribution rewards <delegator-address> <validator-address>
```

```json
# secretcli q distribution rewards secret1kcy20p0cs2wakeqz00xgs5m0cmj65283xqmvfs secretvaloper1gutgtpw0caqfsp8ja0r5yecv8jxz2y8vxxa9mw | jq

{
  "rewards": [
    {
      "denom": "uscrt",
      "amount": "0.000355436247820000"
    }
  ]
}
```

### Query All Delegator Rewards <a href="#query-all-delegator-rewards" id="query-all-delegator-rewards"></a>

To check all current rewards for a delegation (were they to be withdrawn), run:

```bash
secretcli q distribution rewards <delegator-address>
```

```json
# secretcli q distribution rewards secret1kcy20p0cs2wakeqz00xgs5m0cmj65283xqmvfs | jq

{
  "rewards": [],
  "total": []
}
```
