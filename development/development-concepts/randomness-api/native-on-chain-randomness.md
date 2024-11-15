---
description: >-
  A step-by-step tutorial of how to use Secret Network's randomness API to
  generate a coin flip
---

# Native On-chain randomness

In this tutorial, you will learn how to access the randomness feature and use it with a smart contract that returns a truly random coin flip 🎉

For a detailed feature explainer head to the [network technical documentation](../secret-contract-fundamentals/secret-vrf-on-chain-randomness.md)

### Import Secret VRF

In your Cargo.toml file, add secret-toolkit-storage 0.10.1:

```rust
[dependencies]
cosmwasm-std = { package = "secret-cosmwasm-std", version = "1.1.10" }
cosmwasm-storage = { package = "secret-cosmwasm-storage", version = "1.1.10" }
secret-toolkit-storage = "0.10.1"
```

### Tutorial - Coin Flip

What follows is a step-by-step tutorial of how to use Secret Network's randomness API to generate a coin flip (returning either 0 or 1) with true randomness. You can follow along and/or view the [completed code in this repo](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial).&#x20;

#### &#x20;Contract.rs

To consume the random number, you need to import the necessary dependencies in your `contract.rs` file in order to **access the random number from the env parameter.**&#x20;

In your contract, import the necessary dependencies (these are already imported in the cloned repo):

```rust
use cosmwasm_std::{Binary, Env, MessageInfo, Response, Result};
```

In the contract's entry point (e.g., execute, instantiate, or query), you can access the random number from the `env` parameter:

```rust
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Flip {} => try_flip(deps, env),
    }
}
```

The env and block\_info structures are defined as:

```rust
pub struct Env {
    pub block: BlockInfo,
    pub contract: ContractInfo,
    pub transaction: Option<TransactionInfo>,
}

pub struct BlockInfo {
    /// The height of a block is the number of blocks preceding it in the blockchain.
    pub height: u64,
    pub time: Timestamp,
    pub chain_id: String,
    #[cfg(feature = "random")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub random: Option<Binary>,
}
```

Where `random` is 32 bytes and base64 encoded.

#### Accessing the Env struct

Below is a simple coin flip function that uses the randomness feature:

```rust
pub fn try_flip(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    config(deps.storage).update(|mut state| -> Result<_, ContractError> {
        let coin_flip = env.block.random.unwrap().0[0] % 2;
        state.flip = coin_flip;
        Ok(state)
    })?;

    deps.api.debug("flipped!");
    Ok(Response::default())
}
```

`try_flip()` uses the `config` function to update the state of the smart contract by flipping a coin and storing the result in the `flip` field in the `state` variable. Specifically, **it generates a random number using the `random` field of the `env.block` object**, **which is an optional value representing the most recent block's metadata, and takes the modulo 2 to obtain a value of either 0 or 1**. It then updates the `flip` field of the `state` variable to this value.

### Interacting with the Coin Flip Contract

Now, let's compile, upload, instantiate, and execute the contract to see it in action!&#x20;

#### Compile

To compile your contract, run `make build-mainnet-reproducible`

```bash
make build-mainnet-reproducible
```

This returns the optimized contract wasm file, ie `contract.wasm.gz`

#### Upload and Instantiate randomness contract

Upload and instantiate your contract to Secret Network testnet with the upload script [here](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/master/node/index.js).

If you would like to use your own wallet addres, be sure to update the [mnemonic](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/ef75ef9b59e53b4e6374ff65b9a9c97e121a0e24/node/index.js#L7).

{% code overflow="wrap" %}
```bash
cd node 
npm i
node index
```
{% endcode %}

#### Execute

Now that you have a **contract address** you can execute the coin flip with the randomness feature!&#x20;

To flip the coin, update the [contract address](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/69f6a35f8574fc10a2fb4a0499e2b3bac188f4c2/node/try-flip.js#L16) and [code hash](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/69f6a35f8574fc10a2fb4a0499e2b3bac188f4c2/node/try-flip.js#L20) with your parameters and run:&#x20;

{% code overflow="wrap" %}
```bash
node try-flip
```
{% endcode %}

And to query that it was successful, update the [contract address](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/69f6a35f8574fc10a2fb4a0499e2b3bac188f4c2/node/query-flip.js#L14) and [code hash](https://github.com/SecretFoundation/SecretNetwork-Randomness-Tutorial/blob/69f6a35f8574fc10a2fb4a0499e2b3bac188f4c2/node/query-flip.js#L15) with your parameters and run:&#x20;

{% code overflow="wrap" %}
```bash
node query-flip
```
{% endcode %}

{% hint style="info" %}
You might have to execute the flip function a few times to see the queried flip change, since there is a 50% chance the flip will return the same number :D
{% endhint %}

### Summary

Congrats! In this step-by-step tutorial on creating a coin flip contract, you learned how to compile, upload, instantiate, and execute a contract on Secret testnet using Secret Network's randomness API to generate random numbers 🎉\
\
For documentation on Secret VRF in a contract on another IBC-connected chain, [click here](https://docs.scrt.network/secret-network-documentation/development/development-concepts/randomness-api/cross-chain-ibc-randomness).
