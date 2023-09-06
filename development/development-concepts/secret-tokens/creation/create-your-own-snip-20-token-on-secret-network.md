---
description: Learn how to create a SNIP-20 token on Secret Network
---

# Secret Tokens (SNIP-20)

### Introduction

In this tutorial, we are going to create our own SNIP-20 token on Secret Network using Secret Labs' SNIP-20 reference implementation contract, and we will learn how to upload, instantiate, execute, and query our SNIP-20 contract using Secret.js. Let's dive in!

### Source Code

You can clone the source code [here](https://github.com/scrtlabs/snip20-reference-impl), which we will reference throughout the course of this documentation.

### Prerequisites

Use [the following guide ](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment)to set up your developer environment.

### Build and Deploy Contract

Now that you've cloned the SNIP-20 reference implementation repo above, let's compile the contract. In your terminal run `make compile-optimized`.

{% hint style="info" %}
In Rust, a Makefile can be used to automate tasks such as building the project, running tests, or even generating documentation. **`Make compile-optimized`** is running the following optimizer command, which you can view in the Makefile:
{% endhint %}

#### Optimizer command

```
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
```

### Configuring Secret.js

1. In your root project folder, create a new folder called `node.`
2. In your `node` folder, create a new javascript file called`index.js`.
3. Run `npm init -y` to create a package.json file.
4. Add `"type" : "module"` to your package.json file.
5. Install secret.js:`npm i secretjs`

### Uploading the SNIP-20 Contract

In your index.js file, paste the following (be sure to replace the wallet seed phrase with your wallet seed phrase):

{% code overflow="wrap" %}
```javascript
import { Wallet, SecretNetworkClient, EncryptionUtilsImpl, fromUtf8, MsgExecuteContractResponse  } from "secretjs";
import * as fs from "fs";

const wallet = new Wallet(
  "your walltet seed phrase to go here"
);

const txEncryptionSeed = EncryptionUtilsImpl.GenerateNewSeed();

const contract_wasm = fs.readFileSync("../contract.wasm.gz");

const codeId = 1072;
const contractCodeHash = "26af567eadde095c909ca6ecf58806235877e5b7ec9bfe30f1057e005f548b17";
const contractAddress = "secret1xez6pv463a0elalnj0z53w60fz6tgclv368dw0";

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
  txEncryptionSeed: txEncryptionSeed
});

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
  // contract hash, useful for contract composition
  const contractCodeHash = (await secretjs.query.compute.codeHashByCodeId({code_id: codeId})).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
  }

upload_contract();
```
{% endcode %}

Run `node index.js` in your terminal to execute the `upload_contract()` function. Upon successful execution, a codeId and contract hash will be returned:

```
codeId:  1070
Contract hash: 26af567eadde095c909ca6ecf58806235877e5b7ec9bfe30f1057e005f548b17
```

### Instantiating the SNIP-20 Contract

In your index.js file, paste the following:

```javascript
let instantiate_contract = async () => {
    const initMsg = {
      name: "Zebra",
      symbol: "ZBRA",
      decimals: 6,
      prng_seed: Buffer.from("Something really random").toString("base64"),
      admin: wallet.address,
      initial_balances: [
        {
          address: wallet.address,
          amount: "1000000000",
        },
      ],
    };
  
    let tx = await secretjs.tx.compute.instantiateContract(
      {
        code_id: codeId,
        sender: wallet.address,
        code_hash: contractCodeHash,
        init_msg: initMsg,
        label: " Snip-20 Example" + Math.ceil(Math.random() * 10000),
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

The `initMsg` object in our `index.js` file is referencing the instantiation message defined in [msg.rs at line 20](https://github.com/scrtlabs/snip20-reference-impl/blob/81ad9714e50b890a50d8394dcac718950da127b6/src/msg.rs#L20). Notice that we chose to omit the optional `config` variable. If we include `config`, there is a variety of additional contract functionality that we could program, such as burn, mint, admin privileges, etc [as seen here](https://github.com/scrtlabs/snip20-reference-impl/blob/81ad9714e50b890a50d8394dcac718950da127b6/src/msg.rs#L42).

Now we are going to instantiate some ZBRA coin. If you want to create your own coin name, update the `name, symbol,` and `amount` fields respectively. Be sure to comment out `upload_contract()` and now run `node index.js` to call `instantiate_contract()`. Upon successful execution, a contract address will be returned:

```
secret1xez6pv463a0elalnj0z53w60fz6tgclv368dw0
```

### Query the Token Info

To check that the instantiation of our SNIP-20 ZEBRA token was successful, let's query the smart contract's token info:

```javascript
let query_token_info = async () => {
  const tokenInfoQuery = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      token_info: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(tokenInfoQuery);
};
query_token_info();
```

The following is returned upon successful query:

```
token_info: { name: 'Zebra', symbol: 'ZBRA', decimals: 6, total_supply: null }
}
```

{% hint style="info" %}
The reason `total supply` is `null` is because we chose to make `total supply` hidden in our instantiation message. If you want it to be public, then in the[ `InitConfig` variable](https://github.com/scrtlabs/snip20-reference-impl/blob/81ad9714e50b890a50d8394dcac718950da127b6/src/msg.rs#L45) set `public_total_supply` to true.
{% endhint %}

### SNIP-20 Contract Messages

Now that we have successfully instantiated our SNIP-20 contract, let's send an [execution message](https://github.com/scrtlabs/snip20-reference-impl/blob/81ad9714e50b890a50d8394dcac718950da127b6/src/msg.rs#L91) to better understand the contract's functionality.

Start by adding the token to your Keplr wallet. Click on Keplr, select the hamburger icon, select "Add Token", and then paste in your token's contract address. If you need to fund your wallet to execute the transaction, you can do so using the [pulsar-3 faucet here](https://faucet.pulsar.scrttestnet.com/). You should now see your token in your Keplr wallet!

<figure><img src="../../../../.gitbook/assets/Screen Shot 2023-04-10 at 2.08.50 PM.png" alt=""><figcaption><p>keplr wallet with ZBRA token</p></figcaption></figure>

Let's [transfer some tokens](https://github.com/scrtlabs/snip20-reference-impl/blob/81ad9714e50b890a50d8394dcac718950da127b6/src/msg.rs#L107) to another wallet address. The transfer message is defined in msg.rs as follows:

```javascript
  Transfer {
        recipient: String,
        amount: Uint128,
        memo: Option<String>,
        decoys: Option<Vec<Addr>>,
        entropy: Option<Binary>,
        padding: Option<String>,
    }
```

Now let's execute the transfer message with secret.js. Be sure to update the `recipient` wallet address with your own wallet before executing the code below. For testing purposes, I am using two Keplr wallet connected to the Secret Network testnet in order to move funds back and forth:

```javascript
let transfer_snip20 = async (receiver_wallet) => {
  let executeMsg = {
    transfer: {
      owner: wallet.address,
      amount: "10000000",
      recipient: receiver_wallet,
    },
  };

  let tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      msg: executeMsg,
    },
    {
      gasLimit: 100_000,
    }
  );
  console.log(tx);
};

transfer_snip20("secret1f9zykwvwc6jyhv6dtsjwx03e92j08nyffwuwcu");
```

Congrats! You just successfully transferred your own SNIP-20 token on Secret Network! 🎉
