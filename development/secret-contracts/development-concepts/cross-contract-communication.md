---
description: >-
  Step-by-step guide on how to execute Secret Network smart contracts that
  communicate with each other
---

# Cross Contract Communication

## Introduction

[In previous sections](https://docs.scrt.network/secret-network-documentation/development/getting-started/compile-and-deploy), we explored the creation of isolated smart contracts within the Secret Network ecosystem. To construct more intricate systems using smart contracts, it is essential to establish effective communication between them. This documentation will delve into the practical implementation of secure and efficient communication between secret contracts, allowing you to build powerful, interconnected applications on Secret Network.

### Our Multi Contract System &#x20;

In this tutorial, we will be designing a simple smart contract that can execute a counter smart contract that is already deployed to the Secret Testnet. Thus, we are working with two smart contracts:

1. Manager Contract - which executes the Counter Contract
2. Counter Contract - which is executed by the Manager Contract&#x20;

By the end of this tutorial, you will understand how to implement the `Increment()` function on a Manager smart contract, which increments a counter smart contract by one every time the Increment function is called.&#x20;

To follow along with this tutorial step-by-step, clone down the [Secret Network counter template repo here](https://github.com/scrtlabs/secret-template) 😊

### Designing the Manager Contract

We will be designing a Manager Smart Contract which can execute a Counter Contract that is deployed to the Secret testnet.  Let's start by creating the message that we want to execute on the counter smart contract. In the src directory (which currently contains `contract.rs`, `lib.rs`, `msg.rs` and `state.rs`), create a `counter.rs` file and add the following:

<pre><code><strong>use schemars::JsonSchema;
</strong>use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum CounterExecuteMsg {
    Increment {},
}
</code></pre>

`CounterExecuteMsg` contains a single function `Increment{}.` This is the function we will call to increment the counter contract once we have completed designing our Manager smart contract.&#x20;

### Msg.rs

Now, navigate to the `msg.rs` file. Replace the existing code with the folllowing:&#x20;

```
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Increment { contract: String, code_hash: String },
}
```

Here we have an empty `InstantiateMsg`, as well as an enum `ExecuteMsg`, with a single variant, `Increment`, which contains two strings `contract` and `code_hash.` This is the contract address and code hash of the counter contract, which we will be calling from the Manager contract.&#x20;

{% hint style="info" %}
**What is the code hash?**

Unlike other Cosmos chains, Secret Network requires the hash of the smart contract in addition to the address when executing calls to smart contracts. For a user, the interaction with the code hash is transparent, but it is something that is important when writing Secret Contracts and dApps, since we need to include this code hash when we call another contract.

Contract hashes are what binds a transaction to the specific contract code being called. Otherwise, it would be possible to perform a replay attack in a forked chain with a modified contract that decrypts and prints the input message.
{% endhint %}

### How to Get a Contract Hash

### SecretCLI

One way to manually get the hash of a contract is with SecretCLI. Simply use the following command:

```
secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek
```

### REST

Another way is via the REST API.

```
curl http://api.scrt.network/wasm/contract/secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek/code-hash
```

### SecretJS

Lastly, if you are developing using SecretJS (or any other sdk) you can programmatically fetch the contract hash using the code-id (the identifier of the code you [_stored_](../../getting-started/compile-and-deploy.md#storing-the-contract)_)_

```
const contractCodeHash = await secretjs.query.compute.codeHash(codeId);
```

_This documentation is currently in progress. Check back for updates._&#x20;



