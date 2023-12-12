---
description: Learn how to install and use SecretJS.
---

# Getting Started with SecretJS

## Overview

In this tutorial you will learn how to use Secret.js to connect a web3 wallet, upload a contract, instantiate a contract, execute a contract, and query a contract, amongst other use cases! For the complete Secret.js docs, see [here](https://secretjs.scrt.network/).&#x20;

All of the following examples use the `pulsar-3` testnet with LCD endpoint `https://api.pulsar3.scrttestnet.com`.

{% hint style="info" %}
Public LCD endpoints can be found [here](https://docs.scrt.network/secret-network-documentation/development/resources-api-contract-addresses/connecting-to-the-network) for both mainnet and testnet.
{% endhint %}

## Installation

Create a package.json file:&#x20;

```bash
npm init -y
```

Then install secretJS:

```bash
npm install secretjs
```

## Set up Secret Network Client

```javascript
import { SecretNetworkClient, Wallet } from "secretjs";

const wallet = new Wallet("Your mnemonic words go here");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

## Upload a Contract

```javascript
import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

const wallet = new Wallet("Your mnemonic words go here");

const contract_wasm = fs.readFileSync("../contract/contract.wasm");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
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

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
};

upload_contract();
```

## Instantiate a Contract

{% code overflow="wrap" %}
```javascript
import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";

const wallet = new Wallet("Your mnemonic words go here");

const contract_wasm = fs.readFileSync("../contract/contract.wasm");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

// Add your contract codeId here
let codeId = ""

// Add your contractCodeHash here
let contractCodeHash = ""

let instantiate_contract = async () => {
//instantiate message is empty in this example. If your contract needs to be instantiated with additional variables, be sure to include them.

  const initMsg = {};
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "Demo" + Math.ceil(Math.random() * 10000),
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
{% endcode %}
