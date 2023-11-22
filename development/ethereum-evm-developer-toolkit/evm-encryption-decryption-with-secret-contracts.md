---
description: >-
  Learn how to encrypt a message on EVM and decrypt it in a Secret Network
  contract using Axelar GMP.
---

# EVM Encryption/Decryption with Secret Contracts

_Note: These docs are currently in progress. 11/21/23_

## EVM Encryption with Secret Network

In this tutorial you will learn how to encrypt a message on Polygon testnet and decrypt the message in a Secret contract using a combination of the Advanced Encryption Standard (AES), Elliptic-curve Diffie–Hellman (ECDH) asynchronous key agreement, and Axelar GMP. This opens up a whole new standard of cross-chain use cases such as private voting, private auctions, and anything you can imagine that utilizes cross-chain encryption! By the end of this tutorial you will learn how to use Secret contracts to send and receive private data to and from Ethereum. Let's dive in! 🏊

### EVM Prerequisites &#x20;

Clone the Secret Labs examples repo:&#x20;

```bash
git clone https://github.com/scrtlabs/examples.git
```

`cd` into ./examples/EVM-encrypt-decrypt/polygon:

```bash
cd EVM-encrypt-decrypt/polygon
```

Install the node dependencies:&#x20;

```bash
npm install 
```

Create a `.env` file and add your Metamask private key + Infura API key like so:&#x20;

<figure><img src="../../.gitbook/assets/EVM env file.png" alt=""><figcaption><p>EVM .env file</p></figcaption></figure>

{% hint style="info" %}
* Learn how to view your Metamask private key [here](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) and create an Infura API key [here](https://www.infura.io/).&#x20;
* These environment variables are used in the [hardhat.config.js](https://github.com/scrtlabs/examples/blob/master/EVM-encrypt-decrypt/polygon/hardhat.config.js) file in order to execute a smart contract deployed on Polygon testnet. If you need polygon testnet tokens to execute the contract, refer to the Polygon Mumbai faucet [here](https://faucet.polygon.technology/).&#x20;
{% endhint %}

Now you are ready to encrypt a message on Polygon testnet and send it to Secret testnet to be decrypted! 🎉&#x20;

### Execute Polygon Contract

Now that you have your Ethereum environment properly configured, you can encrypt a message of your choosing and send it to a Secret Network smart contract where it will be decrypted.&#x20;

Open the file [`encrypt.js`](https://github.com/scrtlabs/examples/blob/master/EVM-encrypt-decrypt/polygon/scripts/encrypt.js)  in ./EVM-encrypt-decrypt/polygon/scripts/encrypt.js.&#x20;

{% hint style="info" %}
`encrypt.js` generates a private key, creates a shared secret via ECDH, encrypts a message with this shared secret, and then executes a Polygon testnet smart contract to send the encrypted data to a Secret Network testnet smart contract using Axelar GMP.&#x20;
{% endhint %}

Next, update the `msg` variable at [line 52](https://github.com/scrtlabs/examples/blob/ce83c3f4f313820d0f7510b31f1243d70a2a3d4f/EVM-encrypt-decrypt/polygon/scripts/encrypt.js#L52) with a message of your choosing which will be encrypted.&#x20;

Then, execute the Polygon smart contract to encrypt the message and send it to a Secret smart contract:&#x20;

```bash
npx hardhat --network polygon run ./scripts/encrypt.js
```

