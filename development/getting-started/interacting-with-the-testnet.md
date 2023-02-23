---
description: >-
  Get started developing on Secret Network using the public testnet and
  secret.js
---

# Interacting with the Testnet

### What is Secret.js? <a href="#what-is-localsecret" id="what-is-localsecret"></a>

[In the previous section](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environmenthttps://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment), we learned how to upload, execute, and query a Secret Network smart contract using SecretCLI and LocalSecret. Now we are going to repeat this process, but we will be uploading, executing, and querying our smart contract **on a public testnet using Secret.js.**&#x20;

{% hint style="info" %}
[Secret.js](https://secretjs.scrt.network/) is a JavaScript SDK for writing applications that interact with the Secret Network blockchain.

**Key features include:**

* Written in TypeScript and provided with type definitions.
* Provides simple abstractions over core data structures.
* Supports every possible message and transaction type.
* Exposes every possible query type.
* Handles input/output encryption/decryption for Secret Contracts.
* Works in Node.js, modern web browsers and React Native.
{% endhint %}

By the end of this tutorial, you will learn how to:&#x20;

1. Add the Secret Testnet to your keplr wallet (and fund your wallet with testnet tokens)
2. Optimize and compile your Secret Network smart contract
3. Upload and Instantiate your contract using Secret.js
4. Execute and Query your contract using Secret.js

Let's get started!&#x20;

### Environment Configuration

To follow along with the guide, we will be using `npm,` `git,` `make,` `rust,` and `docker`.  Follow the [Setting Up Your Environment guide here ](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment)if you need any assistance.&#x20;

Additionally, you will need to have the Secret Testnet configured with your keplr wallet and also fund it with testnet tokens. [Learn how to configure and fund your keplr wallet here.](https://docs.scrt.network/secret-network-documentation/overview-ecosystem-and-technology/secret-network-overview/testnet#set-up-with-keplr)  &#x20;

### Generate your new counter contract&#x20;

We will be working with a basic counter contract, which allows users to increment a counter variable by 1 and also reset the counter. If you've never worked with smart contracts written in Rust before that is perfectly fine.

The first thing you need to do is clone the counter contract from the [Secret Network github repo](https://github.com/scrtlabs/secret-template). Secret Network developed this counter contract template so that developers have a simple structure to work with when developing new smart contracts, but we're going to use the contract exactly as it is for learning purposes.

Go to the folder in which you want to save your counter smart contract and run:

```
cargo generate --git https://github.com/scrtlabs/secret-template.git --name my-counter-contract
```

{% hint style="info" %}
When you run the above code, it will name your contract folder directory "my-counter-contract". But you can change the name by altering the text that follows the `--name` flag.
{% endhint %}

Start by opening the `my-counter-contract` project folder in your text editor. If you navigate to `my-counter-contract/src` you will see`contract.rs, msg.rs, lib.rs, and state.rs`—these are the files that make up our counter smart contract. If you've never worked with a Rust smart contract before, perhaps take some time to familiarize yourself with the code, although in this tutorial we will not be going into detail discussing the contract logic.

1. In the your root project folder, ie`my-counter-contract`, create a new folder. For this tutorial I am choosing to call the folder `node`.&#x20;
2. In your `my-counter-contract/node` folder, create a new javascript file––I chose to name mine`index.js`.&#x20;
3. Run `npm init -y` to create a package.json file. &#x20;
4. Add `"type" : "module"` to your package.json file.&#x20;
5. Install secret.js and dotenv: `npm i secretjs@^1.7.1-beta.2 dotenv`
6. &#x20;Create a `.env` file in your `node` folder, and add the variable `MNEMONIC` along with your wallet address seed phrase, like so:&#x20;

<pre><code><strong>MNEMONIC=grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar
</strong></code></pre>

{% hint style="danger" %}
Never use a wallet with actual funds when working with the testnet. If your seed phrase were pushed to github you could lose all of your funds.  Create a new wallet that you use solely for working with the testnet.
{% endhint %}

Congrats! 🎉  You now have your environment configured to develop with secret.js.&#x20;

### Compile the Code

Since we are not making any changes to the contract code, we are going to compile it exactly as it is. To compile the code, run `make build` in your terminal. This will take our Rust code and build a Web Assembly file that we can deploy to Secret Network. Basically, it just takes the smart contract that we've written and translates the code into a language that the blockchain can understand.

{% tabs %}
{% tab title="Linux/WSL/MacOS" %}
```
make build
```
{% endtab %}

{% tab title="Windows" %}
```
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
cp ./target/wasm32-unknown-unknown/release/*.wasm ./contract.wasm
```
{% endtab %}

{% tab title="Secret IDE" %}
Run `make build` from the terminal, or just GUI it up -

![](<../../.gitbook/assets/image (2).png>)
{% endtab %}
{% endtabs %}

This will create a `contract.wasm` and `contract.wasm.gz` file in the root directory.

While we could upload this contract wasm file to the blockchain exactly as it is, instead we are going to follow best practices and **optimize** the wasm file. This just means we are going to reduce the size of the file so that it costs less gas to upload, which is critical when you eventually upload contracts to mainnet. **Make sure you have docker installed** and then run the following code:

**Optimize compiled wasm**

```
docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer  
```

You should now have an optimized `contract.wasm.gz` file in your root directory, which is ready to be uploaded to the blockchain! Also note that the optimizer should have removed the `contract.wasm` file from your root directory 👍

### Uploading the Contract

Now that we have a working contract and an optimized wasm file, we can upload it to the blockchain and see it in action. This is called **storing the contract code**. We are using a public testnet environment, but the same commands apply no matter which network you want to use - local, public testnet, or mainnet.&#x20;

Start by configuring your `index.js` file like so:&#x20;

```
import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync("../contract.wasm.gz");
```

You now have secret.js imported, a `wallet` variable that points to your wallet address, and a `contract_wasm` variable that points to the smart contract wasm file that we are going to upload to the testnet. The next step is to configure your Secret Network Client, which is used to **broadcast transactions, send queries and receive chain information.**&#x20;

#### Secret Network Client

Note the **chainId** and the **url** that we are using. This chainId and url are for the **Secret Network testnet**. If you want to upload to LocalSecret or Mainnet instead, all you would need to do is swap out the chainId and url. [A list of alternate API endpoints can be found here. ](https://docs.scrt.network/secret-network-documentation/development/connecting-to-the-network)

```
const secretjs = new SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

Now `console.log(secretjs)` and run `node index.js` in the terminal of your `my-counter-contract/node` folder to see that you have successfully connected to the Secret Network Client:&#x20;

<figure><img src="../../.gitbook/assets/secret network client.png" alt=""><figcaption><p>Secret Network Client configuration</p></figcaption></figure>

#### Uploading with secret.js

To upload a compiled contract to Secret Network, you can use the following code:&#x20;

```
let upload_contract = async () => {
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
  
};

upload_contract();
```

Run `node index.js` in your terminal to call the `upload_contract()` function. Upon successful upload, a **codeId** and a **contractCodeHash** will be logged in your terminal:&#x20;

```
codeId:  19904
Contract hash: d350eb20b4bf93ce2a060168a1fe6faf58dafa84989bc22d3e83ac665f8c119f
```

{% hint style="warning" %}
Be sure to save the codeId and contractCodeHash as variables so you can access them in additional function calls.&#x20;
{% endhint %}

### Instantiating the Contract

In the previous step, we stored the contract code on the blockchain. To actually use it, we need to instantiate a new instance of it. Comment out `upload_contract()`  and then add `instantiate_contract()`.&#x20;

Note that there is an `initMsg` which contains `count:0`. You can make the starting count whatever you'd like (as well as the contract `label`).&#x20;

```
let instantiate_contract = async () => {
  // Create an instance of the Counter contract, providing a starting count
  const initMsg = { count: 0 };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "My Counter" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
};

instantiate_contract();
```

Run `node index.js` in your terminal to call the `instantiate_contract()` function. Upon successful instantiation, a contractAddress **** will be logged in your terminal:&#x20;

```
secret1ez0nchvy6awpnnmzqqzvmqz62dcgke80pzaqc7
```

{% hint style="warning" %}
Be sure to save the **contractAddress** as a variable so you can access it in additional function calls.&#x20;
{% endhint %}

Congrats 🎉! You just finished uploading and instantiating your first contract on a public Secret Network testnet! Now it's time to see it in action!

### Executing and Querying the contract

The way you interact with contracts on a blockchain is by sending **contract messages**_. A_ message contains the JSON description of a specific action that should be taken on behalf of the sender, and in most Rust smart contracts they are defined in the `msg.rs` file.

In our `msg.rs` file, there are two enums: `ExecuteMsg`, and `QueryMsg`. They are enums because each variant of them represents a different message which can be sent. For example, the `ExecuteMsg::Increment` corresponds to the `try_increment` message in our `contract.rs` file.

In the previous section, we compiled, uploaded and instantiated our counter smart contract. Now we are going to query the contract and also execute messages to update the contract state. Let's start by querying the counter contract we instantiated.

### Query Message

A **Query Message** is used to request information from a contract; unlike `execute messages`, query messages do not change contract state, and are used just like database queries. You can think of queries as questions you can ask a smart contract.

Let's query our counter smart contract to return the current count. It should be 0, because that was the count we instantiated in the previous section. We query the count by calling the Query Message `get_count {}`, which is defined in our msg.rs file. Comment out `instantiate_contract()`  and then add `try_query_count()`.&#x20;

```
let try_query_count = async () => {
  const my_query = await secretjs.query.compute.queryContract({
    contract_address: contract_address,
    code_hash: contractCodeHash,
    query: { get_count: {} },
  });

  console.log(my_query);
};

try_query_count();
```

The query returns:

```json
{"count": "0"}
```

Great! Now that we have queried the contract's starting count, let's execute an `increment{}` message to modify the contract state.

### Execute Message

An **Execute Message** is used for handling messages which modify contract state. They are used to perform contract actions.

{% hint style="info" %}
**Did you know?** Messages aren't free! Each transaction costs a small fee, which represents how many resources were required to complete it. This cost is measured in _**gas**_ units.
{% endhint %}

The counter contract consists of two execute messages: `increment{}`, which increments the count by 1, and `reset{}`, which resets the count to any `i32` you want. The current count is 0, let's call the Execute Message `increment{}` to increase the contract count by 1.

```
let try_increment_count = async () => {
  let tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contract_address,
      code_hash: contractCodeHash, // optional but way faster
      msg: {
        increment: {},
      },
      sentFunds: [], // optional
    },
    {
      gasLimit: 100_000,
    }
  );
  console.log("incrementing...");
};

 try_increment_count();
```

Nice work! Now we can query the contract once again to see if the contract state was successfully incremented by 1. The query returns:

```json
{"count": "1"}
```

Way to go! You have now successfully interacted with a Secret Network smart contract on the public testnet!&#x20;

### Next Steps

Congratulations! You completed the tutorial and successfully compiled, uploaded, deployed and executed a Secret Contract! The contract is the business logic that powers a blockchain application, but a full application contains other components as well. If you want to learn more about Secret Contracts, or explore what you just did more in depth, feel free to explore these awesome resources:

* [Secret University counter contract breakdown ](https://github.com/secretuniversity/secret-counter-vuejs-box/blob/main/app/tutorial/guide.md)- explains the counter contract in depth
* [Millionaire's problem breakdown](https://docs.scrt.network/secret-network-documentation/development/secret-by-example/millionaires-problem) - explains how a Secret Contract works
* [CosmWasm Documentation](https://book.cosmwasm.com/) - everything you want to know about CosmWasm
* [Secret.JS](https://docs.scrt.network/secret-network-documentation/development/secretjs/templates) - Building a web UI for a Secret Contract









