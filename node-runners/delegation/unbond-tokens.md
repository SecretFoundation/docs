# Unbond Tokens

Please Note

There currently is in place a _21_ days unbonding rule, during which no rewards are handed out.

If for any reason the validator misbehaves, or you just want to unbond a certain amount of tokens, use this following command.

```
secretcli tx staking unbond \
  <validator-address> \
  10uscrt \
  --from=<key-alias> \
  --chain-id=<chain-id>
```

The unbonding will be automatically completed when the unbonding period has passed.
