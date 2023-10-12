---
description: >-
  Learn how to use Axelar General Message Passing in order to send messages
  between EVM chains and Secret Network
---

# Ethereum -> Secret Network

_10/12/23: Currently in progress, not production ready_

## Axelar General Message Passing&#x20;

[Axelar](https://docs.axelar.dev/dev/intro) enables secure interchain communication and token transfers, spanning consensus methods including Cosmos and Ethereum. Through the use of General Message Passing (GMP), developers building on Ethereum can execute smart contracts on Secret and vice versa. This means complete composability across Web3.

With GMP you can:

* Call a contract on chain B from chain A.
* Call a contract on chain B from chain A and attach some tokens.

In this tutorial, you will learn how to use Axelar GMP to send a `string` between Polygon and Secret testnets. To learn more about the flow architecture, [see the Axelar documentation here](https://docs.axelar.dev/dev/general-message-passing/overview#steps).&#x20;

### Prerequisites

* For GMP to work, both chain A and chain B must be EVM or Cosmos with a deployed Axelar Gateway contract. For this tutorial we will be using the [Polygon testnet Axelar Gateway contracts](https://docs.axelar.dev/dev/reference/testnet-contract-addresses). We will go into this in more detail momentarily.&#x20;
* Have Metamask installed, Polygon testnet added to your wallet, and your wallet funded with Polygon testnet tokens. &#x20;

{% hint style="info" %}
* Add Polygon testnet to your Metamask wallet by navigating to the [Polygon testnet explorer](https://mumbai.polygonscan.com/) and clicking "Add Mumbai Network" in the bottom righthand corner of the homepage.&#x20;
* Fund your Polygon wallet using [this faucet ](https://faucet.polygon.technology/)
{% endhint %}

### 1) Upload a contract to Polygon testnet

In order to execute a smart contract on Secret network, you must first upload and instantiate a smart contract on Polygon that can execute messages using Axelar GMP. Axelar has a [github repository of example contracts ](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/tree/main/cosmwasm-integration)that can be used for GMP. We will be uploading the [SendReceive.sol](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/blob/main/cosmwasm-integration/send-receive/evm/contracts/SendReceive.sol) contract to Polygon for this demo.&#x20;

{% hint style="info" %}
The Cosmwasm smart contracts in this Axelar repository are not compatible with Secret Network out of the box due to dependency issues. However, we will modify the SendReceive contract to be compatible with Secret Network.&#x20;
{% endhint %}

To upload the contract, we will use [Remix Online IDE](https://remix.ethereum.org), which is a powerful toolset for developing, deploying, debugging, and testing Ethereum and EVM-compatible smart contracts.

First, navigate to Remix and create a new blank workspace:

<figure><img src="../../.gitbook/assets/remix.png" alt="" width="375"><figcaption><p>Remix workspace</p></figcaption></figure>

Next, create a new file called `SendReceive.sol` and insert the [Axelar GMP solidity code](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/blob/main/cosmwasm-integration/send-receive/evm/contracts/SendReceive.sol). This will autofill your workspace with the necessary dependencies for your SendReceive.sol contract 🤯

Now all that's left is to compile and upload the contract. Navigate to the Solidity compiler using the sidebar and click "Compile SendReceive.sol". Then, navigate to "Deploy and run transactions." Toggle the Environment from "Remix VM (Shanghai)" to "Injected Provider - MetaMask" and make sure that in your MetaMask wallet you have currently selected the Mumbai testnet.&#x20;

The `constructor` of SendReceive.sol contains 3 variables that we must now input in order to instantiate the contract and link it to Axelar's Polygon **gateway contract** and **gas receiver contract**, as well as the Polygon **testnet chain name**:&#x20;

<pre><code>GATEWAY CONTRACT: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B"
GASRECEIVER CONTRACT: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
<strong>CHAINNAME: "Polygon"
</strong></code></pre>

Input these strings like so and then click "Transact":

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-11 at 4.57.52 PM.png" alt="" width="294"><figcaption><p>SendReceive constructor</p></figcaption></figure>

Congrats, you've just deployed an Axelar GMP-compatible contract to Polygon testnet that can send and receives messages to and from a Secret Network smart contract 🎉

### Upload a contract to Secret testnet

Now that you've uploaded a GMP-compatible contract to Polygon testnet, let's do the same on Secret Network testnet so that the contracts can communicate with each other across the Cosmos!

First clone this Secret Network EVM-GMP repository:&#x20;

```
git clone https://github.com/writersblockchain/evm-gmp.git
```

{% hint style="info" %}
If this is your first time working with a Secret contract, visit the [Getting Started docs](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) to properly configure your developer environment&#x20;
{% endhint %}

Now compile the contract:&#x20;

```
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
```

You can then **upload and instantiate the contract** from the [evm-gmp/node folder](https://github.com/writersblockchain/evm-gmp/blob/master/node/index.js) by running `node index.js`. Upon successful instantiation, a Secret contract address is returned that you can then use to send messages to from Polygon:

```javascript
let contractAddress = "secret1q4pk525xgpunrj8zysj0rtpd3aktgg7hgdrl34";
```

Now let's send a `string` from Polygon to Secret!

### Send a string from Polygon to Secret

Now that you have a GMP-compatible contract instantiated on Secret Network, you have all of the variables needed in order to send a cross-chain message using the `SendReceive.sol` contract.&#x20;

_Currently in development_&#x20;

### Send a string from Secret to Polygon&#x20;

_Currently in development_&#x20;
