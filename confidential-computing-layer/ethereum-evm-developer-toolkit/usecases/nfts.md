---
description: Learn how to mint cross-chain NFTs with SecretPath
---

# Cross-Chain NFTs with SecretPath and OpenAI

{% hint style="danger" %}
_6.5.24: docs currently in progress_
{% endhint %}

## Overview

[SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath) enables EVM developers to use Secret Network as a Confidential Computation Layer (CCL) for [all EVM-compatible chains](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks).

In this developer tutorial, you will learn how to use SecretPath to enable cross-chain NFTs on the EVM. You will mint an NFT on Sepolia testnet that uses a [sister contract](https://docs.scrt.network/secret-network-documentation/development/development-concepts/example-contracts/secret-contract-fundamentals/privacy-as-a-service-paas#id-3.-sister-contracts-ex.-private-data-for-nfts-verified-p2p-communication) on Secret Network to store private metadata, which can only be accessed by a private password stored in the Secret Contract. And to spice things up, **we will generate the NFT image with OpenAI** 🔥. &#x20;

<figure><img src="../../../.gitbook/assets/cross-chain NFT.png" alt="" width="375"><figcaption><p>Cross-Chain NFT on Secret Network</p></figcaption></figure>

{% hint style="info" %}
See Cross-Chain NFT demo [here](https://secretpath-nft.vercel.app/).&#x20;
{% endhint %}

### Getting Started

1. Git clone the SecretPath tutorials repository:&#x20;

```
git clone https://github.com/SecretFoundation/Secretpath-tutorials.git
```

2. Get Secret Network testnet tokens from [faucet](https://faucet.pulsar.scrttestnet.com/)
3. Get Sepolia testnet tokens from [faucet ](https://www.alchemy.com/faucets/ethereum-sepolia)

### Deploying Secret Network Sister Contract

cd into secretpath-nft/secret-contract

```
cd secretpath-nft/secret-contract
```

Compile the contract:

```
make build-mainnet
```

{% hint style="info" %}
If you are on a Mac and run into compilation error:

`error occurred: Command “clang”`

Make sure you have the [latest version](https://developer.apple.com/download/applications/) of Xcode installed and then update your clang path by running the following in your terminal:

`cargo clean`

`AR=/opt/homebrew/opt/llvm/bin/llvm-ar CC=/opt/homebrew/opt/llvm/bin/clang cargo build --release --target wasm32-unknown-unknown`&#x20;

See [here](https://github.com/rust-bitcoin/rust-secp256k1/issues/283#issuecomment-1670222980) for instructions on updating your clang path.
{% endhint %}

Once the contract compiles successfully, install the dependencies to upload it to testnet: &#x20;

```
cd node && npm i 
```

Create an [.env file ](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-nft/secret-contract/node/.env)and add your Secret wallet mnemonic:

```javascript
MNEMONIC="your mnemonic words to go here"
```

Upload the contract:

```
node upload
```

Upon successful upload, your contract address will be returned:&#x20;

{% code overflow="wrap" %}
```
Contract hash: 9391c79a8dcceb8a58334e0a78e357e328eff872b75af6ebc7d267bbdc9b32dc

contract address: secret1cndts3q2shapmkmjsmf74r8v6u6drvwjl52v7p
```
{% endcode %}

Before we uplaod the EVM contract which mints the NFT, let's examine what the Secret Network sister contract does.&#x20;

Navigate to the [state.rs](https://github.com/SecretFoundation/Secretpath-tutorials/blob/3fd35ab7521cc2ade9b8344687f0febd706f4df6/secretpath-nft/secret-contract/src/state.rs#L17) file and notice the `ConfidentialMetadata` struct:&#x20;

```rust
pub struct ConfidentialMetadata {
    pub owner: String,
    pub token_id: u64,
    pub uri: String,
    pub private_metadata: String, 
    pub password: String,
}
```

This is the confidential metadata that you will be storing in the Secret Network smart contract for each NFT that you mint on the EVM. There is an `owner`,  `token_id`,  `uri`, `private_metdata`, and `password`, all of which will be associated with each NFT you mint.&#x20;

Now open [contract.rs](https://github.com/SecretFoundation/Secretpath-tutorials/blob/3fd35ab7521cc2ade9b8344687f0febd706f4df6/secretpath-nft/secret-contract/src/contract.rs#L115) and navigate to the `execute_store_confidential_metadata` function.&#x20;

Here we have a `keymap` called `CONFIDENTIAL_METADATA`, which maps the `token id` of your EVM NFT to a `ConfidentialMetadata` struct. So for every NFT you mint on EVM, it has an associated private metadata stored in the Secret Contract. Pretty cool, right!&#x20;

{% hint style="info" %}
Note that this is for demo purposes only, if you were doing this in production you would probably want to use a more secure way of linking the EVM NFT to the Secret Network sister contract, such as a ZK proof.&#x20;
{% endhint %}

Now let's deploy our EVM Minting contract 😊

### Deploying EVM NFT Contract

cd into cd secretpath-nft/evm-contract:&#x20;

```
cd secretpath-nft/evm-contract
```

Install the dependencies:&#x20;

```
npm i 
```

Create a [`.env` file](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-nft/evm-contract/.env) and add your EVM `PRIVATE_KEY` and [Infura API Key](https://app.infura.io/) for Sepolia testnet:&#x20;

```javascript
PRIVATE_KEY=5766fdksdfldsfjdlfd84749393j0d
INFURA_KEY=7bb38fdsfjddkfjdfaljf9d82
```

Once you have your env file configured, upload the minting contract:

```
npx hardhat run scripts/deployNFT.js --network sepolia
```

Upon successful upload, a contract address will be returned:&#x20;

```
0x0061b1aecAAe02Ddd3ce9De631a2C817c5be18F8
```

Congrats! You now have a private metadata contract deployed on Secret Network and a minting contract deployed on Sepolia testnet! Now let's learn how to use SecretPath to send data confidentially from the EVM to Secret Network 😎

### Sending Cross-Chain Confidential Metadata with SecretPath

{% hint style="danger" %}
_6.5.24: docs currently in progress_
{% endhint %}
