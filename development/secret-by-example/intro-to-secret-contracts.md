---
description: An overview of the design pattern of Secret smart contracts
---

# Intro To Secret Contracts

## Secret Contracts Introduction

Secret Contracts are the first implementation of general purpose privacy-preserving computations on a public blockchain. While similar to Ethereum smart contracts in design, Secret Contracts work with encrypted data (inputs, encrypted outputs, and encrypted state). Privacy guarantees are made possible through a decentralized network of validators executing Secret Contracts inside Trusted Execution Environments (TEEs).

Secret Contracts are made with Rust and compile to WebAssembly. They are based on Go-CosmWasm, and introduce the _compute_ module running inside TEEs to enable secure data processing (inputs, outputs, and contract state).

{% embed url="https://user-images.githubusercontent.com/15679491/99459758-9a44c580-28fc-11eb-9af2-82479bbb2d23.png" %}
Secret Network Architecture
{% endembed %}

### Secret Contracts 101

In the [Getting Started](https://docs.scrt.network/secret-network-documentation/development/getting-started) section of the documentation, we learned how to configure our developer environment and execute the Secret Network counter smart contract. Now we are going to examine the files that make up [the Secret Network counter smart contract](https://github.com/scrtlabs/secret-template) to better understand **CosmWasm smart contract design patterns.** &#x20;

#### Project Structure

The git project above is a Secret Contract template that implements a simple counter. The contract is created with a parameter for the initial count and allows subsequent incrementing by any wallet address, but the count can only be reset by the wallet address that instantiated the contract.&#x20;

The `src` folder contains the following files which make up the smart contract's structure:

```
contract.rs  lib.rs  msg.rs  state.rs
```

### contract.rs

`contract.rs` is the home of the smart contract's logic and defines what the contract actually does.  It contains **3 entry points** we are able to interact with:

* `instantiate()` - receives the `InstantiateMsg` and saves the initial value of the counter to the contract state. The instantiation of a CosmWasm smart contract is performed by **the contract owner**.
* `execute()` - handles transactions which mutate or change the state of the contract. In our case, the `Increment` and `Reset` messages are handled here to update the counter's value.
* `query()` - handles messages which do **not** change the state of the contract. To get the counter's value, we'll utilize the `QueryCount` message.

#### Instantiate

The `instantiate()` entry point is called **only once** at the instantiation of the Secret Contract and initializes the internal state of the Secret Contract, as shown below:

```
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {

    let state = State {
        count: msg.count,
        owner: info.sender.clone(),
    };

    config(deps.storage).save(&state)?;

    deps.api.debug(&format!("Contract was initialized by {}", info.sender));

    Ok(Response::default())
}
```

The instantiate() function takes the following parameters:`deps` ,`env`, `info`, and `msg.`

* `deps` is [imported from `cosmwasm_std`](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L1) and contains all external dependencies of the contract:

```rust
pub struct DepsMut<'a, C: CustomQuery = Empty> {
    pub storage: &'a mut dyn Storage,
    pub api: &'a dyn Api,
    pub querier: QuerierWrapper<'a, C>,
}
```

* `env` is also [imported from `cosmwasm_std`](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L1) and contains external state information of the contract:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Env {
    pub block: BlockInfo,
    /// Information on the transaction this message was executed in.
    pub transaction: Option<TransactionInfo>,
    pub contract: ContractInfo,
}
```

* `info` is the `MessageInfo` (imported from `cosmwasm_std)`which you can think of as **the address that initiated the action (i.e. the message).**

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct MessageInfo {
    pub sender: Addr,
    /// The funds that are sent to the contract as part of `MsgInstantiateContract`
    /// or `MsgExecuteContract`. The transfer is processed in bank before the contract
    /// is executed such that the new balance is visible during contract execution.
    pub funds: Vec<Coin>,
}
```

* Lastly, `msg` is the `InstantiateMsg` struct imported from `msg.rs`. In this case, it defines the initial state of the counter:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub count: i32,
}
```

### state.rs

The `state.rs` file defines the State struct, used for storing the contract's data.&#x20;

```
pub struct State {
    pub count: i32,
    pub owner: CanonicalAddr,
}
```

The state is saved in a [`Storage`](https://docs.rs/cosmwasm-std/latest/cosmwasm\_std/trait.Storage.html) struct.

This `Storage` struct is wrapped in a `Singleton` and `ReadonlySingleton`. To learn more about the different types of storage, read the documentation for [cosmwasm\_storage](https://docs.rs/cosmwasm-storage/latest/cosmwasm\_storage/index.html).

<pre><code><strong>pub fn config(storage: &#x26;mut dyn Storage) -> Singleton&#x3C;State> {
</strong>    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &#x26;dyn Storage) -> ReadonlySingleton&#x3C;State> {
    singleton_read(storage, CONFIG_KEY)
}
</code></pre>

In this example, the state contains an integer `count` and the `owner` of the contract. `owner` is an instance of the `CanonicalAddr` struct. `Storage` and `CanonicalAddr` are imported from [cosmwasm\_std](https://docs.rs/cosmwasm-std/latest/cosmwasm\_std/).

### msg.rs

Contract computations are defined as messages. The [JsonSchema](https://docs.rs/schemars/0.8.0/schemars/trait.JsonSchema.html) for these messages is defined in `msg.rs`.

The `InstantiateMsg` struct describes the `msg` parameter passed to the contract `instantiate` function in `contract.rs`.

`ExecuteMsg` and `QueryMsg` are enums representing possible transaction or query computations. These enums are used to describe the `msg` parameter for execute and `query` functions in `contract.rs`.

```
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
}

pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    GetCount {},
}
```

Calls to execute and `query` can optionally provide a response. These response messages are defined as structs. In this example, the `query_count` function in `contract.rs` returns the `CountResponse` struct.

```
pub struct CountResponse {
    pub count: i32,
}
```

### lib.rs

This file is essentially boilerplate you **shouldn't need to modify**. It provides the necessary abstraction to interact with the wasm VM and compile the contract to wasm.

#### Unit Tests

Unit tests are coded in the `contract.rs` file itself:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm::errors::Error;
    use cosmwasm::mock::{dependencies, mock_env};
    use cosmwasm::serde::from_slice;
    use cosmwasm::types::coin;

    #[test]
    fn proper_initialization() {
        let mut deps = dependencies(20);

        let msg = InitMsg { count: 17 };
        let env = mock_env(&deps.api, "creator", &coin("1000", "earth"), &[]);

        // we can just call .unwrap() to assert this was a success
        let res = init(&mut deps, env, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(&deps, QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_slice(&res).unwrap();
        assert_eq!(17, value.count);
    }
```

### Secret Contracts - Advanced

**Calling Other Contracts**&#x20;

[Secret Toolkit](https://github.com/scrtlabs/secret-toolkit) contains helpful tools for calling other contracts from your own. [Here](https://github.com/baedrik/SCRT-sealed-bid-auction/blob/master/CALLING\_OTHER\_CONTRACTS.md) is a guide on how to call other contracts from your own using the `InitCallback`, `HandleCallback`, and `Query` traits defined in the [utils package](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/utils).

#### SNIP-20s

If you are specifically wanting to call Handle functions or Queries of [SNIP-20 token contracts](https://github.com/scrtlabs/snip20-reference-impl), there are individually named functions you can use to make it even simpler than using the generic traits. These are located in the [SNIP-20 package](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/snip20).

#### Additional Resources

Use [this link](https://github.com/baedrik/SCRT-sealed-bid-auction) for a sealed-bid (secret) auction contract making use of [SNIP-20](https://github.com/scrtlabs/snip20-reference-impl) and a walkthrough of the contract.

