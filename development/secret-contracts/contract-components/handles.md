# Execute

On Secret Network there are two primary ways to interact with a smart contract; executes and queries. In this page you will learn about executes, you can find out more about queries [here](queries.md).

Executes are functions that are called based on messages send to the contract. If you’re familiar with RPC or you’re familiar with AJAX you can think of executes as the code that runs when a remote procedure is called. On Secret Network, executes are usually designed to be functions that run as quickly as possible and exit as early as possible when any errors are encountered, as this will help save gas. You can find out more about that on the section on contract optimization, [here](../best-practices/contract-optimization.md).&#x20;

The standard practice on Secret Network is to have an `enum` with all the valid message types and reject all messages that don’t follow the usage pattern dictated in that enum; this enum is conventionally called `ExecuteMsg` and is usually in a file called `msg.rs`

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Increment {},
    Reset { count: i32 },
}
```

As mentioned earlier the standard way to choose what the contracts should execute is to look at which `ExecuteMsg` is passed to the function. Let’s look at an example.

```rust
#[entry_point]
pub fn execute(
    deps: &DepsMut,
    env: Env,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        HandleMsg::Increment {} => try_increment(deps, env),
        HandleMsg::Reset { count } => try_reset(deps, env, count),
    }
}
```

In this simple example, the code looks at the message passed, if the passage is the `Increment` message, it calls the function `try_increment`, otherwise, if the message is the `Reset` message, it calls the function `try_reset` with the count.

{% hint style="info" %}
Remember, Rust has implicit returns for lines that don’t end in a semicolon, so the result of the two functions above is returned as the result of the handle function.
{% endhint %}

You may have noticed that the handle method takes two arguments in addition to the msg, `deps` and `env`. Let’s look at those more closely.

## ``

## `env`

As the name perhaps implies,`env` contains all the information about the environment the contract is running in, but what does that mean exactly? On Secret Network the properties available in the Env struct are as follows:

*   `block`

    This contains all the information about the current block. This is the block height (`height`), the current time as a unix timestamp (`time`) and the chain id (`chain_id`) such as secret-4 or pulsar-2.

*   `message`

    Contains information that was sent as part of the payload for the execution. This is the sender, or the wallet address of the person that called the handle function and sent\_funds which contains a vector of native funds sent by the caller (SNIP-20s are not included).

*   `contract`

    Contains a property with the contract’s address.

*   `contract\_code\_hash`

    This is a String containing the code hash of the current contract, it’s useful when registering with other contracts such as SNIP20s or SNIP721s or when working on a factory contract.

Now that you have an overview on what all those properties are, let’s take a look at a simple handle function.

### Example Handle

```rust
pub fn try_increment<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    _env: Env,
) -> StdResult<HandleResponse> {
    config(&mut deps.storage).update(|mut state| {
        state.count += 1;
        debug_print!("count = {}", state.count);
        Ok(state)
    })?;

    debug_print("count incremented successfully");
    Ok(HandleResponse::default())
}
```

The handle above reads the state from the storage and increments the count property by one, then prints out the new count, if successful. But wait — where’s the storage hiding, what’s `config`? What’s `.update`?

As mentioned previously, developers don’t really like working with raw binary data, so many resort to using more human friendly ways, you can find out more on the page about storage, [here](storage/), but for the sake of this example let’s look at what that config function is doing; the developers of this contract, opted for using storage singletons. A storage singleton can be thought as a prefixed typed storage solution with simple-to-use methods. This allows the developer to define a structure for the data that needs to be stored and handles encoding end decoding it, so the developer doesn’t have to think about it. This is how it’s implemented in this contract:

```rust
use cosmwasm_storage::{singleton, Singleton};

pub static CONFIG_KEY: &[u8] = b"config";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub count: i32,
}

pub fn config<S: Storage>(storage: &mut S) -> Singleton<S, State> {
    singleton(storage, CONFIG_KEY)
}
```

The config function returns a singleton over the config key using the `State` struct as its type, this means that when reading and writing data from the storage, the singleton automatically serializes or deserializes the State struct. The update method is a shorthand that will load the data, perform the specified action, and store the result in the storage, which makes for a very intuitive experience.

## HandleResponse

You may have noticed that the return type for a handle message is HandleResponse. Let's take a look at how HandleResponse is defined:&#x20;

```rust
pub struct HandleResponse<T = Never> 
where T: Clone + fmt::Debug + PartialEq + JsonSchema, {
    pub messages: Vec<CosmosMsg<T>>,
    pub log: Vec<LogAttribute>,
    pub data: Option<Binary>,
}
```

It contains a vector of CosmosMsg (messages), an optional vector of type LogAttribute (log), and an optional Binary field (data).

LogAttribute is defined as a simple struct with two String fields, key, and value. Binary is just a Vec\<u8>.&#x20;

CosmosMsg is an enum with a transaction that will be executed once the handle function returns.&#x20;

There are three types of messages, you can read more about them [here](broken-reference):&#x20;

* BankMsg::Send which sends SCRT from one place to another (such as from the contract's wallet to the caller's wallet)
* StakingMsg which includes messages for Delegating, Redelegating, Undelegating, and withdrawing rewards to/from a delegator.
* WasmMsg which includes two messages: Execute to execute another contract and Instantiate to instantiate a contract.

You can find more information about those in the coming pages.
