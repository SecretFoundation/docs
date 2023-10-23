---
description: >-
  Learn how to use Axelar General Message Passing in order to send messages
  between EVM chains and Secret Network
---

# Ethereum (EVM) Developer Toolkit

## Axelar General Message Passing&#x20;

[Axelar](https://docs.axelar.dev/dev/intro) enables secure interchain communication and token transfers, spanning consensus methods including Cosmos and Ethereum. Through the use of General Message Passing (GMP), developers building on Ethereum can execute smart contracts on Secret and vice versa. This means complete composability across Web3.

With GMP you can:

* Call a contract on chain B from chain A.
* Call a contract on chain B from chain A and attach some tokens.

In this tutorial, you will learn how to use Axelar GMP to send a `string` **between Polygon and Secret mainnets** (testnet configuration is pending). To learn more about the flow architecture, [see the Axelar documentation here](https://docs.axelar.dev/dev/general-message-passing/overview#steps).&#x20;

### Prerequisites

* For GMP to work, both chain A and chain B must be EVM or Cosmos with a deployed Axelar Gateway contract. For this tutorial we will be using the [Polygon mainnet Axelar Gateway contracts](https://docs.axelar.dev/resources/mainnet). We will go into this in more detail momentarily.&#x20;
* Have [Metamask installed](https://metamask.io/download/), Polygon Network added to your wallet, and your wallet funded with Polygon tokens. &#x20;

{% hint style="info" %}
Add Polygon Network to your Metamask wallet by navigating to the [Polygon explorer](https://polygonscan.com/) and clicking "Add Polygon Network" in the bottom righthand corner of the homepage.&#x20;
{% endhint %}

### Upload a contract to Polygon

In order to execute a smart contract on Secret network, you must first upload and instantiate a smart contract on Polygon that can execute messages using Axelar GMP. Axelar has a [github repository of example contracts ](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/tree/main/cosmwasm-integration)that can be used for GMP. We will be uploading the [SendReceive.sol](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/blob/main/cosmwasm-integration/send-receive/evm/contracts/SendReceive.sol) contract to Polygon for this demo.&#x20;

{% hint style="info" %}
The Cosmwasm smart contracts in this Axelar repository are not compatible with Secret Network out of the box due to dependency issues. However, we will modify the SendReceive contract to be compatible with Secret Network.&#x20;
{% endhint %}

To upload the contract, we will use [Remix Online IDE](https://remix.ethereum.org), which is a powerful toolset for developing, deploying, debugging, and testing Ethereum and EVM-compatible smart contracts.

First, navigate to Remix and create a new blank workspace:

<figure><img src="../../../.gitbook/assets/remix.png" alt="" width="375"><figcaption><p>Remix workspace</p></figcaption></figure>

Next, create a new file called `SendReceive.sol` and paste the [Axelar GMP solidity code](https://github.com/axelarnetwork/evm-cosmos-gmp-sample/blob/main/cosmwasm-integration/send-receive/evm/contracts/SendReceive.sol). This will autofill your workspace with the necessary dependencies for your SendReceive.sol contract 🤯

Now all that's left is to **compile and upload the contract**. Navigate to the Solidity compiler using the sidebar and click **"Compile SendReceive.sol"**. Then, navigate to "Deploy and run transactions." Toggle the Environment from "Remix VM (Shanghai)" to "Injected Provider - MetaMask" and make sure that in your MetaMask wallet **you have currently selected Polygon network**.&#x20;

The `constructor` of SendReceive.sol contains 3 variables that you must now input in order to instantiate the contract and link it to Axelar's Polygon **gateway contract** and **gas receiver contract**, as well as the Polygon **chain name**:&#x20;

<pre class="language-bash"><code class="lang-bash">GATEWAY CONTRACT: "0x6f015F16De9fC8791b234eF68D486d2bF203FBA8"
GASRECEIVER CONTRACT: "0x2d5d7d31F671F86C782533cc367F14109a082712"
<strong>CHAINNAME: "Polygon"
</strong></code></pre>

Input these strings like so and then click "Transact":

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-10-11 at 4.57.52 PM.png" alt="" width="294"><figcaption><p>SendReceive constructor</p></figcaption></figure>

Upon successful instantiation, the contract address will be returned in the Remix terminal, which you can then [view on Polygonscan](https://polygonscan.com/address/0x13ACd5794A3136E7fAc8f9727259930fcab1290F). And the deployed contract can now be interacted with in the "Deployed Contracts" window:&#x20;

<figure><img src="../../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

Congrats, you've just deployed an Axelar GMP-compatible contract to Polygon mainnet that can send and receive messages to and from a Secret Network smart contract 🎉

### Upload a contract to Secret Network

Now that you've uploaded a GMP-compatible contract to Polygon, let's do the same on Secret Network so that the contracts can communicate with each other across the Cosmos!

First, clone this Secret Network examples repository:&#x20;

```bash
git clone https://github.com/scrtlabs/examples
```

Then, `cd` into the `examples/secret-ethereum-gmp` folder

```bash
cd examples/secret-ethereum-gmp
```

and compile the contract by running `make build-mainnet` in your terminal.

```bash
make build-mainnet
```

{% hint style="info" %}
If this is your first time working with a Secret contract, visit the [Getting Started docs](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment) to properly configure your developer environment.
{% endhint %}

Now, open a new terminal window and `cd` into `examples/secret-ethereum-gmp/node`

```bash
cd examples/secret-ethereum-gmp/node
```

&#x20;and then run `npm install` to install the `package.json` dependencies.&#x20;

```bash
npm install
```

Create a `.env` file in `examples/secret-ethereum-gmp/node` and add your wallet mnemonic in order to upload the contract:&#x20;

<figure><img src="../../../.gitbook/assets/env.png" alt=""><figcaption><p>.env config</p></figcaption></figure>

You can then **upload and instantiate the contract** by running `node index.js`.&#x20;

```bash
node index.js
```

Upon successful instantiation, a Secret contract address is returned that you can then use to send messages to and from Polygon:

<figure><img src="../../../.gitbook/assets/contract address.png" alt=""><figcaption><p>Secret contract address upon successful instantation </p></figcaption></figure>

Now let's send a `string` from Polygon to Secret! 🚀

### Send a string from Polygon to Secret

Now that you have a GMP-compatible contract instantiated on Secret Network, you have all of the variables needed in order to send a cross-chain message using the `SendReceive.sol` contract.&#x20;

In order to send messages using Axelar GMP, **the user prepays the relayer gas fee on the source chain to Axelar’s Gas Services contract**.&#x20;

{% hint style="info" %}
You can do this in Remix by navigating to the "Deploy and run transactions" tab in the sidebar and adding gas to prepay the gas fee.&#x20;
{% endhint %}

To make sure you have enough gas, add .40 Matic, (roughly .20 USD or 400000000000000000 [Wei](https://polygonscan.com/unitconverter)), to the transaction:

<figure><img src="../../../.gitbook/assets/remix gas.png" alt=""><figcaption><p>Axelar Gas fee</p></figcaption></figure>

Now all that's left is to execute the transaction! From the "Deployed contracts" section of Remix, open the dropdown for the `send` function, which should have three inputs: `destinationChain`, `destinationAddress`, and `message`.  Input the following:

```bash
destinationChain: "secret"
destinationAddress: "Your Secret Contract Address"
destinationMessage: "Your message that you want to send!"
```

Once you have inputed these strings and your contract address, select "transact." Congratulations! You've just sent a `string` from Polygon to Secret Network! 🎉&#x20;

{% hint style="info" %}
* [Use Polygonscan to track the transaction on Polygon](https://polygonscan.com/address/0x13ACd5794A3136E7fAc8f9727259930fcab1290F). Here is an already [deployed contract for reference](https://polygonscan.com/address/0x13ACd5794A3136E7fAc8f9727259930fcab1290F). Transaction times vary depending upon Poygon network congestion; you might want to "speed up" the transaction in Metamask.&#x20;
* [Use Axelarscan to track the transaction on Axelar. ](https://axelarscan.io/gmp/0xc259627a6ca5ea786184d452802bcbf8d16df7c244dda3cf544e556c59eb0a85:634)Here is a [successful transaction for reference](https://axelarscan.io/gmp/0xb8ff5a63acb95cff351c7f421e7a835139ba51f5e6677481d2d79ff49d2c5799:816).&#x20;
{% endhint %}

### Query the string on Secret

Now that you've successfully executed a cross-chain message from Polygon to Secret using Axelar GMP, let's query the message on Secret Network to see if the message was actually received by the Secret contract.&#x20;

**First, confirm that the transaction has been** [**successfully relayed by Axelar**](https://axelarscan.io/gmp/0xb8ff5a63acb95cff351c7f421e7a835139ba51f5e6677481d2d79ff49d2c5799:816).&#x20;

{% hint style="info" %}
The Axelarscan status diagram indicates the following 5 steps were executed successfully:
{% endhint %}

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-10-18 at 12.03.33 PM.png" alt=""><figcaption><p>Axelarscan Transaction Status</p></figcaption></figure>

Once the transaction has been executed successfully, you can use [Secret.js to query the message](https://github.com/writersblockchain/evm-gmp/blob/3e8e88ae0b39189518917f2834c25ead0f50a3c1/node/index.js#L116):

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

To execute this query, navigate to the `query.js` file in  `examples/secret-ethereum-gmp/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash, respectively.&#x20;

Then run `node query`.&#x20;

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

### Send a string from Secret to Polygon&#x20;

To execute the [SendMessageEvm](https://github.com/scrtlabs/examples/blob/176a433ba2a349353e1e60652fad6ba92cfdf5f7/secret-ethereum-gmp/src/msg.rs#L11) transaction, navigate to the [`execute.js`](https://github.com/scrtlabs/examples/blob/master/secret-ethereum-gmp/node/execute.js) file in  `examples/secret-ethereum-gmp/node` and replace the `contractAdress` and `contractCodeHash` with your contract address and code hash, respectively.&#x20;

Then, update `destinationAddress` to your Polygon contract address, and `myMessage` to the message that you want to send:

<figure><img src="../../../.gitbook/assets/execute variables.png" alt=""><figcaption><p>execute.js variables</p></figcaption></figure>

Next, in order to send a GMP message from Secret to Polygon, you need to include the correct IBC denom to pay for gas so that the message can be executed over IBC.&#x20;

{% hint style="info" %}
[Learn more about IBC denoms here.](https://tutorials.cosmos.network/tutorials/6-ibc-dev/)
{% endhint %}

The [correct IBC denom](https://github.com/scrtlabs/examples/blob/3470d6d3375ea25888371e931aea7661c511048c/secret-ethereum-gmp/node/execute.js#L40C14-L40C14) is already included in the secret.js transaction, but in order for it to execute successfully, **you need to have this IBC denom funded in your Keplr wallet**. To add this token to your Keplr wallet, send Axelar tokens to your Secret wallet address over IBC:

1. Procure  AXL tokens from an exchange of your choice.&#x20;
2. In Keplr, click "Send" and select the "AXL" (Axelar) token.
3. Click "IBC Send" and select "Secret Network" for the chain.&#x20;
4. Execute the transaction.&#x20;

{% hint style="info" %}
[See a video tutorial here. ](https://www.youtube.com/shorts/JELkjrSHCoA)
{% endhint %}

Once you have properly configured your `execute.js` file and procured the IBC denom needed to execute the transaction, all that's left is to run `node execute.`&#x20;

```bash
node execute 
```

The transaction should return a `transactionHash` as well as data about the IBC routing: &#x20;

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-10-17 at 1.55.23 PM (1).png" alt=""><figcaption><p>send_message_evm() transaction</p></figcaption></figure>

Now, [navigate to Axelarscan to monitor the status of the transaction](https://axelarscan.io/gmp/443353C7CA528994A0B538142D409F0D1AF81A9E0C897FCB6DC7A00DCC6239DF) (for reference, my transaction executed in 1 minute, 50 seconds).&#x20;

And for good measure, [view the transaction on Polygonscan](https://polygonscan.com/tx/0xea2d5d8cdb36fde553f493279ff1e3adc6ea5fb0089492715c00d0aae1a97e04) to see that the message was received!

To actually see the message that you sent, click on "Click to see more":

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-10-17 at 1.59.36 PM.png" alt=""><figcaption><p>Polygonscan transaction</p></figcaption></figure>

And then at "Input Data", **view the input as UTF-8** to reveal the decoded message!  👀

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-10-17 at 2.01.07 PM.png" alt=""><figcaption><p>Decoded String sent from Secret to Ethereum</p></figcaption></figure>

Congratulations! You now have all of the tools to send a message from Secret Network to Polygon using Axelar GMP! 🎉

### Summary

In conclusion, Axelar's General Message Passing (GMP) offers a powerful solution for achieving secure interchain communication and token transfers across diverse blockchain ecosystems, including Cosmos and Ethereum. With GMP, developers can seamlessly execute smart contracts on one blockchain from another, fostering complete composability within the Web3 landscape. This documentation has guided you through the process of deploying GMP-compatible contracts on both Polygon and Secret Network, illustrating how to send messages across these networks. By following these steps, you have unlocked the potential for seamless interoperability and enhanced functionality in your blockchain applications. Axelar GMP paves the way for a more interconnected and efficient blockchain ecosystem. Congratulations on your successful journey with Axelar GMP!

If you run into any errors or questions, ping the [#dev-issues channel](https://discord.gg/secret-network-360051864110235648) on Secret Network's Discord and somebody will get back to you shortly 😊
