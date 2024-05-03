---
description: >-
  Learn how to use SecretPath on EVM to access on-chain verifiable random
  numbers.
---

# VRF Developer Tutorial

## Overview

[SecretVRF](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness) over SecretPath enables EVM developers to access **on-chain verifiable random numbers** at a fraction of the cost and block time of traditional RNG oracles such as ChainlinkVRF. With fewer than 100 lines of code, you will have access to an infinite supply of randomness.&#x20;

{% hint style="info" %}
To learn how SecretVRF works underneath the hood, refer to the docs [here](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness). 🤓
{% endhint %}

### Getting Started   &#x20;

To get started, clone the [Secret Labs examples repo](https://github.com/scrtlabs/examples):&#x20;

```bash
git clone https://github.com/scrtlabs/examples.git
```

### EVM Prerequisites&#x20;

1. [Add Polygon Mumbai testnet to Metamask](https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/).
2. [Fund your Mumbai wallet](https://faucet.polygon.technology/).&#x20;

### Configuring Environment Variables

`cd` into [examples/EVM-snakepath-RNG](https://github.com/scrtlabs/examples/tree/master/EVM-snakepath-RNG):

```bash
cd examples/EVM-snakepath-RNG
```

Install the node dependencies:

```bash
npm install
```

Update the `env` file with your EVM wallet private key and [Infura](https://www.infura.io/) API key.

{% hint style="info" %}
Make sure your Infura API key is configured for Polygon Matic testnet 😎
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

Now that you've uploaded your contract, it's time to set the SecretPath gateway address for Polygon Mumbai and then request on-chain verifiable random numbers!

{% hint style="info" %}
Gateways are the on-chain smart contracts that handle the broadcasting, receipt, packaging, and verification of messages.
{% endhint %}

#### Set Gateway Contract

First, set the gateway address for Polygon Mumbai testnet. You can do this by executing `set_gateway.js`:

```bash
npx hardhat --network polygon run ./scripts/set_gateway.js
```

{% hint style="info" %}
This tutorial is for Polygon testnet,, but you can find a list of additional EVM gateway contract addresses [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/connecting-evm-with-snakepath-on-chain-randomness/gateway-contracts).
{% endhint %}

#### Create Randomness Event Listener

Next, create an event listener so you can listen to when the random numbers that you request have been fulfilled.&#x20;

Open a new terminal window and `cd` into `examples/EVM-snakepath-RNG:`

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

{% hint style="info" %}
If you don't see your random numbers returned, it means that our testnet relayer might have dropped the transaction. **See below to learn how to relay your transaction manually.**&#x20;
{% endhint %}

#### Execute SecretPath Manually with Polygonscan

To relay your random numbers manually, you can use Polygonscan and Secret.js!

After you execute `request_random.js` and have a `task_id` returned, you can now execute `query_secret_network` for the given `task_id.`&#x20;

Open `query_secret_network.js`  and update the [`task_id`](https://github.com/scrtlabs/examples/blob/36bef1bf5d69768e889919988da79e0c5603a917/EVM-snakepath-RNG/scripts/query\_secret\_network.js#L23) to your `task_id`. Then execute `query_secret_network.js`:&#x20;

```bash
npx hardhat --network polygon run ./scripts/query_secret_network.js
```

The query will return info about your transaction for the given `task_id`:&#x20;

```json
{
  source_network: 'pulsar-3',
  task_destination_network: '80001',
  task_id: '5',
  payload_hash: '0xad5f42b51c2d755f5427f6373a7398b9b24ba68baa17dc590f05bb83f3e0f940',
  result: '0xe4b051f8e4407a7b44a170cfed845b98ba9db0864e2c43eef3009d42c0e5ed05a1f2023d5de167f4f9b2c8646992b65098af109ea076f9e2d128e8975e54dfaa90d1502c126a8a672bccb3c4d69034b8eb8cc5f8f96e0e9b1ad39b27b7e6552d',
  packet_hash: '0x5fb0bb5e85357373b84f92b95f41cb404385165d46a58af9470bf13eb2648f7b',
  packet_signature: '0x815823bda4562ba7411ec5bf2de492bb377a808c1c0b17a0dfa6f5729c23af222c76e46531cee78e94730fa4a63426eb20de0cfd9389cdc45407e12a1c8ed3d51b',
  callback_address: '0x08d05bc52e503c68c38a32c1fa997fb521e614c4',
  callback_selector: '0x38ba4614',
  callback_gas_limit: '0x00015f90'
}
```

Now, open [Polygonscan for the Mumbai proxy contract](https://mumbai.polygonscan.com/address/0x5e16dbd2728d66b4189b2e3aab71837683dfd2d7#writeProxyContract) and then input the returned query info into the `postExecution` field:&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-01-31 at 2.16.24 PM.png" alt=""><figcaption></figcaption></figure>

Once you have entered your transaction info, select "Write" to execute the transaction.&#x20;

Congrats! You've just used SecretPath to request your first verifiable on-chain random numbers! 🎉&#x20;

### Conclusion

Secret VRF offers an innovative and cost-effective solution for EVM developers seeking access to verifiable random numbers. By following this guide, you've successfully set up your environment, deployed the `RandomnessReceiver.sol` contract, and interacted with the SecretPath network to request and receive random numbers.  Dive into the world of decentralized randomness with SecretPath, where security meets simplicity. 🌟

##
