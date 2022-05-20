# Query Unbonding-Delegations



Once you begin an unbonding-delegation, you can see it's information by using the following command:

```
secretcli q staking unbonding-delegation <delegator-address> <validator-operator-address>
```

Or if you want to check all your current unbonding-delegations with distinct validators:

```
secretcli q staking unbonding-delegations <delegator-address>
```

Additionally, you can get all the unbonding-delegations from a particular validator:

```
secretcli q staking unbonding-delegations-from <validator-operator-address>
```
