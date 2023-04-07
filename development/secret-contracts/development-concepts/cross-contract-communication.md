---
description: >-
  Step-by-step guide on how to execute Secret Network smart contracts that
  communicate with each other
---

# Cross Contract Communication

## Introduction

[In previous sections](https://docs.scrt.network/secret-network-documentation/development/getting-started/compile-and-deploy), we explored the creation of isolated smart contracts within the Secret Network ecosystem. To construct more intricate systems using smart contracts, it is essential to establish effective communication between them. This documentation will delve into the implementation of secure and efficient communication between secret contracts, allowing you to build powerful, interconnected applications on Secret Network.

### Our Multi Contract System &#x20;

In this tutorial, [we will be designing a simple smart contract](https://github.com/writersblockchain/secret-intercontract-messages) that can execute a counter smart contract that is already deployed to the Secret Testnet. Thus, we are working with two smart contracts:

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

Now, navigate to the `msg.rs` file. Replace the existing code with the following:&#x20;

```
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    IncrementCounter { contract: String, code_hash: String },
}
```

Here we have an empty `InstantiateMsg`, as well as an enum `ExecuteMsg`, with a single variant, `IncrementCounter`, which contains two strings: `contract` and `code_hash.` This is the contract address and code hash of the counter contract, which we will be calling from the Manager contract.&#x20;

{% hint style="info" %}
**What is the code hash?**

Unlike other Cosmos chains, Secret Network requires the hash of the smart contract in addition to the address when executing calls to smart contracts.

Contract hashes are what binds a transaction to the specific contract code being called. Otherwise, it would be possible to perform a replay attack in a forked chain with a modified contract that decrypts and prints the input message.&#x20;
{% endhint %}

### Contract.rs

Now, navigate to the `contract.rs` file. Replace the **execute entry point** with the following:

```
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::IncrementCounter {
            contract,
            code_hash,
        } => try_increment(deps, env, contract, code_hash),
    }
}
```

When the `IncrementCounter` variant is matched, the function calls the `try_increment` function,  which contains two fields, `contract` and `code_hash`. The `contract` field is the address of the contract to be incremented, and the `code_hash` field is the code hash of the contract. This function contains the logic for incrementing the counter in our counter contract.&#x20;

Remember the counter.rs file that we created earlier with the `CounterExecuteMsg` enum containing `Increment{}` ? 🤔 Now, in the `try_increment()` function, we are going to use a **WasmMsg** to call `Increment{}` in order to increment the counter contract.&#x20;

{% hint style="info" %}
```
A WasmMsg dispatches a call to another contract 
at a known address (with known ABI).
```
{% endhint %}

### Creating the WasmMsg

In CosmWasm, a `WasmMsg` is an enum used to perform actions such as instantiating a new contract, executing a function on an existing contract, or sending tokens to a contract. Here are the main variants of `WasmMsg`:

1. `Instantiate`: This variant is used to create a new instance of a Wasm smart contract. It contains the following fields:
   * `code_id`: The ID of the Wasm code to instantiate.
   * `msg`: The message to initialize the contract (usually a JSON object).
   * `funds`: The amount of tokens to send to the contract upon instantiation.
   * `label`: A human-readable label for the new contract instance.
   * `admin`: An optional address that, if provided, will have administrative privileges over the contract instance (e.g., for migration or update purposes).
2. `Execute`: This variant is used to execute a function on an existing Wasm smart contract (and is the variant that we are calling in our contract) It contains the following fields:
   * `contract_addr`: The address of the contract to execute the function on.
   * `msg`: The message to be processed by the contract (usually a JSON object).
   * `funds`: The amount of tokens to send to the contract along with the execution message.
3. `Migrate`: This variant is used to migrate an existing Wasm smart contract to a new code version. It contains the following fields:
   * `contract_addr`: The address of the contract to migrate.
   * `new_code_id`: The ID of the new Wasm code to migrate the contract to.
   * `msg`: The message to initialize the new code version (usually a JSON object).

In the counter.rs file, comment out or delete the existing execute functions and add the following:

```
pub fn try_increment(
    _deps: DepsMut,
    _env: Env,
    contract: String,
    code_hash: String,
) -> StdResult<Response> {
    let exec_msg = CounterExecuteMsg::Increment {};

    let cosmos_msg = WasmMsg::Execute {
        contract_addr: contract,
        code_hash: code_hash,
        msg: to_binary(&exec_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_attribute("action", "increment"))
}
```

The `try_increment` function creates a `WasmMsg::Execute` message to increment the counter in the specified smart contract and returns a `Response` object containing the message and an attribute. When the `Response` object is returned by the smart contract's `execute` function, the blockchain will execute the `WasmMsg::Execute` message, effectively incrementing the counter in the target contract.

Here's a breakdown of the code inside the function:

1. `let exec_msg = CounterExecuteMsg::Increment {};`: This line creates a new `CounterExecuteMsg` enum instance with the `Increment` variant, which represents a message to increment the counter.
2. `let cosmos_msg = WasmMsg::Execute { ... };`: This block creates a `WasmMsg` enum instance with the `Execute` variant. The `Execute` variant is used to execute our Counter smart contract. The `contract_addr` field is set to the `contract` parameter, the `code_hash` field is set to the `code_hash` parameter, the `msg` field is set to the binary representation of `exec_msg`, and the `funds` field is set to an empty vector, indicating no funds are sent with this message.
3. `Ok(Response::new() ... )`: This block constructs a new `Response` object with the following:
   * `.add_message(cosmos_msg)`: The `cosmos_msg` (a `WasmMsg::Execute` instance) is added to the response as a message to be executed after the current contract execution finishes.
   * `.add_attribute("action", "increment")`: An attribute with key "action" and value "increment" is added to the response. Attributes are used to store additional information about the operation and can be useful for indexing and querying transactions.

### Executing the contract with Secret.js

You can view the [completed code repo here](https://github.com/writersblockchain/secret-intercontract-messages/blob/master/manager/node/index.js) which contains the upload, instantiation, and execution functions using secret.js.&#x20;

Let's focus on how to write the increment function as seen below:

```
let increase_count = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        increment_counter: {
          contract: "secret1edd6prk0w55c27dkcxzuau8mvlwa2rghgwelqk",
          code_hash:
            "cf6c359e936ded4e18716aafdef4d880cc42e4d87c29ca88205ff38c1ddf6531",
        },
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};

increase_count();

```

The secret.js function `increase_count`sends an `increment_counter` message (which is the message we defined in `msg.rs`) to our Counter smart contract. This message increments the counter contract via the WasmMsg that we defined in the `increase_count` function.&#x20;

You can call this function by commenting out the other functions in index.js and running `node index.js` in the terminal (make sure you are in the `secret-messages/manager/node` directory).&#x20;

Now, in your terminal, navigate to the `secret/counter/node` directory. Call the `query_count` function to see the current count of the counter contract. After using the manager contract to increment, it should now be incremented by one!

### **Conclusion**&#x20;

Congratulations, you have now created a Manager smart contract that interacts with a Counter smart contract on Secret Network! By designing a Multi-Contract System, you can enable secure and efficient communication between secret contracts, allowing for more intricate and interconnected decentralized applications.

