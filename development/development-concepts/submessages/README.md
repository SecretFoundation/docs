---
description: Learn how to use submessages on Secret Network
---

# Submessages

## Introduction

In the CosmWasm SDK, **submessages** are a powerful feature that allows a contract to execute additional messages within the context of its own execution. `SubMsg` just wraps the `CosmosMsg`, adding some info to it: the `id` field, and `reply_on`. `reply_on`  describes if the `reply` message should be sent on processing success, on failure, or both. To create submessages, instead of setting all the fields separately, you would typically use helper constructors: `SubMsg::reply_on_success`, `SubMsg::reply_on_error` and `SubMsg::reply_always`.

{% hint style="info" %}
You can learn more about submessages [here](https://github.com/CosmWasm/cosmwasm/blob/main/SEMANTICS.md#submessages)!
{% endhint %}

In this tutorial, **you will learn** **how to use submessages to execute a counter smart contract on Secret Network from another Secret Network smart contract** 😊

### Getting Started

1. [Fund your Secret testnet wallet](https://faucet.pulsar.scrttestnet.com/)
2. `git clone` the [submessages example repository](https://github.com/writersblockchain/secret-submessages/tree/master):&#x20;

```
git clone https://github.com/writersblockchain/secret-submessages
```

### Our Multi Contract System &#x20;

In this tutorial, we will use submessages to execute a [counter smart contract](https://github.com/writersblockchain/secret-submessages/tree/master/counter) that is already deployed to the Secret Network Testnet. Thus, we are working with two smart contracts:

1. [Manager Contract](https://github.com/writersblockchain/secret-submessages/tree/master/manager) - which executes the Counter Contract using submessages
2. [Counter Contract](https://github.com/writersblockchain/secret-submessages/tree/master/counter) - which is executed by the Manager Contract&#x20;

{% hint style="info" %}
This tutorial follows the same design patterns of the [Cross Contract Communication](https://docs.scrt.network/secret-network-documentation/development/development-concepts/cross-contract-communication) tutorial, but uses submessages in place of Wasm messages
{% endhint %}

### Designing the Manager Contract

We will be designing a Manager Smart Contract which can execute a Counter Contract that is deployed to the Secret testnet. Let's start by examining the message that we want to execute on the counter smart contract. In the `src` directory, open [msg.rs ](https://github.com/writersblockchain/secret-submessages/blob/master/manager/src/msg.rs)and review the `Increment` msg:&#x20;

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Increment { contract: String },
}
```

`Increment` contains one parameter, the string `contract.` This is the contract address of the counter contract, which we will increment.&#x20;

{% hint style="info" %}
**Where is the code hash?**

Unlike other Cosmos chains, Secret Network requires the hash of the smart contract in addition to the address when executing calls to smart contracts.

Contract hashes are what binds a transaction to the specific contract code being called. Otherwise, it would be possible to perform a replay attack in a forked chain with a modified contract that decrypts and prints the input message.&#x20;

However, there is no need to pass a `code_hash` when doing cross contract or sub message calls because we have designed the helper function[`get_contract_code_hash`](https://github.com/writersblockchain/secret-submessages/blob/dcd776020e94f5128128a8756ade572f717b9754/manager/src/contract.rs#L71) which we call internally when executing the `Increment` function.&#x20;
{% endhint %}

Notice that we implement [HandleCallBack](https://github.com/writersblockchain/secret-submessages/blob/dcd776020e94f5128128a8756ade572f717b9754/manager/src/msg.rs#L20) for our `ExecuteMsg` enum, which is what allows our submessages to be converted into a `CosmosMsg` and executed:

```rust
use secret_toolkit::utils::HandleCallback;

impl HandleCallback for ExecuteMsg {
    const BLOCK_SIZE: usize = BLOCK_SIZE;
}
```

### Reply entry point

Submessages offer different options for the other contract to provide a reply. There are four reply options you can choose:

```rust
pub enum ReplyOn {
    /// Always perform a callback after SubMsg is processed
    Always,
    /// Only callback if SubMsg returned an error, no callback on success case
    Error,
    /// Only callback if SubMsg was successful, no callback on error case
    Success,
    /// Never make a callback - this is like the original CosmosMsg semantics
    Never,
}
```

In order to handle the reply from the other contract, the calling contract must implement a new entry point, called [`reply`](https://github.com/writersblockchain/secret-submessages/blob/dcd776020e94f5128128a8756ade572f717b9754/manager/src/contract.rs#L34):

```rust
#[entry_point]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    match msg.id {
        EXECUTE_INCREMENT_REPLY_ID => handle_increment_reply(deps, msg),
        id => Err(ContractError::UnexpectedReplyId { id }),
    }
}
```

Here is an example of how to handle the reply:

```rust
fn handle_increment_reply(_deps: DepsMut, msg: Reply) -> Result<Response, ContractError> {
    match msg.result {
        SubMsgResult::Ok(_) => Ok(Response::new().add_attribute("action", "increment")),

        SubMsgResult::Err(e) => Err(ContractError::CustomError { val: e }),
    }
}
```

The submessage returns a `Result` containing:&#x20;

* `Ok(Response)` if the submessage executed successfully, with an action attribute set to "increment".&#x20;
* `Err(ContractError)` if the submessage execution failed, with the error encapsulated in a custom contract error.

### Executing the Manager contract

Now let's use this manager smart contract to increment a counter smart contract with submessages!

The counter contract we will be executing is deployed here:&#x20;

```javascript
const contractAddress = "secret1cldglt6wvueva2akly4x3wvzzlevk2hxzv0cvq";
```

{% hint style="info" %}
Or deploy your own counter contract [here](https://github.com/writersblockchain/secret-submessages/blob/master/counter/node/index.js) :)&#x20;
{% endhint %}

`cd` into `manager/node:`

```
cd manager/node
```

Install the dependencies:&#x20;

```
npm i 
```

Run node [execute](https://github.com/writersblockchain/secret-submessages/blob/master/manager/node/execute.js) to execute the counter contract:

```
node execute 
```

Upon successful execution, you will see a `tx` returned in your terminal:&#x20;

```bash
{
  height: 5867847,
  timestamp: '',
  transactionHash: '046C97A2E2404FBF2AB75AFA0850BCD3CC7693BE270FA9DB86D2CE85EEDA5094',
  code: 0,
  codespace: '',
  info: '',
  tx: {
    '@type': '/cosmos.tx.v1beta1.Tx',
    body: {
      messages: [Array],
      memo: '',
      timeout_height: '0',
      extension_options: [],
      non_critical_extension_options: []
    }
```

### Querying the counter contract

Now, let's query the counter contract to make sure it was executed correctly!

`cd` into `counter/node:`

```
cd counter/node
```

Install the dependencies:&#x20;

```
npm i 
```

And run `node query`:&#x20;

```
node query 
```

You will see that the counter contract has been incremented by 1 :)

```bash
{ count: 1 }
```

### Summary

In this tutorial, you learned how to utilize submessages in the CosmWasm SDK to perform complex, atomic operations within smart contracts on the Secret Network. This guide walked you through executing a counter smart contract from another contract, detailing the setup of a Manager Contract that triggered the Counter Contract using submessages, managing replies, and verifying the execution results 🤓
