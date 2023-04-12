# Factory Contracts

Factory contracts are contracts that create other contracts. They are useful for:

* Dividing your app into parts, each with different responsibilities.
* Extending the scope of your app by dynamically adding a piece of functionality.
* Managing different parts of the app from a single location, etc.

{% hint style="info" %}
The [Factory Contract Template](https://github.com/srdtrk/secret-factory-contract) is a good starting point for setting up your own factory contracts and experimenting with them.
{% endhint %}

Here are some examples of active projects that use factory contracts:

* [SecretSwap](https://github.com/scrtlabs/SecretSwap/), where a Factory contract [creates](https://github.com/scrtlabs/SecretSwap/blob/master/contracts/secretswap\_factory/src/contract.rs#L177-L201) a new Child contract for every new pair supported on the exchange. (Cosmwasm v0.10).
* [SecretJack](https://github.com/scrtlabs/SecretJack), where a Parent "Bank" Contract which manages the funds [creates](https://github.com/scrtlabs/SecretJack/blob/master/contract/bank/src/contract.rs#L19-L29) a single "Game" Contract which manages the game logic. (Cosmwasm v0.10).

### How to create Factory contracts

After the child contract is stored on chain, you can instantiate child contracts from the factory in the following manner:

{% tabs %}
{% tab title="Cosmwasm v1" %}
Assume the child contract expects the following instantiate message:

```rust
// example of an Instantiate Msg
#[derive(serde::Serialize, serde::Deserialize)]
pub struct OffspringInstantiateMsg {
    pub example_field: i32,
}
```

To instantiate the child contract, you can send a [**submessage**](https://book.cosmwasm.com/actor-model/contract-as-actor.html?highlight=submess#sending-submessages) from the parent with the child's instantiate message:

```rust
use cosmwasm_std::{SubMsg, Response};
use secret_toolkit::utils::{InitCallback};
```

```rust
const OFFSPRING_INSTANTIATE_REPLY_ID: u64 = 1;

// Implement InitCallback on the OffsprintInit message
// to be able to convert it to cosmosMsg
impl InitCallback for OffspringInstantiateMsg {
    const BLOCK_SIZE: usize = BLOCK_SIZE;
}

// populate the message
let init_msg = OffspringInstantiateMsg {
    example_field: 1,
};

// build a submessage from the offspring init message
let init_submsg = SubMsg::reply_always(
    initmsg.to_cosmos_msg(
        "example_label".to_string(), // label for offspring contract
        1,                           // offspring code id
        "d519793af2...".to_string(), // offspring code hash
        None,                        // funds amount
    )?,
    OFFSPRING_INSTANTIATE_REPLY_ID,
);

// then build the response with the submessage
Ok(Response::new().add_submessage(init_submsg))
```

If you don't care about the reply, you can send a regular message instead:

```rust
let init_cosmos_msg = initmsg.to_cosmos_msg(
    "example_label".to_string(), // label for offspring contract
    1,                           // offspring code id
    "d519793af2...".to_string(), // offspring code hash
    None,                        // funds amount
)?;

Ok(Response::new().add_message(init_cosmos_msg))
```
{% endtab %}

{% tab title="Cosmwasm v0.10" %}
Assume the child contract expects the following instantiate message:

```rust
// example of an Instantiate Msg
#[derive(serde::Serialize, serde::Deserialize)]
pub struct OffspringInstantiateMsg {
    pub example_field: i32,
}
```

To instantiate the child contract, send a message on the parent's response:

```rust
use cosmwasm_std::{CosmosMsg, WasmMsg};
use secret_toolkit::utils::{InitCallback};
```

<pre class="language-rust"><code class="lang-rust">// Implement InitCallback on the OffsprintInit message
// to be able to convert it to cosmosMsg
impl InitCallback for OffspringInstantiateMsg {
    const BLOCK_SIZE: usize = BLOCK_SIZE;
}

let messages = vec![
    initmsg.to_cosmos_msg(
        "example_label".to_string(), // label for offspring contract
        1,                           // offspring code id
        "d519793af2...".to_string(), // offspring code hash
        None,                        // funds amount
    )?,
]);

// Then return the message from an entry point, for example on init:
<strong>Ok(InitResponse {
</strong>    messages,
    log: vec![],
})
</code></pre>
{% endtab %}
{% endtabs %}
