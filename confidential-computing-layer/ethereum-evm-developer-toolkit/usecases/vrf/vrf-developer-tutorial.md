---
description: >-
  Learn how to use SecretPath on EVM to access on-chain verifiable random
  numbers.
---

# VRF Developer Tutorial

## Overview

[SecretVRF](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness) over SecretPath enables EVM developers to access **on-chain verifiable random numbers** at a fraction of the cost and block time of traditional RNG oracles such as ChainlinkVRF. With fewer than 100 lines of code, you will have access to an infinite supply of randomness.&#x20;

{% hint style="info" %}
See a fullstack cross-chain SecretVRF demo [here](https://secretpath-ballz.vercel.app/)
{% endhint %}

{% hint style="info" %}
To learn how SecretVRF works underneath the hood, refer to the docs [here](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness). 🤓
{% endhint %}

### Getting Started   &#x20;

To get started, clone the [Secret Labs examples repo](https://github.com/scrtlabs/examples):&#x20;

```bash
git clone https://github.com/scrtlabs/examples.git
```

### EVM Prerequisites&#x20;

1. [Add Polygon Amoy testnet to Metamask.](https://support.polygon.technology/support/solutions/articles/82000907114-how-to-add-amoy-network-in-your-wallet-)
2. [Fund your Amoy wallet](https://www.alchemy.com/faucets/polygon-amoy).&#x20;

### Configuring Environment Variables

`cd` into examples/EVM-secretpath-RNG:

```bash
cd examples/EVM-secretpath-RNG
```

Install the node dependencies:

```bash
npm install
```

Update the `env` file with your EVM wallet private key and [Infura](https://www.infura.io/) API key.

{% hint style="info" %}
Make sure your Infura API key is configured for Amoy testnet 😎
{% endhint %}

### Upload & Instantiate RandomnessReceiver.sol

Compile your Solidity smart contract:&#x20;

```bash
npx hardhat compile
```

Once the contract is compiled successfully, upload the contract to Polygon testnet:&#x20;

<pre class="language-bash"><code class="lang-bash"><strong>npx hardhat run scripts/deploy.js --network polygon
</strong></code></pre>

Note the contract address:

<pre class="language-bash"><code class="lang-bash"><strong>RandomnessReceiver deployed to: 0x08D05bC52e503C68c38A32c1fA997FB521e614C4
</strong></code></pre>

&#x20;Add the `RandomnessReceiver` contract address to your `env` file:

```bash
RANDOMNESS_RECEIVER_CONTRACT_ADDRESS="0x08D05bC52e503C68c38A32c1fA997FB521e614C4"
```

### Execute RandomnessReceiver.sol

Now that you've uploaded your contract, it's time to set the SecretPath gateway address for Polygon Amoy and then request on-chain verifiable random numbers!

{% hint style="info" %}
Gateways are the on-chain smart contracts that handle the broadcasting, receipt, packaging, and verification of messages.
{% endhint %}

#### Set Gateway Contract

First, set the gateway address for Polygon Amoy testnet. You can do this by executing `set_gateway.js`:

```bash
npx hardhat --network polygon run ./scripts/set_gateway.js
```

{% hint style="info" %}
This tutorial is for Polygon testnet, but you can find a list of additional EVM gateway contract addresses [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/connecting-evm-with-snakepath-on-chain-randomness/gateway-contracts).
{% endhint %}

#### Create Randomness Event Listener

Next, create an event listener so you can listen to when the random numbers that you request have been fulfilled.&#x20;

Open a new terminal window and `cd` into `examples/EVM-secretpath-RNG:`

```basic
cd examples/EVM-snakepath-RNG
```

Then, create the event listener by executing `fulfill_randomness_event.js`:&#x20;

```bash
npx hardhat --network polygon run ./scripts/fulfill_randomness_event.js
```

#### Request Random Numbers

Now it's time to request random numbers! Currently, `request_random.js` is configured to **request 3 random numbers**, but you can update how many numbers you would like to request [here](https://github.com/scrtlabs/examples/blob/36bef1bf5d69768e889919988da79e0c5603a917/EVM-snakepath-RNG/scripts/request\_random.js#L25) (up to 2000 for this example).&#x20;

Once you have configured how many random numbers you want to request, execute `request_random.js`:&#x20;

```bash
npx hardhat --network polygon run ./scripts/request_random.js
```

Upon successful execution, your terminal will log the following:&#x20;

```bash
Current gas price: 1.500000016 gwei
Amount of gas: 202500002160000
Transaction hash: 0x47efe733c6b64a5c65fae68a5fa0f2eb39be107a7d4930325104dfcee36474c2
Random Numbers requested successfully!
```

Navigate to your event listener terminal to see the returned random numbers:&#x20;

{% code overflow="wrap" %}
```atom
Random numbers fulfilled for request ID: 7
Random Numbers: 94412630379044474934232934838909700375960606882138821083837396872559692127250,113337239238407277551866961530595655396141218773986266698805816049961297644274,27422614896457590254145871678336430245204859898445275988406473498974116581231
```
{% endcode %}

Congrats! You've just used SecretPath to request your first verifiable on-chain random numbers! 🎉&#x20;

### Conclusion

Secret VRF offers an innovative and cost-effective solution for EVM developers seeking access to verifiable random numbers. By following this guide, you've successfully set up your environment, deployed the `RandomnessReceiver.sol` contract, and interacted with the SecretPath network to request and receive random numbers.  Dive into the world of decentralized randomness with SecretPath, where security meets simplicity. 🌟

##
