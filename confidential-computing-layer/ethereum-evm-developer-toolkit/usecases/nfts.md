---
description: Learn how to mint cross-chain privacy-preserving NFTs with SecretPath
---

# Cross-Chain NFTs with SecretPath and OpenAI

{% hint style="danger" %}
**These docs are currently being upated 11/18/24**
{% endhint %}

## Overview

[SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath) enables EVM developers to use Secret Network as a Confidential Computation Layer (CCL) for [all EVM-compatible chains](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks).

In this developer tutorial, you will learn how to use SecretPath to enable cross-chain NFTs on the EVM. You will mint an NFT on Amoy testnet that uses a [sister contract](https://docs.scrt.network/secret-network-documentation/development/development-concepts/example-contracts/secret-contract-fundamentals/privacy-as-a-service-paas#id-3.-sister-contracts-ex.-private-data-for-nfts-verified-p2p-communication) on Secret Network to store private metadata, which can only be accessed by a private password stored in the Secret Contract. And to spice things up, **we will generate the NFT image with OpenAI** 🔥. &#x20;

<figure><img src="../../../.gitbook/assets/cross-chain NFT.png" alt="" width="375"><figcaption><p>Cross-Chain NFT on Secret Network</p></figcaption></figure>

1. Generate an AI image with OpenAI&#x20;
2. Pin the newly generated image with Pinata to create the token URI
3. Mint the NFT on Sepolia with your token URI
4. Send the confidential metadata to your Secret Contract with SecretPath

{% hint style="info" %}
See Cross-Chain NFT demo [here](https://secretpath-nft.vercel.app/).&#x20;
{% endhint %}

### Getting Started

1. Git clone the repository:&#x20;

```bash
git clone https://github.com/writersblockchain/secretpath-nft.git
```

2. Get Secret Network testnet tokens from [faucet](https://faucet.pulsar.scrttestnet.com/)
3. Get Amoy testnet tokens from [faucet ](https://faucet.polygon.technology/)

### Deploying Secret Network Sister Contract

cd into secretpath-nft/secret-contract

```bash
cd secretpath-nft/secret-contract
```

Compile the contract:

```bash
make build-mainnet-reproducible
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

```bash
cd node && npm i 
```

Create an [.env file ](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-nft/secret-contract/node/.env)and add your Secret wallet mnemonic:

```javascript
MNEMONIC="your mnemonic words to go here"
```

Upload the contract:

```bash
node upload
```

Upon successful upload, your contract address will be returned:&#x20;

{% code overflow="wrap" %}
```
Contract hash: 9391c79a8dcceb8a58334e0a78e357e328eff872b75af6ebc7d267bbdc9b32dc

contract address: secret1cndts3q2shapmkmjsmf74r8v6u6drvwjl52v7p
```
{% endcode %}

Before we upload the EVM contract which mints the NFT, let's examine what the Secret Network sister contract does.&#x20;

Navigate to the `state.rs` file to the `ConfidentialMetadata` struct:&#x20;

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

Now open `contract.rs` and navigate to the `execute_store_confidential_metadata` function.&#x20;

Here we have a `keymap` called `CONFIDENTIAL_METADATA`, which maps the `token id` of your EVM NFT to a `ConfidentialMetadata` struct. So for every NFT you mint on EVM, it has an associated private metadata stored in the Secret Contract. Pretty cool, right!&#x20;

{% hint style="info" %}
Note that this is for demo purposes only, if you were doing this in production you should use a more secure way of linking the EVM NFT to the Secret Network sister contract, such as a ZK proof.&#x20;
{% endhint %}

Now let's deploy our EVM Minting contract 😊

### Deploying EVM NFT Contract

`cd` into evm-contract:&#x20;

```bash
cd evm-contract
```

Install the dependencies:&#x20;

```bash
npm i 
```

Create a [`.env` file](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-nft/evm-contract/.env) and add your EVM `PRIVATE_KEY` and [Infura API Key](https://app.infura.io/) for Sepolia testnet:&#x20;

```javascript
PRIVATE_KEY=5766fdksdfldsfjdlfd84749393j0d
INFURA_KEY=7bb38fdsfjddkfjdfaljf9d82
```

Once you have your env file configured, upload the minting contract:

```bash
npx hardhat run scripts/deployNFT.js --network amoy
```

Upon successful upload, a contract address will be returned:&#x20;

```
0x0061b1aecAAe02Ddd3ce9De631a2C817c5be18F8
```

Congrats! You now have a private metadata contract deployed on Secret Network and a minting contract deployed on Amoy testnet! Now let's learn how to use SecretPath to send data confidentially from the EVM to Secret Network 😎

### Sending Cross-Chain Confidential Metadata with SecretPath

It's time to connect your EVM minting contract and your Secret confidential metadata contract to a frontend and SecretPath! You will need to create a Pinata JWT key as well as an OpenAI API key, which is outlined below :D&#x20;

### Setting up the frontend environment

cd into secretpath-nft/frontend and install the dependencies:

```
cd frontend && npm i 
```

Create an [`env`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-nft/frontend/.env) and add the following:

```markdown
# Secret Contract Address and CodeHash
REACT_APP_SECRET_CONTRACT_ADDRESS="your secret contract address"
REACT_APP_SECRET_CODE_HASH="your secret contract codehash"

# EVM Minting Contract Address 
REACT_APP_CONTRACT_ADDRESS="your evm minting contract address"

# SecretPath Address for Amoy
REACT_APP_SECRETPATH_ADDRESS="0x8EaAB5e8551781F3E8eb745E7fcc7DAeEFd27b1f"

# ChainID for Amoy ( hexadecimal)
REACT_APP_CHAIN_ID="0xAA36A7"

# Pinata API Key
REACT_APP_PINATA_JWT="Your Pinata JWT Key"

# OpenAI API Key
REACT_APP_OPENAI_API_KEY="Your OpenAI API Key"
```

{% hint style="info" %}
* Create a Pinata JWT key [here](https://www.pinata.cloud/)
* Create an OpenAI API key [here](https://platform.openai.com/api-keys)
{% endhint %}

Once you have added all of your environment variables, it's time to execute the contracts with our frontend!

### Minting your NFT

We will dive into the SecretPath code shortly, but first, let's create your first cross-chain NFT with SecretPath :D

cd into frontend:

```
cd frontend
```

Then run the program:

```
npm run start
```

The frontend is designed so that the description of your NFT will be sent to OpenAI to as the prompt to generate your NFT image. So choose wisely, or not. 😂

<figure><img src="../../../.gitbook/assets/create nft.png" alt="" width="206"><figcaption></figcaption></figure>

The NFT confidential message and password is stored in your Secret Contract, which is linked to the tokenID of the NFT stored on Ethereum. **Only your unique password can reveal the private metadata.** &#x20;

Once you mint your NFT, navigate to [opensea testnet ](https://testnets.opensea.io/collection/secretnft-12)to see it in all its glory.

Better yet, view the NFT on your frontend to see it paired with the Secret Network sister contract with confidential metadata:&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-06-06 at 11.27.17 AM.png" alt="" width="256"><figcaption></figcaption></figure>

Congrats on minting your first cross-chain encrypted NFT! 🚀

### Putting it all together

Let's walkthrough the minting steps, and then examine the SecretPath code:

1. [Generate an AI image with OpenAI](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L108)&#x20;
2. [Pin the newly generated image with Pinata](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L80) to create the token URI
3. [Mint the NFT on Sepolia](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L150) with your token URI
4. [Send the confidential metadata to your Secret Contract](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L174) with SecretPath&#x20;

The majority of the SecretPath encryption code is boilerplate; you don't need to change a thing!

The only code you are updating is:

* the Secret Network [contract address + codeHash](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L178C5-L179C70)

```javascript
const routing_contract = process.env.REACT_APP_SECRET_CONTRACT_ADDRESS;
const routing_code_hash = process.env.REACT_APP_SECRET_CODE_HASH;
```

* the [`data`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L202) that you pass to the Secret Network sister contract &#x20;

```javascript
  const data = JSON.stringify({
        owner: myAddress,
         token_id: token_id,
            uri: uri,
         private_metadata: secretMessage, 
         password: password
     
       });
```

* and the[ handle](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/frontend/src/components/CreateNFT.js#L259) function that you are calling in the Secret sister contract

```javascript
 const _info = {
      user_key: hexlify(userPublicKeyBytes),
      user_pubkey: user_pubkey,
      routing_code_hash: routing_code_hash,
      task_destination_network: "pulsar-3",
      handle: "execute_store_confidential_metadata",
      nonce: hexlify(nonce),
      payload: hexlify(ciphertext),
      payload_signature: payloadSignature,
      callback_gas_limit: callbackGasLimit,
    };
```

{% hint style="info" %}
The `execute_store_confidential_metadata`handle executes the[ handle in the Secret Network sister contract ](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fc8741fa338dd2f4fe21c9fca11e461c5e96d6d4/secretpath-nft/secret-contract/src/contract.rs#L75)
{% endhint %}

### Summary

SecretPath allows EVM developers to leverage Secret Network as a Confidential Computation Layer (CCL) for EVM-compatible chains, enabling cross-chain NFTs with confidential metadata. This tutorial guides developers through minting an NFT on Sepolia testnet, using a sister contract on Secret Network to store private metadata accessible only via a private password in the Secret Contract. The process includes generating an NFT image with OpenAI, pinning it with Pinata, minting the NFT on Sepolia, and sending confidential metadata to Secret Network using SecretPath.&#x20;

{% hint style="info" %}
Note: the end user of the application is not exposed to Secret Network and is only working directly in the EVM environment. However, the data is fully protected and cannot be viewed by anyone because it is stored in encrypted Secret contracts 😮‍💨
{% endhint %}

If you have any questions or run into any issues, post them on the [Secret Developer Discord ](https://discord.gg/secret-network-360051864110235648)and somebody will assist you shortly.
