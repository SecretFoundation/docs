# Millionaire's Problem Breakdown (extra credit)

This section will provide a more detailed breakdown of the actual Secret Contract code that went into solving the Millionaire's problem. Going through this section won't require you to know Rust (though it would help), but instead we'll focus mostly on the logic, and how different components interact with each other.

### Contract Components

We'll start by going through the basic components of a contract.

* Instantiate - the logic that is ran once on initialization of the contract. This will usually be the initial conditions and configuration of the contract.&#x20;
* Execute - this is where the _transactional_ logic resides. These are functions that modify contract data
* Query - these are functions that are ran as read-only and cannot modify contract data
* State - the long-term storage of the contract. By default, data used by contracts will be lost between transactions. &#x20;

Each contract will contain these basic building blocks, with their logic being built around how they work.&#x20;

{% hint style="info" %}
**Did you know?** Executes require a transaction, which costs gas. Queries are free! This is why it is preferable to use queries when an action does not require modifying data.
{% endhint %}

### Directory Structure

Now we can move on to examining our contract, which solves the Millionaire's problem. We'll start by looking at the directory structure:

![](<../../.gitbook/assets/image (1).png>)

For the most part, we can expect the files to contain the following data:

* contract.rs - will contain most of the business logic of the app
* msg.rs - will contain the various interfaces and messages that are used to communicate with the contract
* state.rs - will contain logic pertaining to data structures that are saved in the long-term storage (state)
* cargo.toml - will contain metadata and detail the various libraries that the contract is using

{% hint style="info" %}
**Did you know?** Contracts for Secret Network depend on forked versions of the standard CosmWasm dependencies&#x20;
{% endhint %}

### High Level Architecture

Before we jump into the code, we will go over the contract flow. Looking back at [the problem](compile-and-deploy.md) we have to solve; it is fairly simple. We have to accept inputs from two different users, save their inputs, and expose a way to check which input is greater.

We end up with the following state machine:

![Millionaire's Problem State Machine](../../.gitbook/assets/image.png)

This is a fairly naïve approach, but for the purposes of this example it is fairly straightforward. From looking at this state machine, we can expect that the implementation will contain (at minimum) the following methods:

1. **Submit Input** - allow the user to submit input. We'll also need the user to identify himself somehow so we can print out his identity if he is the winner.
2. **Query Result** - ask the contract which input is greater and return the id of the user whose input was greater
3. **Reset** - resets the state and start over

We'll note that _Submit Input_ and _Reset_ are both actions that require modifying contract data, so they will be _executes._ Similarly, _Query Result_ is a read-only function, so it can be implemented (as the name suggests) as a _query._&#x20;

Now let's think about what data our contract will need to store. Each _submit input_ method will require a separate transaction, so we need to save both the user data, and something to help keep track of which step we are on. This means that our state will look something like:

1. User data #1 - \<User ID, Net Worth>
2. User data #2 - \<User ID, Net Worth>
3. Step - \<Initial/Got 1st/Done>

{% hint style="warning" %}
**Further Reading:** For simplicity we do not differentiate between a _transaction_ and a _message._ In reality, the Cosmos-SDK defines each discrete interaction with the chain as a _message._ While a _transaction_ is a higher-level object that can contain multiple _messages_
{% endhint %}

Alright, now we are armed with all the knowledge we need to dive into the code itself!

### Entry Points

Entry points, or _handlers_ are where messages or queries are handled by the contract - this is basically where all data coming into the contract ends up. We can see the different entry points based on the [contract components](millionaires-problem-breakdown-extra-credit.md#contract-components) we described.

Looking at our contract, we can see these entry points defined in **contract.rs -**

```rust
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    //... stuff
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, CustomContractError> {
    //... stuff
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<QueryResponse> {
    //... stuff
}
```

This is how most CosmWasm contracts will look like**,** and usually this is where you'll want to start when both writing or reading a contract.

For now, we can ignore all these scary data types that we don't understand. Instead, let's dive in to breaking down the various components based on the architecture.

### Instantiate

The instantiate step is where we'll want to create a default contract state with our initial starting conditions to prepare the contract for accepting data. We're not depending on any input from the user in this step, so we can ignore all the function inputs.

{% hint style="info" %}
**Further Reading:** The instantiate step is usually where contract ownership is defined, if the contract makes use of admin-only features
{% endhint %}

Let's look at this in the code:

```rust
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {

    let state = State::default();
    config(deps.storage).save(&state)?;

    Ok(Response::default())
}
```

Again, we'll ignore all the scary stuff and look only at lines 9 and 10.&#x20;

On line #9 we're taking this yet unknown _State_ data type and calling its `default()` function.

On line #10 we're saving this _State_ data structure to the contract storage. This means it will be available for us to read the next time the contract is called (from the execute or query entry-points). We can also see `deps.storage` is being used as a function parameter. This gives us a clue as to what the `deps` variable contains - objects that allow the contract to interact with functionality outside the contract code itself. Some examples of this are using long-term storage, calling efficient crypto APIs, or querying the blockchain state.&#x20;

{% hint style="info" %}
**Did you know?** The instantiate function can only be called once per contract when it is initialized
{% endhint %}

Since we want to understand what this strange _State_ structure is, we can sort of guess that there might be some useful information in the **state.rs** file. And indeed here we find our definitions:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct State {
    pub state: ContractState,
    pub player1: Millionaire,
    pub player2: Millionaire
}

#[derive(Serialize, Deserialize, PartialEq, Clone, Debug)]
pub enum ContractState {
    Init,
    Got1,
    Done
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, Eq)]
pub struct Millionaire {
    name: String,
    worth: u64
}
```

As per usual, let's ignore all that`#[derive]` stuff, and instead look at our data structures. We can see that our `State` data structure contains the exact types that we expected when thinking about the [design](millionaires-problem-breakdown-extra-credit.md#high-level-architecture) of the contract. We'll also note that we chose to contain the user data in the `Millionaire` struct.

{% hint style="info" %}
**Do you even Rust?** The #\[derive] header tells the compiler to provide implementations for basic behaviour. For example, using _`Default` _ will tell our compiler to generate the _`::default()`_  function, which will allocate the structure and set all the values to their defaults (0 for a number, "" for a string, etc.)&#x20;
{% endhint %}

### Execute

#### Execute Entry Point

Switching back to **contract.rs** we'll just dive right into our execute entry-point, since we already know what to expect

```rust
#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, CustomContractError> {
    match msg {
        ExecuteMsg::SubmitNetWorth { name, worth } => try_submit_net_worth(deps, name, worth),
        ExecuteMsg::Reset {  } => try_reset(deps),
    }
}
```

Without understanding anything else, we can immediately see our 2 actions that we [talked about previously](millionaires-problem-breakdown-extra-credit.md#high-level-architecture) implemented here. We can also figure out that `msg` is some data type that tells us what function we need to call. &#x20;

{% hint style="info" %}
**Do you even Rust?** The _match_ syntax is logically similar to _switch-case_ that you might be familiar with from other languages
{% endhint %}

#### Contract Interface

Toggling over to **msg.rs** we can see what `ExecuteMsg` is defined as:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SubmitNetWorth { name: String, worth: u64 },
    Reset {},
}
```

{% hint style="info" %}
**Do you even Rust?** In Rust Enums can contain complex data types, which makes them especially useful for interface definitions
{% endhint %}

Yep, as we expect, `ExecuteMsg` is just an enumeration of the different message types (and their parameters) that a user can send to the contract. The way this works in practice is that the user sends his data as a JSON object. This object then gets parsed and matched according to the definition in `ExecuteMsg`. If the object does not match one of the enum types? The transaction will fail and get rejected!&#x20;

{% hint style="info" %}
**Do you even Rust?** Can you intuitively guess what _#\[derive(Serialize, Deserialize, PartialEq)]_ are used for? How about _#\[serde(rename\_all = "snake\_case")]_?
{% endhint %}

#### Main Functions

Okay, time to zoom back in to **contract.rs** and take a look at our functions. The first one we will be looking at is **try\_submit\_net\_worth:**

```rust
pub fn try_submit_net_worth(
    deps: DepsMut,
    name: String,
    worth: u64
) -> Result<Response, CustomContractError> {
    let mut state = config(deps.storage).load()?;

    match state.state {
        ContractState::Init => {
            state.player1 = Millionaire::new(name, worth);
            state.state = ContractState::Got1;
        }
        ContractState::Got1 => {
            state.player2 = Millionaire::new(name, worth);
            state.state = ContractState::Done;
        }
        ContractState::Done => {
            return Err(CustomContractError::AlreadyAddedBothMillionaires);
        }
    }

    config(deps.storage).save(&state)?;

    Ok(Response::default())
}
```

This is the main function that handles the logic of our contract. Although you can probably figure this out easily, we'll describe the logic you're seeing:

1. Read the current state of the contract from long-term storage
2. If we don't have any data, save user data as player#1 and set the state as `Got1`
3. If we already got the data for the first user, save user data as player#2 and set the state as `Done`
4. Save the new state in storage.

Super simple. Let's head over to the **try\_reset** function

```rust
pub fn try_reset(
    deps: DepsMut,
) -> Result<Response, CustomContractError> {
    let mut state = config(deps.storage).load()?;

    state.state = ContractState::Init;
    config(deps.storage).save(&state)?;

    Ok(Response::new()
        .add_attribute("action", "reset state"))
}
```

At this point I don't even have to explain to you what's going on here. We'll just note that the `Response` object in this case returns something called an _attribute._ An _attribute_ is a key-value pair that gets returned after a successful message that can help summarizing what happened. _Attributes_ can even be indexed, queries and used as event triggers via WebSocket.

Now we have all the pieces in place. All that remains to be done is to look at how the result is queried by the user.   &#x20;

### Query

Let's see what the last contract component we haven't looked at - query - has for us:

```rust
#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<QueryResponse> {
    match msg {
        QueryMsg::WhoIsRicher {} => to_binary(&query_who_is_richer(deps)?),
    }
}
```

At a glance, we see the same basic structure that we've seen in the _Execute_ entry point. We can also guess that `msg` and the `QueryMsg` data type are functionally similar to the `ExecuteMsg` type we've seen earlier. By now you'll know where this data type is defined, so you can go take a look at the definition and verify this assumption.

Looking a bit deeper, the `to_binary` method sticks out as odd. We haven't seen this in our executes or the instantiate function. The reason for this is that queries are returned as binary data. Executes and the instantiate function return complex objects that are saved to the blockchain state, queries are simple and only need to return the specific data the user cares about.

The last piece of the puzzle is the **`query_who_is_richer`** function

```rust
fn query_who_is_richer(deps: Deps) -> StdResult<RicherResponse> {
    let state = config_read(deps.storage).load()?;

    if state.state != ContractState::Done {
        return Err(StdError::generic_err("Can't tell who is richer unless we get 2 data points!"));
    }

    if state.player1 == state.player2 {
        let resp = RicherResponse {
            richer: "It's a tie!".to_string(),
        };

        return Ok(resp);
    }

    let richer = max(state.player1, state.player2);

    let resp = RicherResponse {
        // we use .clone() here because ...
        richer: richer.name().clone(),
    };

    Ok(resp)
}

```

Logically, this super simple. Read the state, check which player has the most money, and return the result.

{% hint style="info" %}
**Do you even Rust?** The astute reader will remember that _player_ in this context is actually a complex data structure. How is it possible to call _max(player1, player2)_ or to check if _player1 == player2_? It turns out you can actually implement the logic for equality and ordering yourself for structs. Head over to **state.rs** to see an example of that in action
{% endhint %}

&#x20;The only thing worth noting is that the response is of the type `RicherResponse` (we ignore the `StdResult` wrapper - it is used to handle and include errors in the possible return types). `RicherResponse` is a custom type that we defined (in **msg.rs**).&#x20;

Usually, you will want to define a custom return type for each separate query, which makes data easier to process on the user side - we'll remember that while we talk about user queries for simplicity, in reality, the user will most likely be accessing data through some web application which will be handling both querying the contract and processing the response.&#x20;

### In Closing

That's it! An entire Secret Contract from start to end. Thanks for taking the time to go through all of this guide (or even a small portion of it)! You should now have a good understanding of the building blocks of a contract not only on Secret Network, but for all blockchains that support CosmWasm.&#x20;

* [Intro to Secret Contracts](https://docs.scrt.network/secret-network-documentation/development/intro-to-secret-contracts) - a more in-depth Secret Contract guide
* [CosmWasm Documentation](https://docs.cosmwasm.com/docs/1.0/) - everything you want to know about CosmWasm
* [Secret.JS](https://docs.scrt.network/secret-network-documentation/development/secretjs/templates) - Building a web UI for a Secret Contract
