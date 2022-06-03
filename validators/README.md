---
description: Overview
---

# Validators

Secret Network is secured by a coordinated group of validators (current maximum: 80) using [Tendermint](https://tendermint.com/), a Byzantine fault tolerant Delegated Proof-of-Stake (DPoS) consensus engine.  Each validator stakes their own SCRT coins, and coins from delegators, in order to earn rewards by successfully running the protocol, verifying transactions, and proposing blocks. If they fail to maintain a consistent (downtime) and honest node (double-signing), they will be slashed resulting in coins being deducted from their account.&#x20;

## **Slashing For Downtime**

Slashing for downtime is based on real block times and NOT theoretical block times, such as `SignedBlocksWindow` and `MinSignedPerWindow` network parameters. Validators signing less than `MinSignedPerWindow` blocks out of every `SignedBlocksWindow` will experience a downtime slash.&#x20;

### Slashing Conditions For Downtime

Parameters: 11250 blocks out of every 22500-blocks

* For a block time of 6.8 seconds, this roughly translates to being up for less then 21.25 hours out of every 42.5-hour window.
* For a block time of 6.4 seconds, this roughly translates to being up for less then 20 hours out of every 40-hour window.

### Penalties For Downtime

* Slashing of 0.01% of the validator and its delegators' staked SCRT
* Jailing for 10 minutes of your validator node. You don't earn block rewards for this period and at the end must manually unjail your node with:

```
secretcli tx slashing unjail --from <key-alias>
```

## **Slashing For Double-Signing**

It is possible all SCRT holders to become a Secret Network validator or delegator, and participate in staking and governance processes.&#x20;

_For information on running a node, delegating, staking, and voting, please see the validator guide below and visit our_ [_governance documentation_](https://docs.scrt.network/protocol/governance.html)_. Here is a list of_ [_SGX compatible hardware_](https://github.com/ayeks/SGX-hardware) _that could be considered for running a validator._

### Conditions **F**or Double-Signing

* A validator signs the same block height twice

### Penalties For Double-Signing

* Slashing of 5% of the validator and its delegators' staked SCRT
* Jailing forever (tombstoned) of your validator node
  * A tombstoned validator cannot earn block rewards anymore, and its delegators must re-delegate their SCRT to another validator

## What Happens With Slashed SCRT&#x20;

The Secret Network uses the [same slashing penalties as Cosmos](https://docs.cosmos.network/master/modules/slashing/), meaning slashed SCRT is burned. Burning SCRT through slashing validators for downtime and/or double-signing is done to discourage poor practices and dishonesty by protocol-recognised actors. If slashing occurs frequently, a validator may lose their ability to vote on future blocks for a period of time.&#x20;

## Validator Guide <a href="#walkthrough" id="walkthrough"></a>

For detailed information on how to setup and run a validator, see the [Validator Set Up](set-up/) section of these docs.&#x20;
