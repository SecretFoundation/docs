# Restake

As of V1.7 of Secret Network users can enable autocompounding SCRT staking with their respective validators.

when you delegate `uscrt` to a validator. These delegators can receive part of the validators fee revenue. To learn more read about the [Cosmos Token Model](https://github.com/cosmos/cosmos/raw/master/Cosmos\_Token\_Model.pdf).

The autostake feature will claim rewards for you and automatically delegate them back to the same validator. To receive your liquid rewards you will have to unbond.

The minimum amount of staked SCRT to use this feature is 10 SCRT!

{% hint style="info" %}
Learn more about the Restake feature [here](../../secret-contract-fundamentals/available-native-features-modules/auto-restaking.md)
{% endhint %}

### Query restake status <a href="#query-validators" id="query-validators"></a>

You can query the restaking situation per delegator and receive a list with validator addresses for which the user has turned this feature on.

```
secretd query distribution restake-entries [delegator] [flags]
```

### Enable restake <a href="#bond-tokens" id="bond-tokens"></a>

On the Secret Network mainnet, we delegate `uscrt`, where `1scrt = 1000000uscrt`. Instructions can be found [here](delegating.md).

One must be staked before one can activate restaking. The following command can be used to activate restaking for the stake that is with that validator as long more tokens are bonded than `restake-threshold`(currently `10000000 uSCRT = 10 SCRT`).

```
secretcli tx distribution set-auto-restaking [validator] [true/false] --from [delegator]
```

### Query restake Parameters

One can query the parameters for Restake using the command below

```
secretcli q distribution params
```

With the above command you will get the values for all parameters that can be set by Governance including:

* &#x20;`minimum_restake_threshold` - # of uSCRT required to enable restake
* `restake_period` - The autocompouding frequency denominated in the # of blocks

One can also query the `restake-threshold`directly. For now one can use a direct LCD CURL to get the information like: [https://lcd.secret.express/cosmos/distribution/v1beta1/restake\_threshold](https://lcd.secret.express/cosmos/distribution/v1beta1/restake\_threshold) but a SecretCLI and Secret.JS query is being implemented.
