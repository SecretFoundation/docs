---
description: >-
  Learn how to use Secret Network as the confidential computation layer of the
  Cosmos with IBC hooks
---

# Key-Value store Developer Tutorial

{% hint style="danger" %}
_This documentation is curently in progress, 7/29/24_
{% endhint %}

### Overview <a href="#overview" id="overview"></a>

Secret Network's Confidential Computation SDK uses IBC hooks to seamlessly handle cross-chain encrypted payloads, which means **Cosmos developers can now encrypt and decrypt messages with a simple token transfer.**&#x20;

This tutorial explains how to upload your own Key-value store contract on Secret Network, which you can use to encrypt values on the Cosmos chain of your choice, as well as how to encrypt payloads and transmit them cross-chain. After this tutorial, you will have the tools you need to encrypt messages on any IBC hooks-enabled Cosmos chain.&#x20;

{% hint style="info" %}
In this example, you will send a token from Axelar testnet to Secret testnet to encrypt a `string`🔥
{% endhint %}

### Getting Started <a href="#getting-started" id="getting-started"></a>

To get started, clone the repository:

```
git clone https://github.com/writersblockchain/cosmos-ccl-sdk/tree/main
```

### **Prerequisities**&#x20;

1. **Get Axelar testnet tokens from** [**faucet**](https://faucet.testnet.axelar.dev/)
2. **Get Secret testnet tokens from** [**faucet**](https://faucet.pulsar.scrttestnet.com/)

### Configuring Environment Variables

Install the dependencies:&#x20;

```bash
npm install
```

Create an `env` file. Simply update [env.testnet](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/.env.testnet) to omit ".testnet" from the file name and then add your wallet's mnemonics:&#x20;

```purebasic
SECRET_MNEMONIC="grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar"
SECRET_CHAIN_ENDPOINT="https://lcd.testnet.secretsaturn.net"
SECRET_CHAIN_ID="pulsar-3"
SECRET_TOKEN="uscrt"

CONSUMER_MNEMONIC="jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow"
CONSUMER_CHAIN_ENDPOINT="https://lcd-axelar-testnet.imperator.co"
CONSUMER_CHAIN_ID="axelar-testnet-lisbon-3"
CONSUMER_TOKEN="uaxl"
CONSUMER_PREFIX="axelar"
```

{% hint style="info" %}
Note that for our consumer chain, we are using the `endpoint`, `chainID`, `token`, and `prefix` for Axelar testnet. But you could update this for any Cosmos chain that has IBC hooks enabled and a transfer channel with Secret Network :smile:
{% endhint %}

### Upload the encryption contract on Secret Network

Now that you have your environment configured, it's time to upload the encryption contract to Secret Network testnet.&#x20;

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

Upload and instantiate the encryption contract on Secret Network testnet:&#x20;

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

### Encrypt a payload <a href="#encrypt-a-payload" id="encrypt-a-payload"></a>

Now that you have your encryption smart contract uploaded on Secret Network, let's use it to store encrypted messages from Axelar. Most of the ECDH cryptography has been abstracted away so there are only a few values you need to change.

[execute-gateway.js](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/main/src/execute-gateway.ts) demonstrates sending a token transfer to store an unencrypted as well as an encrypted message. Feel free to update the strings to be encrypted.&#x20;

To encrypt the payload, run `execute-gateway.js`:&#x20;

```bash
node dist/execute-gateway.js
```

Token transfer:&#x20;

```bash
Sending IBC token...
receiver: secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm
token: uaxl
amount: 1
source_channel: channel-311
memo: {"wasm":{"contract":"secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm","msg":{"extension":{"msg":{"store_secret":{"text":"new_text_68ss4"}}}}}}
```

IBC Acknowledgement response:&#x20;

```bash
Broadcasted IbcTX. Waiting for Ack: Promise { <pending> }
ibc Ack Received!
info ack: {
  packet: {
    sequence: '252',
    source_port: 'transfer',
    source_channel: 'channel-311',
    destination_port: 'transfer',
    destination_channel: 'channel-3',
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

Congrats! You have now used the Secret Network CCL SDK to encrypt a `string` on Axelar testnet!

### Summary

In this tutorial, you learned how to utilize Secret Network's Confidential Computation SDK to encrypt and decrypt messages across Cosmos chains using IBC hooks. By following the steps outlined, you successfully:

1. Configured the development environment with the necessary dependencies and environment variables.
2. Uploaded and instantiated an encryption contract on the Secret Network testnet.
3. Encrypted and transmitted a payload from the Axelar testnet to the Secret testnet using IBC token transfers.

With these tools and knowledge, you are now equipped to handle cross-chain encrypted payloads on any IBC hooks-enabled Cosmos chain, enhancing the security and confidentiality of your blockchain applications.
