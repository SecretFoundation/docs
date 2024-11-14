---
description: Learn how to create a SNIP-20 token on Secret Network
---

# Secret Tokens (SNIP-20)

### Introduction

In this tutorial, we are going to create our own SNIP-20 token on Secret Network using Secret Labs' SNIP-20 reference implementation contract, and we will learn how to upload, instantiate, execute, and query our SNIP-20 contract using Secret.js. Let's dive in!

### Source Code

You can clone the source code [here](https://github.com/SecretFoundation/snip20-reference-impl), which we will reference throughout the course of this documentation.

### Prerequisites

Use [the following guide ](https://docs.scrt.network/secret-network-documentation/development/getting-started/setting-up-your-environment)to set up your developer environment.

### Build and Deploy Contract

Now that you've cloned the SNIP-20 reference implementation repo above, let's compile the contract. In your terminal run `make build-mainnet-reproducible`.

```bash
make build-mainnet-reproducible
```

The compiled wasm file will be output in `./optimized-wasm`[ here](https://github.com/SecretFoundation/snip20-reference-impl/tree/master/optimized-wasm).

### Uploading and Instantiating the SNIP-20 Contract

Now let's upload and instantiate the SNIP-20 Contract. We have already written an [upload + instantiate script](https://github.com/SecretFoundation/snip20-reference-impl/blob/master/node/upload.js) for your convenience. If you would like to make any changes to your SNIP-20 token, you can do so [here](https://github.com/SecretFoundation/snip20-reference-impl/blob/e8ca7b160c21630b3ffd00e3380a50245652ea90/node/upload.js#L57).&#x20;

The `initMsg` object in our `upload.js` file is referencing the instantiation message defined in [msg.rs at line 20](https://github.com/SecretFoundation/snip20-reference-impl/blob/e8ca7b160c21630b3ffd00e3380a50245652ea90/src/msg.rs#L20). Notice  the optional `config` variable. If we include `config`, there is a variety of additional contract functionality that we could program, such as burn, mint, admin privileges, etc[ as seen here](https://github.com/SecretFoundation/snip20-reference-impl/blob/e8ca7b160c21630b3ffd00e3380a50245652ea90/src/msg.rs#L42).

Now we are going to instantiate some ZBRA coin. If you want to create your own coin name, update the `name, symbol,` and `amount` fields respectively.&#x20;

Otherwise, run node upload:&#x20;

{% code overflow="wrap" %}
```bash
node upload
```
{% endcode %}

Upon successful execution, a codeId, contract hash, and contract address will be returned:

```bash
codeId:  12165
Contract hash: 82b35f533630d1b40e43729dc173e0f0e762d718be5e76824fec2af3dca14c13
contract address:  secret136acktxpd0arjprneqxtgxt832n8rnq8rrk7fy
```

### Query the Token Info

To check that the instantiation of our SNIP-20 ZEBRA token was successful, let's query the smart contract's token info.

Run `node query_token_info`:

```bash
node query_token_info 
```

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

```bash
token_info: { name: 'Zebra', symbol: 'ZBRA', decimals: 6, total_supply: null }
}
```

{% hint style="info" %}
The reason `total supply` is `null` is because we chose to make `total supply` hidden in our instantiation message. If you want it to be public, then in the `InitConfig` variable set `public_total_supply` to true.
{% endhint %}

### SNIP-20 Contract Messages

Now that we have successfully instantiated our SNIP-20 contract, let's send an [execution message](https://github.com/SecretFoundation/snip20-reference-impl/blob/e8ca7b160c21630b3ffd00e3380a50245652ea90/src/msg.rs#L91) to better understand the contract's functionality.

Start by adding the token to your Keplr wallet. Click on Keplr, select the hamburger icon, select "Add Token", and then paste in your token's contract address. If you need to fund your wallet to execute the transaction, you can do so using the [pulsar-3 faucet here](https://faucet.pulsar.scrttestnet.com/). You should now see your token in your Keplr wallet!

<figure><img src="../../.gitbook/assets/Screen Shot 2023-04-10 at 2.08.50 PM.png" alt=""><figcaption><p>keplr wallet with ZBRA token</p></figcaption></figure>

Let's [transfer some tokens](https://github.com/SecretFoundation/snip20-reference-impl/blob/e8ca7b160c21630b3ffd00e3380a50245652ea90/src/msg.rs#L107) to another wallet address. The transfer message is defined in msg.rs as follows:

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
