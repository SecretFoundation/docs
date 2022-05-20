# Query Redelegations



Once you begin an redelegation, you can see it's information by using the following command:

```
secretcli q staking redelegation <delegator-address> <src-valoper-address> <dst-valoper-address>
```

Or if you want to check all your current unbonding-delegations with distinct validators:

```
secretcli q staking redelegations <delegator-address>
```

Additionally, you can get all the outgoing redelegations from a particular validator:

```
  secretcli q staking redelegations-from <validator-operator-address>
```
