---
description: An explainer of the Execute file inside of the CosmWasm code framework
---

# Execution Message

**Execution Messages** are contract messages that trigger the execution of a smart contract and perform specific operations, such as updating the contract state or transferring tokens. If you’re familiar with RPC or AJAX, you can think of execution messages as the code that runs when a remote procedure is called. On Secret Network, execution messages are usually designed to be functions that run as quickly as possible and exit as early as possible when any errors are encountered, as this will help save gas. You can learn more about contract optimization [here](storage/contract-optimization.md).

The standard practice on Secret Network is to have an `enum` with all the valid message types and reject all messages that don’t follow the usage pattern dictated in that enum; this enum is conventionally called `ExecuteMsg` and is usually in a file called `msg.rs`

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
}
```

As mentioned earlier, the standard way to choose what the contract should execute is to look at which `ExecuteMsg` is passed to the function. Let’s look at an example.

```rust
#[entry_point]
pub fn execute(
    deps: &DepsMut,
    env: Env,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Increment {} => try_increment(deps, env),
        ExecuteMsg::Reset { count } => try_reset(deps, env, count),
    }
}
```

In this simple example, the code looks at the message passed, if the passage is the `Increment` message, it calls the function `try_increment`, otherwise, if the message is the `Reset` message, it calls the function `try_reset` with the count.

{% hint style="info" %}
Remember, Rust has implicit returns for lines that don’t end in a semicolon, so the result of the two functions above is returned as the result of the execution message.
{% endhint %}

You may have noticed that the execution message takes two arguments in addition to the msg: `deps` and `env`. Let’s look at those more closely.

## env

As the name perhaps implies, `env` contains all the information about the environment the contract is running in, but what does that mean exactly? On Secret Network the properties available in the Env struct are as follows:

* block: this contains all the information about the current block. This is the block height (`height`), the current time as a unix timestamp (`time`) and the chain id (`chain_id`) such as secret-4 or pulsar-3.
* message: contains information that was sent as part of the payload for the execution. This is the sender, or the wallet address of the person that called the handle function and sent\_funds which contains a vector of native funds sent by the caller (SNIP-20s are not included).
* contract: contains a property with the contract’s address.
* contract\_code\_hash: this is a String containing the code hash of the current contract, it’s useful when registering with other contracts such as SNIP20s or SNIP721s or when working on a factory contract.

Now that you have an overview on what all those properties are, let’s take a look at a simple Execution Message.

### Example ExecutionMsg

```rust
pub fn try_increment(deps: DepsMut, _env: Env) -> StdResult<Response> {
    config(deps.storage).update(|mut state| -> Result<_, StdError> {
        state.count += 1;
        Ok(state)
    })?;

    deps.api.debug("count incremented successfully");
    Ok(Response::default())
}
```

The execution message above reads the state from the storage(`Deps`) and increments the count property by one, then prints out the new count, if successful.&#x20;

As mentioned previously, developers don’t really like working with raw binary data, so many resort to using more human friendly ways; you can find out more on the page about storage, [here](storage/). But for the sake of this example, let’s look at what that `config` function is doing.

The developers of this contract opted for using **storage singletons**. A storage singleton can be thought as a prefixed typed storage solution with simple-to-use methods. This allows the developer to define a structure for the data that needs to be stored and handles encoding end decoding it, so the developer doesn’t have to think about it. This is how it’s implemented in this contract:

```rust
use cosmwasm_storage::{singleton, singleton_read, ReadonlySingleton, Singleton};

pub static CONFIG_KEY: &[u8] = b"config";

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct State {
    pub count: i32,
    pub owner: Addr,
}

pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}
```

The `config` function returns a singleton over the config key using the `State` struct as its type, this means that when reading and writing data from the storage, the singleton automatically serializes or deserializes the State struct.&#x20;

## Response

You may have noticed that the return type for a handle message is `Response`. Let's take a look at how `Response` is defined:

```rust
pub struct Response<T = Empty> {
    /// Optional list of messages to pass. These will be executed in order.
    /// If the ReplyOn variant matches the result (Always, Success on Ok, Error on Err),
    /// the runtime will invoke this contract's `reply` entry point
    /// after execution. Otherwise, they act like "fire and forget".
    /// Use `SubMsg::new` to create messages with the older "fire and forget" semantics.
    pub messages: Vec<SubMsg<T>>,
    /// The attributes that will be emitted as part of a "wasm" event.
    ///
    /// More info about events (and their attributes) can be found in [*Cosmos SDK* docs].
    ///
    /// [*Cosmos SDK* docs]: https://docs.cosmos.network/main/core/events.html
    pub attributes: Vec<Attribute>,
    /// Extra, custom events separate from the main `wasm` one. These will have
    /// `wasm-` prepended to the type.
    ///
    /// More info about events can be found in [*Cosmos SDK* docs].
    ///
    /// [*Cosmos SDK* docs]: https://docs.cosmos.network/main/core/events.html
    pub events: Vec<Event>,
    /// The binary payload to include in the response.
    pub data: Option<Binary>,
}
```

In CosmWasm, the `Ok` result and the `Response` object are essential parts of handling contract execution and signaling the outcome to the blockchain. Here's a breakdown of how these work:

#### `Ok` Result in CosmWasm

In Rust (and by extension, CosmWasm), functions that interact with the blockchain often return a `Result` type. This is a way to express whether the function was successful or if it encountered an error.

* **`Result<T, E>`**: A `Result` can either be:
  * **`Ok(T)`**: Signifying the function executed successfully and returns a value of type `T`.
  * **`Err(E)`**: Signifying that an error of type `E` occurred.

In the context of CosmWasm, the `Ok` result generally signifies that a contract's execution completed successfully, returning a `Response` object.

For example:

```rust
Ok(Response::default())
```

This line means that the contract execution was successful, and it returns a default `Response`. In CosmWasm, we use `StdResult<Response>` for contract execution functions.
