# Becoming A Validator

## Creating a Validator

In order to become an **active** validator, you must have more stake than the [bottom validator](https://www.mintscan.io/secret/validators). You may still execute the following steps, but you will not be active and therefore won't receive staking rewards.

### [**Run a Full Node**](https://docs.scrt.network/node-guides/run-full-node-mainnet.html)\*\*\*\*

In order to become a validator, you node must be fully synced with the network. You can check this by doing:

```bash
secretd status | jq .SyncInfo.catching_up
```

When the value of `catching_up` is _false_, your node is fully sync'd with the network. You can speed up syncing time by [State Syncing](state-sync.md) to the current block.

```bash
  "sync_info": {
    "latest_block_hash": "7BF95EED4EB50073F28CF833119FDB8C7DFE0562F611DF194CF4123A9C1F4640",
    "latest_app_hash": "7C0C89EC4E903BAC730D9B3BB369D870371C6B7EAD0CCB5080B5F9D3782E3559",
    "latest_block_height": "668538",
    "latest_block_time": "2020-10-31T17:50:56.800119764Z",
    "earliest_block_hash": "E7CAD87A4FDC47DFDE3D4E7C24D80D4C95517E8A6526E2D4BB4D6BC095404113",
    "earliest_app_hash": "",
    "earliest_block_height": "1",
    "earliest_block_time": "2021-09-15T14:02:31Z",
    "catching_up": false
  },
```

### **Confirm Wallet is Funded:**

This is the `secret` wallet which you used \*\*\*\* to create your full node, and will use to delegate your funds to you own validator. You must delegate at least 1 SCRT (1000000uscrt) from this wallet to your validator.

```bash
secretd q bank balances $(secretd keys show -a <key-alias>)
```

If you get the following message, it means that you have no tokens, or your node is not yet synced:

```bash
ERROR: unknown address: account secret1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx does not exist
```

### **Backup Validator Key**

Before \*\*\*\* creating your validator, [backup your validator key.](../../maintaining-a-node-validator/validator-backup.md)

{% hint style="danger" %}
WARNING: if you don't backup your key and your node goes down, you will lose your validator and have to start a new one.
{% endhint %}

### **Create Validator**

{% hint style="info" %}
Remember 1 SCRT = 1,000,000 uSCRT, and so the command below stakes 100 SCRT
{% endhint %}

```bash
secretd tx staking create-validator \
  --amount=100000000uscrt \
  --pubkey=$(secretd tendermint show-validator) \
  --identity={KEYBASE_IDENTITY} \
  --details="To infinity and beyond!" \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --moniker=<MONIKER> \
  --from=<key-alias>
```

### **Confirm Validator is Created**

You should see your moniker listed.

```bash
secretd q staking validators | grep moniker
```

## Important CLI Commands for Validators <a href="#dangers-in-running-a-validator" id="dangers-in-running-a-validator"></a>

### Staking More Tokens <a href="#staking-more-tokens" id="staking-more-tokens"></a>

(remember 1 SCRT = 1,000,000 uSCRT)

In order to stake more tokens beyond those in the initial transaction, run:

```
secretd tx staking delegate $(secretcli keys show <key-alias> --bech=val -a) <amount>uscrt --from <key-alias>
```

### Editing Your Validator <a href="#editing-your-validator" id="editing-your-validator"></a>

```
secretd tx staking edit-validator \
  --moniker "<new-moniker>" \
  --website "https://scrt.network" \
  --identity 6A0D65E29A4CBC8E \
  --details "To infinity and beyond!" \
  --chain-id <chain_id> \
  --from <key_name> \
  --commission-rate "0.10"
```

### Seeing Your Rewards From Being A Validator <a href="#seeing-your-rewards-from-being-a-validator" id="seeing-your-rewards-from-being-a-validator"></a>

```
secretd q distribution rewards $(secretcli keys show -a <key-alias>)
```

### Seeing Your Commissions From Your Delegators <a href="#seeing-your-commissions-from-your-delegators" id="seeing-your-commissions-from-your-delegators"></a>

```
secretd q distribution commission $(secretcli keys show -a <key-alias> --bech=val)
```

### Withdrawing Rewards <a href="#withdrawing-rewards" id="withdrawing-rewards"></a>

```
secretd tx distribution withdraw-rewards $(secretcli keys show --bech=val -a <key-alias>) --from <key-alias>
```

### Withdrawing Rewards+Commissions <a href="#withdrawing-rewards-commissions" id="withdrawing-rewards-commissions"></a>

```
secretd tx distribution withdraw-rewards $(secretcli keys show --bech=val -a <key-alias>) --from <key-alias> --commission
```

### Removing Your Validator <a href="#removing-your-validator" id="removing-your-validator"></a>

Currently deleting a validator is not possible. If you redelegate or unbond your self-delegations then your validator will become offline and all your delegators will start to unbond.

### Changing Your Validator's Commission-Rate <a href="#changing-your-validator-s-commission-rate" id="changing-your-validator-s-commission-rate"></a>

You are currently unable to modify the `--commission-max-rate` and `--commission-max-change-rate"` parameters.

Modifying the commision-rate can be done using this:

```
secretd tx staking edit-validator --commission-rate="0.05" --from <key-alias>
```

## Slashing <a href="#slashing" id="slashing"></a>

### **Unjailing**

To unjail your jailed validator

```
secretd tx slashing unjail --from <key-alias>
```

## **Signing Info**

To retrieve a validator's signing info:

```
secretd q slashing signing-info <validator-conspub-key>
```

## **Query Parameters**

You can get the current slashing parameters via:

```
secretd q slashing params
```
