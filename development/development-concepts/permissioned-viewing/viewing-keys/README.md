---
description: Introduction to Secret Network viewing keys with code examples
---

# Viewing Keys

## Viewing Keys Introduction

Viewing keys are passwords meant to validate users at times when the blockchain cannot. Specifically in queries, the query sender isn't authenticated and the contract doesn't know who is the querier. Therefore viewing keys were invented to provide a way of access control for users:

1. Alice sends a transaction `set_viewing_key(password)`
2. The contract stores `(alice,password)`
3. Later on, a query is sent to the contract `query("balance",alice,password)`
   * If `(alice,password)` matches what's in storage, the contract returns Alice's balance to the querier.

{% hint style="info" %}
To see an implementation of viewing keys in a Secret smart contract, check out the [Secret Labs Viewing Keys example repository](https://github.com/scrtlabs/examples/tree/master/secret-viewing-keys/secret-viewing-keys-contract/src)&#x20;
{% endhint %}

## Importing Secret Toolkit &#x20;

Secret Network developed the [`secret-toolkit` viewing key package](https://github.com/scrtlabs/secret-toolkit/blob/master/packages/viewing\_key/src/lib.rs) for creating and managing viewing keys in Secret smart contracts.  The methods provided include:

* `set_seed`: Sets an initial pseudorandom number generator (PRNG) seed for the store.
* `create`: Creates a new viewing key, saves it to the storage, and returns it.
* `set`: Sets a new viewing key based on a predetermined value.
* `check`: Checks if a viewing key matches an account.

To make use of the secret-toolkit viewing keys package, import it into your `cargo.toml` file:

{% code overflow="wrap" %}
```rust
secret-toolkit = { version = "0.9.0", default-features = false, features = [
    "utils",
    "storage",
    "serialization",
    "viewing-key",
    "crypto",
] }
```
{% endcode %}

## Viewing Keys Implementation

If you would like to see an example implementation of Secret Network viewing keys, see the [Secret Labs examples repository here](https://github.com/scrtlabs/examples/blob/master/secret-viewing-keys/secret-viewing-keys-contract/src/contract.rs).&#x20;

{% hint style="success" %}
This contract is designed to create top secret messages that can only be decrypted if the user has the correct viewing key that is associated with the `secret_message` struct.&#x20;
{% endhint %}

Let's review the [`try_create_secret_message()`](https://github.com/scrtlabs/examples/blob/b6d960134310bad1a7354dce63503a6fb667d514/secret-viewing-keys/secret-viewing-keys-contract/src/contract.rs#L33) function:

{% code overflow="wrap" %}
```rust
 pub fn try_create_secret_message(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    secret_message: SecretMessage,
    index: u8,
) -> StdResult<Response> {
    let my_account = info.sender.as_str();
    let viewing_key = ViewingKey::create(deps.storage, &info, &env, &my_account, b"entropy");

    SECRET_MESSAGE.insert(deps.storage, &viewing_key, &secret_message)?;
    VIEWING_KEY
        .add_suffix(info.sender.as_bytes())
        .insert(deps.storage, &index, &viewing_key)?;
    Ok(Response::default())
}
```
{% endcode %}

This function stores a secret message at a specified index in the contract's storage, which is mapped to a viewing key. This ensures that the secret message can only be accessed by the correct viewing key, and that each secret message has its own unique viewing key.&#x20;

Let's go over it in more detail:

1. A new viewing key is created by calling `ViewingKey::create`. The parameters passed include the mutable dependencies (which includes the storage), the environment `env`, the `MessageInfo`, the sender account, and a hard-coded entropy value `b"entropy"`.
2. The secret message is then stored in the contract's storage and is mapped to the viewing key. The `SECRET_MESSAGE.insert` line is performing this task.
3. Next, the viewing key itself is stored in the contract's storage, but this time indexed with a user-defined `index` parameter and prefixed by the sender's account address. This is done by `VIEWING_KEY.add_suffix(info.sender.as_bytes()).insert(deps.storage, &index, &viewing_key)`.
4. Finally, the function returns a default `Response` instance indicating successful execution of the function.

### Additional Viewing Keys methods&#x20;

#### check

```rust
let account = "user-1".to_string();
let mut deps = mock_dependencies();
let env = mock_env();
let info = mock_info(account.as_str(), &[]);

let result = ViewingKey::check(&deps.storage, &account, "fake key");
assert_eq!(result, Err(StdError::generic_err("unauthorized")));
```

#### set

```rust
let viewing_key = "custom key";
ViewingKey::set(&mut deps.storage, &account, viewing_key);
```

#### set\_seed

```rust
  ViewingKey::set_seed(&mut deps.storage, b"seed");
```

## Summary

Viewing keys provide a mechanism for access control in blockchain applications when the blockchain itself can't authenticate the query sender. `Secret-toolkit` allows developers to set seeds, create and check viewing keys, and set a new viewing key based on a predetermined value [🎉](https://emojipedia.org/party-popper/)

Should you have further questions, please reach out on [discord](https://discord.com/channels/360051864110235648/603225118545674241) and a Secret developer will get back to you shortly [🚀](https://emojipedia.org/rocket/)
