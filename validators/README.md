---
description: Overview
---

# Validators

Secret Network is secured by a coordinated group of validators (current maximum: 80) using a Byzantine fault tolerant delegated proof-of-stake consensus engine, [Tendermint](https://tendermint.com/). These validators stake their own SCRT coins and coins from delegators in order to earn rewards by successfully running the protocol, verifying transactions, and proposing blocks to the chain. If they fail to maintain a consistent and honest node, they will be slashed and coins will be deducted from their account.&#x20;



TODO: What are the slashing rules

TODO: What are the jailing rules

It is possible for anyone who holds SCRT to become a Secret Network validator or delegator, and thus participate in both staking and governance processes. For information on running a node, delegating, staking, and voting, please see the walkthrough below and visit our [governance documentation](https://docs.scrt.network/protocol/governance.html). Here is a list of [SGX compatible hardware](https://github.com/ayeks/SGX-hardware) that could be considered for running a validator.

### Walkthrough <a href="#walkthrough" id="walkthrough"></a>

1. [Install SGX](https://docs.scrt.network/node-guides/setup-sgx.html)
2. [Run a full node](https://docs.scrt.network/node-guides/run-full-node-mainnet.html) or [in Docker](https://docs.scrt.network/node-guides/full-node-docker.html)
3. [Be a validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html)
