# Query Unbonding-Delegations

Once you begin an unbonding-delegation, you can see its information by using the following command:

```bash
secretcli q staking unbonding-delegation <delegator-address> <validator-operator-address>
```

Or if you want to check all your current unbonding-delegations with distinct validators:

```bash
secretcli q staking unbonding-delegations <delegator-address>
```

Additionally, you can get all the unbonding-delegations from a particular validator:

```bash
secretcli q staking unbonding-delegations-from <validator-operator-address>
```
