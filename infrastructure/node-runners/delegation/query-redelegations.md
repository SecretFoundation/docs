# Query Redelegations

Once you begin a redelegation, you can see its information by using the following command:

```bash
secretcli q staking redelegation <delegator-address> <src-valoper-address> <dst-valoper-address>
```

Or if you want to check all your current unbonding-delegations with distinct validators:

```bash
secretcli q staking redelegations <delegator-address>
```

Additionally, you can get all the outgoing redelegations from a particular validator:

```bash
  secretcli q staking redelegations-from <validator-operator-address>
```
