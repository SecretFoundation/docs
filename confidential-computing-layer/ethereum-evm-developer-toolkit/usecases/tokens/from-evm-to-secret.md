---
description: Learn how to send testnet USDC from EVM to Secret Network using Axelar
---

# From EVM to Secret

### Installing the dependencies

Create a new package.json file and install `axelarjs`

```javascript
npm init -y && npm i @axelar-network/axelarjs-sdk
```

Add type "module" to package.json:&#x20;

```json
{
  "name": "evm-to-secret",
  "type" : "module",
  "version": "1.0.0",
  "main": "evm-to-secret.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@axelar-network/axelarjs-sdk": "^0.16.1"
  }
}
```

### Creating the deposit address

Create a new file named `evm-to-secret.js` (or whatever you would like to name it) and add the following code to create an [Axelar deposit address](https://docs.axelar.dev/dev/axelarjs-sdk/token-transfer-dep-addr):&#x20;

```javascript
import {
    AxelarAssetTransfer,
    CHAINS,
    Environment,
  } from "@axelar-network/axelarjs-sdk";
  
  const sdk = new AxelarAssetTransfer({ environment: "testnet" });
  
  async function createDepositAddress() {
    const fromChain = CHAINS.TESTNET.SEPOLIA,
      toChain = "secret-snip-3",
      destinationAddress = "secret1j7n3xx4sfgjea4unghd78qvnvxdz49cxmrkqlj",
      asset = "uausdc";
  
    const depositAddress = await sdk.getDepositAddress({
      fromChain,
      toChain,
      destinationAddress,
      asset,
    });
    console.log(depositAddress);
  }
  
  createDepositAddress();
```

{% hint style="info" %}
Make sure you have the correct[ asset](https://github.com/axelarnetwork/axelarscan-api/blob/416cf58859a51983a6f4e5f37a660ab666b5cc64/config/assets.yml#L4501) for testnet. You can either send USDC or AXL cross-chain . Also make sure to update `destinationAddress` with your Secret testnet wallet address 🤗
{% endhint %}

Run `node evm-to-secret` to execute `createDepositAddress`:&#x20;

```
node evm-to-secret
```

A deposit address will be returned in your terminal:&#x20;

```
0x1f92fEb04737dd2aE59841a1C3806797086143Da
```

### Sending USDC from EVM to Secret Network

Add the Sepolia USDC token to your wallet. Sepolia USDC token contract address:&#x20;

```
0x254d06f33bDc5b8ee05b2ea472107E300226659A
```

{% hint style="info" %}
See all USDC token addresses in the Axelar [docs](https://docs.axelar.dev/dev/reference/testnet-contract-addresses).&#x20;
{% endhint %}

Fund your wallet with testnet Sepolia USDC by bridging AXL to sepolia USDC.&#x20;

First, go to the [Axelar discord faucet channel](https://discord.com/channels/770814806105128977/1002423218772136056) and request testnet tokes from the faucet:&#x20;

```
!faucet <your wallet address here>
```

Then, send testnet USDC from your Axelar wallet address to your Sepolia address using [Axelar Satelite: ](https://testnet.satellite.money/)

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-05-31 at 3.49.50 PM.png" alt="" width="375"><figcaption></figcaption></figure>

Now, simply send Sepolia USDC from your wallet to the deposit address that you created earlier!

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-05-31 at 3.51.47 PM.png" alt="" width="352"><figcaption></figcaption></figure>

{% hint style="info" %}
You can track your token transfer's status on [Axelarscan](https://testnet.axelarscan.io/transfer/0xa55411fc31ecadb507ad3c6533f712fc38f4d1c579943d0b89687aa1d2b3c1a1)
{% endhint %}

### Summary

Congrats! You've successfully sent cross-chain USDC from Sepolia testnet to Secret Network using Axelarjs! If you have any questions, ping [dev-issues](https://discord.gg/secret-network-360051864110235648) on Discord and a developer from the Secret community will assist you shortly.
