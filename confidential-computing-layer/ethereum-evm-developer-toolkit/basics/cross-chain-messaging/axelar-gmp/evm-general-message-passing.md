---
description: >-
  Learn how to use Axelar General Message Passing in order to send messages
  between EVM chains and Secret Network
---

# Axelar GMP Developer Tutorial

In this tutorial, you will learn how to use Axelar GMP to send a `string` **between Polygon Mainnet and Secret Mainnet**. To learn more about the flow architecture, [see the Axelar documentation here](https://docs.axelar.dev/dev/general-message-passing/overview#steps).

### Prerequisites

* For GMP to work, both chain A and chain B must be EVM or Cosmos with a deployed Axelar Gateway contract. For this tutorial we will be using the [Polygon Mainnet Axelar Gateway contract](https://docs.axelar.dev/resources/contract-addresses/mainnet/). We will go into this in more detail momentarily.
* Have [Metamask installed](https://metamask.io/download/) and your wallet funded with POL tokens.

### Upload a contract to Polygon

In order to execute a smart contract on Secret network, you must first upload and instantiate a smart contract on Polygon that can execute messages using Axelar GMP. We will be uploading the [SendReceive.sol](https://github.com/axelarnetwork/axelar-examples/blob/main/examples/cosmos/call-contract/evm-contract/SendReceive.sol) contract to Polygon for this demo.

{% hint style="info" %}
The Cosmwasm smart contracts in this Axelar repository are not compatible with Secret Network out of the box due to dependency issues. However, we will modify the SendReceive contract to be compatible with Secret Network.
{% endhint %}

To upload the contract, we will use [Remix Online IDE](https://remix.ethereum.org), which is a powerful toolset for developing, deploying, debugging, and testing Ethereum and EVM-compatible smart contracts.

First, navigate to Remix and create a new blank workspace:

<figure><img src="../../../../../.gitbook/assets/remix.png" alt="" width="375"><figcaption><p>Remix workspace</p></figcaption></figure>

Next, create a new file called `SendReceive.sol` and paste the Axelar GMP solidity code. This will autofill your workspace with the necessary dependencies for your SendReceive.sol contract 🤯

Now all that's left is to **compile and upload the contract**. Navigate to the Solidity compiler using the sidebar and click **"Compile SendReceive.sol"**. Then, navigate to "Deploy and run transactions." Toggle the Environment from "Remix VM (Shanghai)" to "Injected Provider - MetaMask" and make sure that in your MetaMask wallet **you have currently selected Polygon network**.

The `constructor` of SendReceive.sol contains 3 variables that you must now input in order to instantiate the contract and link it to Axelar's Polygon **gateway contract** and **gas receiver contract**, as well as the **chain name**:

<pre class="language-bash"><code class="lang-bash">GATEWAY CONTRACT: "0x6f015F16De9fC8791b234eF68D486d2bF203FBA8"
GASRECEIVER CONTRACT: "0x2d5d7d31F671F86C782533cc367F14109a082712"
<strong>CHAINNAME: "Polygon"
</strong></code></pre>

Input these strings like so and then click "Transact":

Upon successful instantiation, the contract address will be returned in the Remix terminal, which you can then view on the [Polygon explorer](https://polygonscan.com/address/0xF4e0949B643A89554a5A350C6A762B7bECd33813). And the deployed contract can now be interacted with in the "Deployed Contracts" window:

<figure><img src="../../../../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

Congrats, you've just deployed an Axelar GMP-compatible contract to Polygon mainnet that can send and receive messages to and from a Secret Network smart contract 🎉

### Upload a contract to Secret Network

Now that you've uploaded a GMP-compatible contract to Polygon, let's do the same on Secret Network so that the contracts can communicate with each other across the Cosmos!

First, clone this Secret Network examples repository:

```bash
git clone https://github.com/SecretFoundation/secret-ethereum-gmp.git
```

Compile the contract by running `make build-mainnet` in your terminal:

```bash
make build-mainnet
```

{% hint style="info" %}
If this is your first time working with a Secret contract, visit the [Getting Started docs](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) to properly configure your developer environment.
{% endhint %}

Now, open a new terminal window and `cd` into `node:`

```bash
cd node
```

`npm install` to install the `package.json` dependencies:

```bash
npm install
```

Create a `.env` file in `/node` and add your wallet mnemonic in order to upload the contract:

<figure><img src="../../../../../.gitbook/assets/env.png" alt=""><figcaption><p>.env config</p></figcaption></figure>

You can then **upload and instantiate the contract** by running `node index.js`.

```bash
node index.js
```

Upon successful instantiation, a Secret contract address is returned that you can then use to send messages to and from Polygon:

<figure><img src="../../../../../.gitbook/assets/contract address.png" alt=""><figcaption><p>Secret contract address upon successful instantiation</p></figcaption></figure>

Now let's send a `string` from Polygon to Secret! 🚀

### Send a string from Polygon to Secret

Now that you have a GMP-compatible contract instantiated on Secret Network, you have all of the variables needed in order to send a cross-chain message using the `SendReceive.sol` contract.

In order to send messages using Axelar GMP, **the user prepays the relayer gas fee on the source chain to Axelar’s Gas Services contract**.

{% hint style="info" %}
You can do this in Remix by navigating to the "Deploy and run transactions" tab in the sidebar and adding gas to prepay the gas fee.
{% endhint %}

To make sure you have enough gas, add .60 Matic, (roughly .40 USD or 800000000000000000 [Wei](https://polygonscan.com/unitconverter)), to the transaction:

<figure><img src="../../../../../.gitbook/assets/remix gas.png" alt=""><figcaption><p>Axelar Gas fee</p></figcaption></figure>

Now all that's left is to execute the transaction! From the "Deployed contracts" section of Remix, open the dropdown for the `send` function, which should have three inputs: `destinationChain`, `destinationAddress`, and `message`. Input the following:

```bash
destinationChain: "secret"
destinationAddress: "Your Secret Contract Address"
destinationMessage: "Your message that you want to send!"
```

Once you have inputed these strings and your contract address, select "transact." Congratulations! You've just sent a `string` from Polygon to Secret Network! 🎉

{% hint style="info" %}
* Use the Polygon explorer to track the transaction on Polygon. Transaction times vary depending upon Poygon network congestion; you might want to "speed up" the transaction in Metamask.
* Use Axelarscan to track the transaction on Axelar. [Here](https://axelarscan.io/gmp/0x6159273b5c216eaef0bb6cf39bfb52d0a4afd6da73f3ee082a9633a1048e2bbc-3) is a successful transaction for reference.
{% endhint %}

### Query the string on Secret

Now that you've successfully executed a cross-chain message from Polygon to Secret using Axelar GMP, let's query the message on Secret Network to see if the message was actually received by the Secret contract.

**First, confirm that the transaction has been** [**successfully relayed by Axelar**](https://axelarscan.io/gmp/0x6159273b5c216eaef0bb6cf39bfb52d0a4afd6da73f3ee082a9633a1048e2bbc-3).

{% hint style="info" %}
The Axelarscan status diagram indicates the following 5 steps were executed successfully:
{% endhint %}

<figure><img src="../../../../../.gitbook/assets/Screen Shot 2023-10-18 at 12.03.33 PM.png" alt=""><figcaption><p>Axelarscan Transaction Status</p></figcaption></figure>

Once the transaction has been executed successfully, you can use [Secret.js](https://github.com/SecretFoundation/secret-ethereum-gmp/blob/main/node/query.js) to query the message:

```javascript
let get_stored_message = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_stored_message: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

get_stored_message();
```

To execute this query, navigate to the `query.js` file in `examples/secret-ethereum-gmp/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash, respectively.

Then run `node query`.

```bash
node query
```

If the message was executed successfully, the query will return the **Ethereum wallet address** that sent the transaction as well as the **message** that the wallet included:

```javascript
{
sender: `0x49e01eb08bBF0696Ed0df8cD894906f7Da635929`,
message: `one small step for Secret!`
}
```

Great work! Now let's send a string from Secret to Polygon!

### Send a string from Secret to Polygon

To execute the SendMessageEvm transaction, navigate to the `execute.js` file in `examples/secret-ethereum-gmp/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash.

Then, update `destinationAddress` to your Polygon contract address, and `myMessage` to the message that you want to send:

<figure><img src="../../../../../.gitbook/assets/execute variables.png" alt=""><figcaption><p>execute.js variables</p></figcaption></figure>

#### Gas Token

Next, in order to send a GMP message from Secret to Polygon, you need to acquire some AXL tokens and include the correct IBC denom representing those tokens to your transaction to pay for gas, so that the message can be executed over IBC

{% hint style="info" %}
Learn more about IBC denoms [here](https://tutorials.cosmos.network/tutorials/6-ibc-dev/).
{% endhint %}

The correct IBC denom is already included in the [secret.js transaction](https://github.com/SecretFoundation/secret-ethereum-gmp/blob/170dbc9008236744b570d7b82887e033c8e20bf9/node/execute.js#L39), but in order for it to execute successfully, **you need to have this IBC denom funded in your wallet**. To add this token to your wallet, you can send Axelar tokens to your Secret wallet address over IBC.

Once you have properly configured your `execute.js` file and procured the IBC denom needed to execute the transaction, all that's left is to run `node execute.`

```bash
node execute 
```

The transaction should return a `transactionHash` as well as data about the IBC routing:

<figure><img src="../../../../../.gitbook/assets/Screen Shot 2023-10-17 at 1.55.23 PM (1).png" alt=""><figcaption><p>send_message_evm() transaction</p></figcaption></figure>

Now, navigate to Axelarscan to monitor the status of the transaction.

And for good measure, view the transaction on the Polygon Explorer to see that the message was received!

Congratulations! You now have all of the tools to send a message from Secret Network to Polygon using Axelar GMP! 🎉

### Summary

Axelar's General Message Passing (GMP) offers a powerful solution for achieving secure interchain communication and token transfers across Secret and Ethereum.  This documentation has guided you through the process of deploying GMP-compatible contracts on both Polygon and Secret Network, illustrating how to send messages across these networks.&#x20;

If you run into any errors or questions, ping the [#dev-issues channel](https://discord.gg/secret-network-360051864110235648) on Secret Network's Discord and somebody will get back to you shortly 😊
