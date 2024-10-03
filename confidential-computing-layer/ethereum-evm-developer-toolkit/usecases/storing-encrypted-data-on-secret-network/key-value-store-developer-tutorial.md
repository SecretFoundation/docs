---
description: Learn how to use SecretPath on EVM to encrypt payloads.
---

# Key-Value store Developer Tutorial

## Overview

SecretPath seamlessly handles encrypted payloads on the EVM, which means EVM developers can use SecretPath to encrypt and decrypt messages cross-chain with little-to-no Rust experience required.&#x20;

{% hint style="info" %}
Check out the Key Value store demo [here](https://evm-kv-store-demo.vercel.app/) to see what you will build :smile:
{% endhint %}

This tutorial explains how to:

1. **Upload your own Key-value store contract on Secret Network**
2. &#x20;**Encrypt data on the EVM and transmit encrypted data cross-chain to Secret Network**
3. **Connect your key value store contract to a React frontend.**&#x20;

After this tutorial, you will have the tools you need to use SecretPath to encrypt messages on any [EVM-compatible chain](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/evm-testnet-gateway-contracts).&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-10-03 at 10.50.35 PM.png" alt="" width="375"><figcaption></figcaption></figure>

## Getting Started

To get started, clone the EVM key value store repository:

```bash
git clone https://github.com/writersblockchain/evm-kv-store-demo.git
```

### Configuring Environment

`cd` into secret-contract/node

```bash
cd secret-contract/node
```

Install the dependencies:

```bash
npm install
```

### Upload the Key-value contract to Secret Network

In the `node` folder, open the upload.js file and review the instantiate message at [line 56](https://github.com/writersblockchain/evm-kv-store-demo/blob/3d6a6ab6f609755c3aa0b6d83bbe8851f502f11c/secret-contract/node/upload.js#L56):&#x20;

```javascript
 let init = {
    gateway_address: gatewayAddress,
    gateway_hash: gatewayHash,
    gateway_key: gatewayPublicKeyBytes,
  };
```

* `gatewayAddress` is the SecretPath gateway contract address for testnet
* `gatewayHash` is the SecretPath gateway contract hash for testnet
* `gatewayKey` is public key used for SecretPath encryption on Secret testnet

{% hint style="warning" %}
These three parameters remain constant and must be passed for every Secret Network contract that implements SecretPath. They can be found [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/secretpath-testnet-pulsar-3-contracts) for testnet.&#x20;
{% endhint %}

To upload and instantiate the contract, run `node upload`:&#x20;

```bash
node upload
```

Upon successful upload, a `contractHash` and `address` will be returned:&#x20;

```javascript
codeId:  5701
Contract_hash: "6311a3f85261fc720d9a61e4ee46fae1c8a23440122b2ed1bbcebf49e3e46ad2"
contract_address:  "secret1j0gpu6tlwnc9fw55wcfsfuml00kqpcnqz7dck7"
```

{% hint style="info" %}
If you want to make any changes to the Secret smart contract before uploading it to Secret Network, you can do that too! Simply update the contract and then compile it by running `make build-mainnet:`&#x20;

```bash
make build-mainnet
```

The compiled contract, called `contract.wasm.gz`, will be outputted in the secret-contract folder.&#x20;
{% endhint %}

### Encrypt a payload

Now that you have your key value store smart contract uploaded to Secret Network, let's use it to store  encrypted messages passed from the EVM. Most of the ECDH cryptography has been abstracted away so there are only a few values you need to change.&#x20;

`cd` into evm-kv-store-demo/kv-store-frontend:

```bash
cd evm-kv-store-demo/kv-store-frontend
```

Install the dependencies:&#x20;

```bash
npm i
```

Open [`.env` ](https://github.com/writersblockchain/evm-kv-store-demo/blob/main/kv-store-frontend/.env)and change the `routing_contract` and `routing_code_hash` to the address and code hash for your contract:&#x20;

```javascript
REACT_APP_SECRET_ADDRESS="secret1neeyum9p9h6u0d5jkxlqx9w5nrz49hzrr63jsw"
REACT_APP_CODE_HASH="6994d8ff9ed1af73ef4685a9f5c8a5568804afb5fa5ce49ec8496fb271a9760a"
```

That's it! You dApp is now connected to your Secret smart contract and ready to encrypt key value pairs. To start the application, run:&#x20;

```bash
npm run start
```

Congrats! You now have now deployed a fullstack cross-chain decentralized application that passes encrypted key-value pairs from the EVM and stores them on Secret Network :tada:&#x20;

### SecretPath - a deep dive :woman\_swimming:

Now that you have successfully uploaded a key-value contract to Secret Network and connected it to a React frontend, let's examine the code to understand how SecretPath passes encrypted data from the EVM to Secret Network.&#x20;

From a high-level, all that you need to know is there is a **public** SecretPath contract deployed on every EVM chain listed [here](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks), which communicates with a **private** SecretPath contract deployed on Secret Network, **and** **it is these public/private contract pairs that encrypt your data and pass messages from the EVM to Secret Network.**&#x20;

When you create your cross-chain dApp, you simply need to **format your data** **so that it can be transmitted successfully from the public SecretPath contract to the private SecretPath contract**.&#x20;

All of the data formatting for the public EVM contract happens in [submit.js](https://github.com/writersblockchain/evm-kv-store-demo/blob/main/kv-store-frontend/src/functions/submit.js). This is almost entirely boilerplate code except for the variables [`handle`](https://github.com/writersblockchain/evm-kv-store-demo/blob/3d6a6ab6f609755c3aa0b6d83bbe8851f502f11c/kv-store-frontend/src/functions/submit.js#L30) and [`data`](https://github.com/writersblockchain/evm-kv-store-demo/blob/3d6a6ab6f609755c3aa0b6d83bbe8851f502f11c/kv-store-frontend/src/functions/submit.js#L33):

```javascript
  // The function name of the function that is called on the private contract
  const handle = "store_value";

  // Data are the calldata/parameters that are passed into the contract
  const data = JSON.stringify({
    key: key,
    value: value,
    viewing_key: viewing_key
  });
```

`handle` is the name of the function that we are executing in our private Secret smart contract, and `data` is the data that we pass to the function that we are executing in the Secret contract, which in the case of the key value contract is `key,` `value,` and `viewing_key.`&#x20;

Let's now look at the Secret Network contract that we uploaded to better understand the `store_value` function and how it uses the parameters `key,` `value,` and `viewing_key.`

#### Understanding the Private (Secret) Contract

At[ line 109](https://github.com/writersblockchain/evm-kv-store-demo/blob/3d6a6ab6f609755c3aa0b6d83bbe8851f502f11c/secret-contract/src/contract.rs#L109), we have a `match` statement, which includes the handle `"store_value":`

```rust
 // determine which function to call based on the included handle
    let handle = msg.handle.as_str();
    match handle {
        "store_value" => store_value(deps, env, msg.input_values, msg.task, msg.input_hash),
        "retrieve_value" => retrieve_value(deps, env, msg.input_values, msg.task, msg.input_hash),
        "change_value" => change_value(deps, env, msg.input_values, msg.task, msg.input_hash),
        _ => Err(StdError::generic_err("invalid handle".to_string())),
    }
```

Since we pass the handle `store_value` from your dApp to your Secret contract, it knows to execute the `store_value` function!&#x20;

Inside of the `store_value` function, we use the `key,` `value,` and `viewing_key` parameters that we pass from the EVM in order to create a key map with our key-value pairs:&#x20;

```rust
let input: InputStoreMsg = serde_json_wasm::from_str(&input_values)
        .map_err(|err| StdError::generic_err(err.to_string()))?;
  
  // create a task information store
    let storage_item = StorageItem {
        value: input.value,
        viewing_key: input.viewing_key,
    };
    
  // map task to task info
    KV_MAP.insert(deps.storage, &input.key, &storage_item)?;
```

This data is encrypted and stored inside of your Secret smart contract. The data can now only be revealed with a query that uses the proper `viewing_key:`

```javascript
const secretjs = new SecretNetworkClient({
                url: "https://lcd.testnet.secretsaturn.net",
                chainId: "pulsar-3",
            });

            const query_tx = await secretjs.query.compute.queryContract({
                contract_address: process.env.REACT_APP_SECRET_ADDRESS,
                code_hash: process.env.REACT_APP_CODE_HASH,
                query: {
                    retrieve_value: {
                        key: key,
                        viewing_key: viewingKey
                    }
                },
            });
```

{% hint style="info" %}
You can view the frontend component for querying your Secret contract [here](https://github.com/writersblockchain/evm-kv-store-demo/blob/main/kv-store-frontend/src/components/Query.js)! :smile:
{% endhint %}

### Summary

In this tutorial, you've learned how to deploy a key-value store smart contract on Secret Network, encrypt and transmit messages from an EVM-compatible chain, and integrate the contract with a React frontend. Using SecretPath, you can now seamlessly handle encrypted payloads cross-chain with minimal Rust experience. By following the steps outlined, you're equipped to build decentralized applications that leverage SecretPath for secure, cross-chain communication and data storage.

{% hint style="info" %}
If you have any questions or run into any issues, post them on the [Secret Developer Discord ](https://discord.gg/secret-network-360051864110235648)and somebody will assist you shortly.
{% endhint %}
