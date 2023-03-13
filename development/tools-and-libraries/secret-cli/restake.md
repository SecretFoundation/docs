# ReStake

As of V1.7 of Secret Network users can enable autocompounding SCRT staking with their respective validators.

when you delegate `uscrt` to a validator. These delegators can receive part of the validators fee revenue. To learn more read about the [Cosmos Token Model](https://github.com/cosmos/cosmos/raw/master/Cosmos\_Token\_Model.pdf).

The autostake feature will claim rewards for you and automatically delegate them back to the same validator. To receive your liquid rewards you will have to unbond.

The minimum amount of staked SCRT to use this feature is 10 SCRT!

### Query restake status <a href="#query-validators" id="query-validators"></a>

You can query the restaking situation per delegator and receive a list with validator addresses for which the user has turned this feature on.

```
secretd query distribution restake-entries [delegator] [flags]
```

### Enable restake <a href="#bond-tokens" id="bond-tokens"></a>

On the Secret Network mainnet, we delegate `uscrt`, where `1scrt = 1000000uscrt`. Instructions can be found [here](delegating.md).

One must be staked before one can activate restaking. The following command can be used to activate restaking for the stake that is with that validator as long more tokens are bonded than `restake-threshold`(currently `10000000 uSCRT`).

```
secretcli tx distribution set-auto-restaking [validator] [true/false] --from [delegator]
```

### Query restake Parameters

The only parameter for Restake is the restake-threshold, the query command is not yet implemented in SecretCLI.

```
Coming Soon!
```

With the above command you will get the values for:

* &#x20;\# of uSCRT required to enable restake

For now one can use a direct LCD CURL to get the information like: [https://lcd.secret.express/cosmos/distribution/v1beta1/restake\_threshold](https://lcd.secret.express/cosmos/distribution/v1beta1/restake\_threshold)

