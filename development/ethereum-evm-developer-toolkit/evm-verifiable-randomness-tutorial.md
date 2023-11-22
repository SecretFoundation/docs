---
description: >-
  Learn how to use Secret VRF to send verifiable random numbers to
  EVM-compatible chains with Axelar GMP
---

# EVM Verifiable Randomness Tutorial

## Ethereum 🤝 SecretRNG

The ability to generate fair and verifiable random numbers on blockchain without compromising security or usability is critical for many decentralized applications. There have been attempts to solve this problem by various methods, such as using random data from external sources (the hash of a previous block, etc) or by using off-chain solutions, such as Chainlink’s VRF oracle, but these solutions are not optimal as they are either deterministic, rely on trusted parties, and/or require additional fees for gas and infrastructure. What is needed is a verifiable random number generator that exists on-chain, and is accessible across developer ecosystems, and this is now possible through the use of **Secret Network Random Number Generator (RNG) + Axelar GMP.**&#x20;

In this tutorial, you will learn how to use Axelar GMP to send an array of verifiable random numbers from **Secret to Polygon**. Let's get started!

### Prerequisites

{% hint style="info" %}
[See here for prerequisites](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/evm-general-message-passing#prerequisites) to follow along with this tutorial.&#x20;
{% endhint %}

### Upload ReceiveRandom.sol Contract to Polygon

In order to receive random numbers from a smart contract on Secret network, you must first upload and instantiate a smart contract on Polygon that can execute messages using Axelar GMP.  We will be uploading the [ReceiveRandom.sol ](https://github.com/scrtlabs/examples/blob/master/EVM-GMP-RNG/polygon/contracts/ReceiveRandom.sol)contract to Polygon for this demo, which is designed to receive an `array` of `bytes`.&#x20;

To upload the contract, we will use [Remix Online IDE](https://remix.ethereum.org), which is a powerful toolset for developing, deploying, debugging, and testing Ethereum and EVM-compatible smart contracts.

First, navigate to Remix and create a new blank workspace:

<figure><img src="../../.gitbook/assets/remix.png" alt=""><figcaption><p>Remix workspace</p></figcaption></figure>

Next, create a new file called `ReceiveRandom.sol` and [paste the solidity code.](https://github.com/scrtlabs/examples/blob/master/EVM-GMP-RNG/polygon/contracts/ReceiveRandom.sol) This will autofill your workspace with the necessary dependencies for your ReceiveRandom.sol contract 🤯

Now all that's left is to **compile and upload the contract**. Navigate to the Solidity compiler using the sidebar and click **"Compile ReceiveRandom.sol"**. Then, navigate to "Deploy and run transactions." Toggle the Environment from "Remix VM (Shanghai)" to "Injected Provider - MetaMask" and make sure that in your MetaMask wallet **you have currently selected Polygon testnet Mumbai network**.&#x20;

The `constructor` of ReceiveRandom.sol contains 3 variables that you must now input in order to instantiate the contract and link it to [Axelar's Polygon](https://docs.axelar.dev/dev/reference/testnet-contract-addresses) **gateway contract** and **gas receiver contract**, as well as the Polygon **chain name**:&#x20;

```bash
GATEWAY CONTRACT: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B"
GASRECEIVER CONTRACT: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
CHAINNAME: "Polygon"
```

Input these strings like so and then click "Transact":

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-11 at 4.57.52 PM.png" alt=""><figcaption><p>ReceiveRandom.soll constructor</p></figcaption></figure>

Upon successful instantiation, the contract address will be returned in the Remix terminal, which you can then [view on Polygonscan.](https://mumbai.polygonscan.com/address/0x4396a9F3b1962bC7277fC44a78AA5c57e8966978) And the deployed contract can now be interacted with in the "Deployed Contracts" window:&#x20;

<figure><img src="../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

Congrats, you've just deployed an Axelar GMP-compatible contract to Polygon testnet that can **receive verifiable random numbers** from a Secret Network smart contract 🎉

### Upload a contract to Secret Network

Now that you've uploaded a GMP-compatible contract to Polygon, let's do the same on Secret Network so that the contracts can communicate with each other across the Cosmos!

First, clone this Secret Network examples repository:&#x20;

```bash
git clone https://github.com/scrtlabs/examples
```

Then, `cd` into the `examples/EVM-GMP-RNG/secret_network/` folder

```bash
cd examples/EVM-GMP-RNG/secret_network/
```

and compile the contract by running `make build-mainnet` in your terminal.

```bash
make build-mainnet
```

{% hint style="info" %}
If this is your first time working with a Secret contract, visit the [Getting Started docs](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) to properly configure your developer environment.
{% endhint %}

Now,  `cd` into `examples/EVM-GMP-RNG/secret_network/node`

```bash
cd examples/EVM-GMP-RNG/secret_network/node
```

&#x20;and then run `npm install` to install the `package.json` dependencies.&#x20;

```bash
npm install
```

Create a `.env` file in `examples/EVM-GMP-RNG/secret_network/node` and add your wallet mnemonic in order to upload the contract:&#x20;

<figure><img src="../../.gitbook/assets/env.png" alt=""><figcaption><p>.env config</p></figcaption></figure>

You can then **upload and instantiate the contract** by running `node index.js`.&#x20;

```bash
node index.js
```

Upon successful instantiation, a Secret contract address is returned that you can then use to send messages to Polygon:

<figure><img src="../../.gitbook/assets/contract address.png" alt=""><figcaption><p>Secret contract address upon successful instantation </p></figcaption></figure>

Now let's execute the Secret RNG contract and send a random number to Polygon! 🚀

### Send a Random Number from Secret to Polygon

To execute the [SendMessageEvm](https://github.com/scrtlabs/examples/blob/773fbc5924fda35098da654a173a5f21b5e09b98/EVM-GMP-RNG/secret\_network/src/contract.rs#L45) transaction, which sends an array of random numbers from Secret Network to Polygon, navigate to the `execute.js` file in  `examples/EVM-GMP-RNG/secret_network/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash, respectively.&#x20;

```
cd examples/EVM-GMP-RNG/secret_network/node
```

Then, update `destinationAddress` to your Polygon contract address:

<figure><img src="../../.gitbook/assets/execute variables2.png" alt=""><figcaption></figcaption></figure>

Next, in order to send a GMP message from Secret to Polygon, you need to include the correct IBC denom to pay for gas so that the message can be executed over IBC.&#x20;

{% hint style="success" %}
Learn how to get the correct AXL/Secret IBC denom [here](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ethereum-evm-developer-toolkit#gas-token). &#x20;
{% endhint %}

Once you have properly configured your `execute.js` file and procured the IBC denom needed to execute the transaction, all that's left is to run `node execute.`&#x20;

```bash
node execute 
```

The transaction should return a `transactionHash` as well as data about the IBC routing: &#x20;

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-17 at 1.55.23 PM (1).png" alt=""><figcaption><p>send_message_evm() transaction</p></figcaption></figure>

Now, [navigate to Axelarscan to monitor the status of the transaction](https://testnet.axelarscan.io/gmp/E6EB7C4C2A3D16F60A1650948D2396D46C3F46868C75D93D8B726C51D72B4848):&#x20;

<figure><img src="../../.gitbook/assets/axelarscan rng.png" alt=""><figcaption></figcaption></figure>

And for good measure, view the transaction on [Polygonscan](https://mumbai.polygonscan.com/tx/0x2b9558eee4d508a9473adc448ba19a76af2f648e3ab7379defa5c50eb1b132d9) to see that the array of random numbers was received!

### Query the random number on Polygon and Secret

Now that you've successfully executed a cross-chain message from Secret to Polygon using Axelar GMP, let's query the message on Secret and Polygon.

Let's start by **querying the array of random numbers now stored in the Secret contract** to see if it matches the array of random numbers sent to the Polygon contract. Once the transaction has been executed successfully, you can use [Secret.js](https://github.com/scrtlabs/examples/blob/773fbc5924fda35098da654a173a5f21b5e09b98/EVM-GMP-RNG/secret\_network/node/query.js) to query the message:

```javascript
// Query the contract for the stored message sent from Polygon
let get_stored_message = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_stored_random: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

get_stored_message();
```

To execute this query, navigate to the `query.js` file in  `examples/EVM-GMP-RNG/secret_network/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash, respectively.&#x20;

Then run `node query`.&#x20;

```bash
node query
```

If the message was executed successfully, the query will return **the array of random numbers**:

```javascript
{
  random_bytes: [
     43, 135, 165,  34, 220, 232, 231, 129,
     32, 162,  83,  78,  74,  51,  90, 171,
     10, 181, 184, 201, 246, 184, 175,  82,
    248, 225, 111, 116,  36,  96, 114, 243
  ]
}
```

Great work! Now let's query the Polygon contract to see if the random numbers match!

To execute this query, `cd` into  `examples/EVM-GMP-RNG/polygon`:

```bash
cd examples/EVM-GMP-RNG/polygon
```

Install the `package.json` dependencies:

```bash
npm install 
```

Create a `.env` file in `examples/EVM-GMP-RNG/polygon` and add your  [Polygon testnet Infura API ](https://app.infura.io/dashboard)key and your [Metamask private wallet key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)

<figure><img src="../../.gitbook/assets/env (1).png" alt="" width="375"><figcaption></figcaption></figure>

Open `./scripts/queryRandom.js` and replace the `contractAddress` with your Polygon contract address:

```javascript
const contractAddress = "0x4396a9F3b1962bC7277fC44a78AA5c57e8966978";
```

Then execute the query by running `npx hardhat run --network polygon ./scripts/queryRandom.js`

```bash
npx hardhat run --network polygon ./scripts/queryRandom.js
```

Congrats! 🎉 The query should return an array of random numbers which matches the random numbers stored in the Secret Contract:

```bash
random integers:  [
   43, 135, 165,  34, 220, 232, 231, 129,
   32, 162,  83,  78,  74,  51,  90, 171,
   10, 181, 184, 201, 246, 184, 175,  82,
  248, 225, 111, 116,  36,  96, 114, 243
]
```

### Summary

This documentation has guided you through the process of deploying GMP-compatible contracts on both Polygon and Secret Network, illustrating **how to send random numbers from Secret to Polygon**. By following these steps, you have unlocked the potential for seamless interoperability and enhanced functionality in your blockchain applications.

If you run into any errors or questions, ping the [#dev-issues channel](https://discord.gg/secret-network-360051864110235648) on Secret Network's Discord and somebody will get back to you shortly 😊

