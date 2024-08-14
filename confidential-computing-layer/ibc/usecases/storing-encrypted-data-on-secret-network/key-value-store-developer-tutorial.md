---
description: >-
  Learn how to use Secret Network as the confidential computation layer of the
  Cosmos with IBC hooks
---

# Key-Value store Developer Tutorial

### Overview <a href="#overview" id="overview"></a>

Secret Network's Confidential Computation SDK uses IBC hooks to seamlessly handle cross-chain encrypted payloads, which means **Cosmos developers can now encrypt and decrypt messages with a simple token transfer.**&#x20;

{% hint style="info" %}
See fullstack demo for Osmosis Mainnet [here](https://cosmos-ccl-encrypted-payloads-demo.vercel.app/).&#x20;
{% endhint %}

This tutorial explains how to upload your own Key-value store contract on Secret Network, which you can use to encrypt values on Secret Network and transmit them cross-chain from a Cosmos chain of your choice! After this tutorial, you will have the tools you need to encrypt messages on any IBC hooks-enabled Cosmos chain.&#x20;

{% hint style="info" %}
In this example, you will send a token from Osmosis mainnet to Secret Network mainnet to encrypt a `string`🔥
{% endhint %}

### Getting Started <a href="#getting-started" id="getting-started"></a>

To get started, clone the [repository](https://github.com/writersblockchain/cosmos-ccl-sdk):

```
git clone https://github.com/writersblockchain/cosmos-ccl-sdk.git
```

### Configuring Environment Variables

Install the dependencies:&#x20;

```bash
npm install
```

Create an `env` file. Simply update [env.testnet](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/.env.testnet) to omit ".testnet" from the file name and then add your wallet's mnemonics:&#x20;

```purebasic
SECRET_MNEMONIC=""
SECRET_CHAIN_ENDPOINT="https://lcd.mainnet.secretsaturn.net"
SECRET_CHAIN_ID="secret-4"
SECRET_TOKEN="uscrt"


CONSUMER_MNEMONIC=""
CONSUMER_CHAIN_ENDPOINT="https://rpc.osmosis.zone:443"
CONSUMER_CHAIN_ID="osmosis-1"
CONSUMER_TOKEN="uosmo"
CONSUMER_PREFIX="osmo"
CONSUMER_GAS_PRICE="0.25"
CONSUMER_DECIMALS=6
```

{% hint style="info" %}
Note that for our consumer chain, we are using the `endpoint`, `chainID`, `token`, and `prefix` for Osmosis Mainnet. But you could update this for any Cosmos chain that has IBC hooks enabled and a [transfer channel](https://www.mintscan.io/secret/relayers) with Secret Network :smile:
{% endhint %}

### Upload the encryption contract on Secret Network

Now that you have your environment configured, it's time to upload the encryption contract to Secret Network.&#x20;

First, compile the contract:&#x20;

```
make build-mainnet
```

This compiles the contract and creates a `wasm` file in the following directory:&#x20;

```wasm
"./target/wasm32-unknown-unknown/release/gateway_simple.wasm"
```

The files that make up the IBC SDK, including the script to upload the contract to Secret Network, are in [./src](https://github.com/writersblockchain/cosmos-ccl-sdk/tree/main/src).&#x20;

Compile the typescript files so you can execute them with node:&#x20;

```
npm run build
```

Once you run the above command, the typescript files in .`/src` will be compiled as javascript files in `./dist`.&#x20;

Upload and instantiate the encryption contract on Secret Network Mainnet:&#x20;

```bash
node dist/deploy.js
```

In your terminal, a `codeID`, `codeHash`, and `contractAddress` will be returned:&#x20;

```javascript
"code_id": 8882,
"code_hash": "f3c2e28cd1574d128ded60ce967cdb46f7515d807be49127bcc9249c5fd97802",
"address": "secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm"
```

Update [`contracts.json`](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/configs/contracts.json) with your `contractAddress` and `codeHash` accordingly:&#x20;

```javascript
{
    "gateway": {
        "address": "secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm",
        "hash": "d4a018804bf63b6cfd5be52b650368e8ad89f57c66841f6b2da7ee143dfc75fb"
    }
}
```

### Encrypt a payload with Typescript SDK <a href="#encrypt-a-payload" id="encrypt-a-payload"></a>

Now that you have your encryption smart contract uploaded on Secret Network, let's use it to store encrypted messages from Osmosis Mainnet Most of the ECDH cryptography has been abstracted away so there are only a few values you need to change.

The functions in [./src](https://github.com/writersblockchain/cosmos-ccl-sdk/tree/930732c9d0b11d6f394d9d99cccb96380e103881/src) are helper functions that help us configure cross-chain network clients, IBC token transfers, etc. However, there is also an additional function which executes the gateway contract called [execute-gateway.js](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/src/execute-gateway.ts)! **Execute-gateway.js demonstrates sending a token transfer to store an unencrypted as well as an encrypted message.**&#x20;

{% hint style="info" %}
Feel free to update the [strings](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/src/execute-gateway.ts#L44) to be encrypted.&#x20;
{% endhint %}

To encrypt the payload, run `execute-gateway.js`:&#x20;

```bash
node dist/execute-gateway.js
```

This will initiate a Token transfer:&#x20;

```bash
Sending IBC token...
receiver: secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm
token: uosmo
amount: 1
source_channel: channel-88
memo: {"wasm":{"contract":"secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm","msg":{"extension":{"msg":{"store_secret":{"text":"new_text_68ss4"}}}}}}
```

As well as an IBC Acknowledgement response:&#x20;

```bash
Broadcasted IbcTX. Waiting for Ack: Promise { <pending> }
ibc Ack Received!
info ack: {
  packet: {
    sequence: '252',
    source_port: 'transfer',
    source_channel: 'channel-88',
    destination_port: 'transfer',
    destination_channel: 'channel-1',
    data: Uint8Array(887) [
      123,  34,  97, 109, 111, 117, 110, 116,  34,  58,  34,  49,
       34,  44,  34, 100, 101, 110, 111, 109,  34,  58,  34, 117,
       97, 120, 108,  34,  44,  34, 109, 101, 109, 111,  34,  58,
       34, 123,  92,  34, 119,  97, 115, 109,  92,  34,  58, 123,
       92,  34,  99, 111, 110, 116, 114,  97,  99, 116,  92,  34,
       58,  92,  34, 115, 101,  99, 114, 101, 116,  49, 113,  48,
      109, 121,  99,  99, 108, 117,  57,  50,  55, 117,  53, 109,
       48, 116, 110,  53,  48, 122, 103, 108,  53,  97, 102,  52,
      117, 116, 114, 108,
      ... 787 more items
    ],
    timeout_height: { revision_number: '0', revision_height: '0' },
    timeout_timestamp: '1722277043000000000'
  },
```

Congrats! You have now used the Secret Network CCL SDK to encrypt a `string` on Osmosis Mainnet!

### Encryption SDK - how it works <a href="#encrypt-a-payload" id="encrypt-a-payload"></a>

Now that you have used Secret Network's CCL SDK to successfully encrypt a `string` cross-chain,  let's examine the [gateway smart contract ](https://github.com/writersblockchain/cosmos-ccl-sdk/tree/main/contracts/gateway-simple)you deployed on Secret Network to understand how everything works underneath the hood.&#x20;

At a high level, you can think of the SDK like so:&#x20;

1. There is a gateway contract deployed to Secret Network, which has the ability to encrypt a `string`, as well as query the encrypted `string`.&#x20;
2. The gateway contract imports helper functions from the [SDK](https://github.com/writersblockchain/cosmos-ccl-sdk/tree/main/packages/sdk/src), which is where the gateway contract imports encryption and query types, etc.&#x20;

{% hint style="info" %}
You can add additional functionality to the gateway contract as you see fit. For example, you could write an execute message that stores encrypted votes or encrypted NFTs, etc!&#x20;

To use the SDK's encryption helper functions, simply write your gateway contract messages inside of the [`InnerMethods` enum ](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/contracts/gateway-simple/src/msg.rs#L14C1-L17C1), which imports [GatewayExecuteMsg](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/gateway.rs#L9) from the SDK :)&#x20;
{% endhint %}

Now let's examine each of the gateway contract's files to understand how it encrypts a user-inputted `string`.

### state.rs

[state.rs](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/contracts/gateway-simple/src/state.rs) is where we define the `keymap` that holds our encrypted `strings.` The `keymap SECRETS` is designed to store a mapping from account user addresses (as strings) to their secrets (also as strings), using the Bincode2 serialization format.

### msg.rs

[msg.rs](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/contracts/gateway-simple/src/msg.rs) is where we define the functionality of our gateway contract. **It has 2 primary functionalities: storing encrypted strings and querying encrypted strings.** Note that the types `ExecuteMsg` and `QueryMsg` are defined in the SDK [here](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/gateway.rs#L9).&#x20;

* **GatewayExecuteMsg**: Defines execution messages that can be sent to the contract, including resetting an encryption key, sending encrypted data, and extending with additional message types.
* **GatewayQueryMsg**: Defines query messages that can be sent to the contract, including querying for an encryption key, querying with authentication data, querying with a permit, and extending with additional query types.

### contract.rs

[contract.rs](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/contracts/gateway-simple/src/contract.rs) contains the smart contract logic which allows the following:&#x20;

* **Execution**: Processes messages to reset the encryption key or store a secret, ensuring only authorized access.
* **Querying**: Handles queries to retrieve the encryption key and perform permissioned queries.&#x20;

The encryption logic, `handle_encrypted_wrapper`, is imported from the SDK at [line 55](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/contracts/gateway-simple/src/contract.rs#L55). **This is where the encryption magic happens** ⭐.&#x20;

You can review the function in the SDK [here](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/common/handle.rs#L52). It has the following functionality:&#x20;

1. Check if Message is Encrypted:
   * If the message is encrypted (`msg.is_encrypted()`), it proceeds with decryption.
2. Extract Encryption Parameters:
   * Retrieves the encryption parameters from the message (`msg.encrypted()`).
3. Check Nonce:
   * Ensures the nonce has not been used before to prevent replay attacks.
4. Load Encryption Wallet:
   * Loads the encryption wallet from storage.
5. Decrypt Payload:
   * Decrypts the payload using the wallet and the provided parameters (`payload`, `user_key`, and `nonce`).

```rust
      let decrypted  = wallet.decrypt_to_payload(
            &params.payload,
            &params.user_key,
            &params.nonce,
        )?;
```

{% hint style="info" %}
[decrypt\_to\_payload](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/crypto/wallets.rs#L177) uses chacha20poly1305 algorithm
{% endhint %}

6. Verify Credentials:

* Constructs a `CosmosCredential` from the decrypted data.
* Inserts the nonce into storage to mark it as used.
* Verifies the sender using the `verify_arbitrary` function with the credential.

7. Deserialize Inner Message:

* Converts the decrypted payload into the original message type `E`.
* Ensures the decrypted message is not encrypted (nested encryption is not allowed).

8. Return Decrypted Message and Updated Info:

* Returns the decrypted message and updated `MessageInfo` with the verified sender.

### Summary

In this tutorial, you learned how to utilize Secret Network's Confidential Computation SDK to encrypt and decrypt messages across Cosmos chains using IBC hooks. By following the steps outlined, you successfully:

1. Configured the development environment with the necessary dependencies and environment variables.
2. Uploaded and instantiated an encryption contract on the Secret Network mainnet.
3. Encrypted and transmitted a payload from the Osmosis Mainnet to the Secret mainnet using IBC token transfers.

With these tools and knowledge, you are now equipped to handle cross-chain encrypted payloads on any IBC hooks-enabled Cosmos chain, enhancing the security and confidentiality of your blockchain applications.
