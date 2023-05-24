---
description: Code example for using Secret-VRF within a secret smart contract
---

# Native On-chain randomness

In this tutorial, you will learn how to access the randomness feature and use it with a smart contract that returns a truly random coin flip 🎉

For a detailed feature explainer head to the [network technical documentation](../../secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness.md)

### Enable the "random" feature

In your Cargo.toml file, add the "random" feature to the cosmwasm-std dependency:

```rust
[dependencies.cosmwasm-std]
git = "https://github.com/scrtlabs/cosmwasm"
rev = "8ee395ba033c392d7170c971df97f085edaed2d9"
package = "secret-cosmwasm-std"
features = ["random"]
```

_Note this will change as the feature gets merged into the main-line branch_

### Tutorial - Coin Flip

What follows is a step-by-step tutorial of how to use Secret Network's randomness API to generate a coin flip (returning either 0 or 1) with true randomness. You can follow along and/or view the completed code [in this repo](https://github.com/writersblockchain/SecretNetwork-Randomness-Tutorial).&#x20;

#### Environment Configuration

LocalSecret is a tool that allows you to run a local Secret Network on your machine for testing and development purposes. To use the new randomness feature with LocalSecret, you can leverage the localsecret:v1.9.0-beta.1-random Docker image, which supports the "random" feature for CosmWasm contracts.

Here are the steps to use the randomness feature with LocalSecret:

1. [Configure your developer environment](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) and be sure to install the [latest version of SecretCLI.](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/secret-cli/install)
2. Clone the coin flip repo:

{% code overflow="wrap" %}
```
git clone https://github.com/writersblockchain/SecretNetwork-Randomness-Tutorial.git
```
{% endcode %}

#### &#x20;Contract.rs

To consume the random number, you need to import the necessary dependencies in your `contract.rs` file in order to **access the random number from the env parameter.**&#x20;

In your contract, import the necessary dependencies (these are already imported in the cloned repo):

```rust
use cosmwasm_std::{Binary, Env, MessageInfo, Response, Result};
```

In the contract's entry point (e.g., execute, instantiate, or query), you can access the random number from the [env parameter](https://github.com/writersblockchain/SecretNetwork-Randomness-Tutorial/blob/8dbdfcca74507a98ac2bdb7bc18112a597fc727b/src/contract.rs#L32):

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

Where the random is 32 bytes long and base64 encoded.

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

To compile your contract, in your terminal run:

```rust
make build-mainnet
```

This returns the optimized contract wasm file, ie `contract.wasm.gz`

#### Upload

To upload your contract to a containerized version of LocalSecret in docker, make sure you have docker installed and open, and then create a new tab in your terminal and run:&#x20;

{% code overflow="wrap" %}
```
docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1317:1317 -p 5000:5000 --name localsecret ghcr.io/scrtlabs/localsecret:v1.9.0-beta.1-random
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

Congrats! In this step-by-step tutorial on creating a coin flip contract, you learned how to compile, upload, instantiate, and execute a contract on LocalSecret using Secret Network's randomness API to generate random numbers 🎉
