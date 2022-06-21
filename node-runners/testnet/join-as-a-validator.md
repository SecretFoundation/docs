# Join As A Validator



#### How to become a validator on Secret Network <a href="#how-to-become-a-validator-on-secret-network" id="how-to-become-a-validator-on-secret-network"></a>

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_1-run-a-new-full-node-on-a-new-machine)**1.** [**Run a new full node**](https://docs.scrt.network/testnet/run-full-node-testnet.html) **on a new machine.**

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_2-set-your-minimum-gas-price-parameter)**2. Set your `minimum-gas-price` parameter**

We recommend starting with `0.1uscrt` per gas unit:

```
perl -i -pe 's/^minimum-gas-prices = .+?$/minimum-gas-prices = "0.1uscrt"/' ~/.secretd/config/app.toml
sudo systemctl restart secret-node
```

Your validator will not accept transactions that specify `--gas-price` lower than the `minimun-gas-price` you set here.

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_3-generate-a-new-key-pair-for-yourself-change-key-alias-with-any-word-of-your-choice-this-is-just-for-your-internal-personal-reference)**3. Generate a new key pair for yourself (change `<key-alias>` with any word of your choice, this is just for your internal/personal reference):**

```
secretcli keys add <key-alias>
```

**⚠️Note⚠️: Backup the mnemonics!** **⚠️Note⚠️: Please make sure you also** [**backup your validator**](https://docs.scrt.network/testnet/backup-a-testnet-validator.html)

**Note**: If you already have a key you can import it with the bip39 mnemonic with `secretcli keys add <key-alias> --recover` or with `secretcli keys export` (exports to `stderr`!!) & `secretcli keys import`.

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_4-transfer-tokens-to-your-delegator-s-address)**4. Transfer tokens to your delegator's address:**

This is the `secret` wallet from which you delegate your funds to you own validator. You must delegate at least 1 SCRT (1000000uscrt) from this wallet to your validator.

To create a `secret` wallet, run:

```
secretcli keys add <key-alias>
```

Make sure to backup the mnemonic you got from the above command!

Then transfer funds to address you just created.

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_5-check-that-you-have-the-funds)**5. Check that you have the funds:**

```
secretcli q account $(secretcli keys show -a <key-alias>)
```

If you get the following message, it means that you have no tokens yet:

```
ERROR: unknown address: account secret1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx does not exist
```

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_6-join-the-network-as-a-new-validator-replace-moniker-with-the-moniker-you-configured-in-step-3-of-creating-a-full-node-and-adjust-the-amount-you-want-to-stake)**6. Join the network as a new validator: replace `<MONIKER>` with the moniker you configured in step 3 of** [**creating a full-node**](https://docs.scrt.network/testnet/run-full-node-testnet.html)**, and adjust the amount you want to stake**

(remember 1 SCRT = 1,000,000 uSCRT, and so the command below stakes 100k SCRT).

```
secretcli tx staking create-validator \
  --amount=<amount-to-delegate-to-yourself>uscrt \
  --pubkey=$(secretd tendermint show-validator) \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --moniker=<MONIKER> \
  --from=<key-alias>
```

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#\_7-check-that-you-have-been-added-as-a-validator)**7. Check that you have been added as a validator:**

```
secretcli q staking validators | jq '.[] | select(.description.moniker == "<MONIKER>")'
```

Or run: `secretcli q staking validators | grep moniker`. You should see your moniker listed.

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#dangers-in-running-a-validator)Dangers in running a validator <a href="#dangers-in-running-a-validator" id="dangers-in-running-a-validator"></a>

There are a couple of scenarios that can lead to losing a precentage of your and your delegators' stake. These are called slashing events.

The following is updated as of March 23, 2020.

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#slashing-for-downtime)**Slashing for downtime**

Conditions for downtime:

* Signing less than 2500 blocks out of every 5000-block window. For a block time of 5.8 seconds, this roughly translates to being up for 4 hours out of every 8-hour window.

Penalties for downtime:

* Slashing of 1% of your and your delegators' staking amount.
* Jailing for 10 minutes of your validator node. You don't earn block rewards for this period and at the end must manually unjail your node with `secretcli tx slashing unjail --from <key-alias>`.

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#slashing-for-double-signing)**Slashing for double-signing**

Conditions for double-signing:

* Your validator signs the same block height twice.

Penalties for double-signing:

* Slashing of 5% of your and your delegators' staking amount.
* Jailing forever (tombstoned) of your validator node. You cannot earn block rewards anymore with this validator and you and your delegators must redelegate your stake to a different validator.

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#protecting-your-validator-agains-ddos-attacks)Protecting your validator agains DDoS attacks <a href="#protecting-your-validator-agains-ddos-attacks" id="protecting-your-validator-agains-ddos-attacks"></a>

See [Sentry Nodes](https://docs.scrt.network/node-guides/sentry-nodes.html).

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#staking-more-tokens)Staking more tokens <a href="#staking-more-tokens" id="staking-more-tokens"></a>

(remember 1 SCRT = 1,000,000 uSCRT)

In order to stake more tokens beyond those in the initial transaction, run:

```
secretcli tx staking delegate $(secretcli keys show <key-alias> --bech=val -a) <amount>uscrt --from <key-alias>
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#renaming-your-moniker)Renaming your moniker <a href="#renaming-your-moniker" id="renaming-your-moniker"></a>

```
secretcli tx staking edit-validator --moniker <new-moniker> --from <key-alias>
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#seeing-your-rewards-from-being-a-validator)Seeing your rewards from being a validator <a href="#seeing-your-rewards-from-being-a-validator" id="seeing-your-rewards-from-being-a-validator"></a>

```
secretcli q distribution rewards $(secretcli keys show -a <key-alias>)
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#seeing-your-commissions-from-your-delegators)Seeing your commissions from your delegators <a href="#seeing-your-commissions-from-your-delegators" id="seeing-your-commissions-from-your-delegators"></a>

```
secretcli q distribution commission $(secretcli keys show -a <key-alias> --bech=val)
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#withdrawing-rewards)Withdrawing rewards <a href="#withdrawing-rewards" id="withdrawing-rewards"></a>

```
secretcli tx distribution withdraw-rewards $(secretcli keys show --bech=val -a <key-alias>) --from <key-alias>
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#withdrawing-rewards-commissions)Withdrawing rewards+commissions <a href="#withdrawing-rewards-commissions" id="withdrawing-rewards-commissions"></a>

```
secretcli tx distribution withdraw-rewards $(secretcli keys show --bech=val -a <key-alias>) --from <key-alias> --commission
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#removing-your-validator)Removing your validator <a href="#removing-your-validator" id="removing-your-validator"></a>

Currently deleting a validator is not possible. If you redelegate or unbond your self-delegations then your validator will become offline and all your delegators will start to unbond.

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#changing-your-validator-s-commission-rate)Changing your validator's commission-rate <a href="#changing-your-validator-s-commission-rate" id="changing-your-validator-s-commission-rate"></a>

You are currently unable to modify the `--commission-max-rate` and `--commission-max-change-rate"` parameters.

Modifying the commision-rate can be done using this:

```
secretcli tx staking edit-validator --commission-rate="0.05" --from <key-alias>
```

#### [#](https://docs.scrt.network/testnet/join-validator-testnet.html#slashing)Slashing <a href="#slashing" id="slashing"></a>

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#unjailing)**Unjailing**

To unjail your jailed validator

```
secretcli tx slashing unjail --from <key-alias>
```

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#signing-info)**Signing Info**

To retrieve a validator's signing info:

```
secretcli q slashing signing-info <validator-conspub-key>
```

[**#**](https://docs.scrt.network/testnet/join-validator-testnet.html#query-parameters)**Query Parameters**

You can get the current slashing parameters via:

```
secretcli q slashing params
```
