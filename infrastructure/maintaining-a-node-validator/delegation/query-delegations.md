# Query Delegations

Once you've submitted a delegation to a validator, you can see it's information by using the following command:

```bash
secretcli q staking delegation <delegator-address> <validator-operator-address>
```

Example:

```bash
secretcli q staking delegation \
	secret1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p \
	secretvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
```

Or if you want to check all your current delegations with distinct validators:

```bash
secretcli q staking delegations <delegator-address>
```
