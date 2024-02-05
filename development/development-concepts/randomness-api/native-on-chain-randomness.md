---
description: >-
  A step-by-step tutorial of how to use Secret Network's randomness API to
  generate a coin flip
---

# Native On-chain randomness

In this tutorial, you will learn how to access the randomness feature and use it with a smart contract that returns a truly random coin flip 🎉

For a detailed feature explainer head to the [network technical documentation](../../secret-contract-fundamentals/secret-vrf-on-chain-randomness.md)

### Import Secret VRF

In your Cargo.toml file, add secret-toolkit-storage 0.9.0:

```rust
[dependencies]
cosmwasm-std = { package = "secret-cosmwasm-std", version = "1.1.10" }
cosmwasm-storage = { package = "secret-cosmwasm-storage", version = "1.1.10" }
secret-toolkit-storage = "0.9.0"
```

{% hint style="info" %}
Make sure you're compiling with rust < 1.70. Newer versions are currently not compatible.
{% endhint %}

### Tutorial - Coin Flip

What follows is a step-by-step tutorial of how to use Secret Network's randomness API to generate a coin flip (returning either 0 or 1) with true randomness. You can follow along and/or view [the completed code in this repo](https://github.com/scrtlabs/examples/tree/master/vrf-Randomness-Tutorial).&#x20;

#### Environment Configuration

LocalSecret is a tool that allows you to run a local Secret Network on your machine for testing and development purposes.&#x20;

Here are the steps to use the randomness feature with LocalSecret:

1. [Configure your developer environment](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) and be sure to install the [latest version of SecretCLI.](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/secret-cli/install)
2. Clone the Secret Labs examples repo and then navigate to the vrf-randomness-tutorial folder:

{% code overflow="wrap" %}
```
git clone https://github.com/scrtlabs/examples.git
```
{% endcode %}

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

To compile your contract, in your terminal, make sure you have docker open, and then run:

```rust
docker run --rm -v "$(pwd)":/contract \                       
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer
```

This returns the optimized contract wasm file, ie `contract.wasm.gz`

#### Upload

To upload your contract to a containerized version of LocalSecret in docker, make sure you have docker installed and open, and then create a new tab in your terminal and run:&#x20;

{% code overflow="wrap" %}
```
docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1317:1317 -p 5000:5000 --name localsecret ghcr.io/scrtlabs/localsecret
```
{% endcode %}

Congrats, you now have a new instance of LocalSecret running that can access the random number feature!

Next, [create and fund a wallet ](https://docs.scrt.network/secret-network-documentation/development/getting-started/compile-and-deploy#creating-a-wallet)so you can upload the contract to LocalSecret. Then run the following to upload:&#x20;

{% code overflow="wrap" %}
```
secretcli tx compute store contract.wasm.gz --gas 5000000 --from <your wallet address> --chain-id secretdev-1
```
{% endcode %}

To confirm that the contract upload was successful:

```
secretcli query compute list-code
```

#### Instantiate

Now let's instantiate our contract with a starting flip of 1 (1 meaning Heads or Tales, up to you!)

{% code overflow="wrap" %}
```
secretcli tx compute instantiate 1 '{"flip": 1}' --from <your wallet address> --label flipContract
```
{% endcode %}

To confirm that the contract instantiation was successful:

```
secretcli query compute list-contract-by-code 1
```

#### Execute

Now that we have a **contract address** (which is returned from the `list-contract-by-code` query above), we an execute the coin flip with the randomness feature!&#x20;

To flip the coin simply run:&#x20;

{% code overflow="wrap" %}
```
secretcli tx compute execute <your contract address> '{"flip": {}}' --from myWallet
```
{% endcode %}

And to query that it was successful, run:&#x20;

{% code overflow="wrap" %}
```
secretcli query compute query <your contract address> '{"get_flip": {}}'
```
{% endcode %}

{% hint style="info" %}
You might have to execute the flip function a few times to see the queried flip change, since there is a 50% chance the flip will return the same number :D
{% endhint %}

### Summary

Congrats! In this step-by-step tutorial on creating a coin flip contract, you learned how to compile, upload, instantiate, and execute a contract on LocalSecret using Secret Network's randomness API to generate random numbers 🎉\
\
For documentation on Secret VRF in a contract on another IBC-connected chain, [click here](https://docs.scrt.network/secret-network-documentation/development/development-concepts/randomness-api/cross-chain-ibc-randomness).
