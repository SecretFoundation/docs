# Redelegate tokens

A redelegation is a type delegation that allows you to bond illiquid tokens from one validator to another:

```
secretcli tx staking redelegate \
  <src-validator-operator-address> \
  <dst-validator-operator-address> \
  10uscrt \
  --from=<key-alias> \
  --chain-id=<chain-id>
```

Here you can also redelegate a specific `shares-amount` or a `shares-fraction` with the corresponding flags.

The redelegation will be automatically completed when the unbonding period has passed.
