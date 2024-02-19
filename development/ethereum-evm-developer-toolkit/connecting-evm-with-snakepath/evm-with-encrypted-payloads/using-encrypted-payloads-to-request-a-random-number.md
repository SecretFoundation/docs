# Using encrypted payloads to request a random number

{% hint style="info" %}
Need help with using encrypted payloads with Snakepath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

## Install and import dependencies

First, install all of the the dependencies via NPM:

```bash
npm install @solar-republic/cosmos-grpc @solar-republic/neutrino ethers secure-random
```

Next, import the following into your code:&#x20;

```typescript
import { ethers } from "ethers"; 
import { arrayify, hexlify, SigningKey, keccak256, recoverPublicKey, computeAddress } from "ethers/lib/utils"; 
import {ecdh, chacha20_poly1305_seal} from "@solar-republic/neutrino"; 
import {bytes, bytes_to_base64, json_to_bytes, sha256, concat, text_to_bytes, base64_to_bytes} from '@blake.regalia/belt';
```

## Defining variables&#x20;

To start, we first define all of our variables that we need for the encryption, as well as the gateway information:&#x20;

```javascript
const publicClientAddress = '0x3879E146140b627a5C858a08e507B171D9E43139' //EVM gateway contract address
const routing_contract = "secret1fxs74g8tltrngq3utldtxu9yys5tje8dzdvghr" //the contract you want to call in secret
const routing_code_hash = "49ffed0df451622ac1865710380c14d4af98dca2d32342bb20f2b22faca3d00d" //its codehash
```

First, we define the Gateway address that is specific to each chain, which can you can look up here [gateway-contracts](../../connecting-evm-with-snakepathrng/gateway-contracts/ "mention").&#x20;

Second, you need to input the private contract that you are going to call, in our case the Secret VRF RNG contact on Secret Network. The code for this example contract can be found [here](https://github.com/SecretSaturn/TNLS/tree/main/TNLS-Samples/RNG) in case you want to deploy it yourself.

## Initializing the Ethereum client

Next, init the Ethereum client that you are using to call the contract with. Here, we init the chainId to use the Ethereum sepolia testnet and use ethers.js to retrieve the address.

```typescript
 await (window as any).ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xAA36A7' }], // chainId must be in hexadecimal numbers
});

// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
const [myAddress] = await provider.send("eth_requestAccounts", []);
```

## Generating the encryption key using ECDH

Next, you generate ephermal keys and load in the public encryption key for the Secret Gateway that you can look up in [gateway-contracts](../../connecting-evm-with-snakepathrng/gateway-contracts/ "mention"). Then, use ECDH to create the encryption key:

```typescript
//Generating ephemeral keys
const wallet = ethers.Wallet.createRandom();
const userPrivateKeyBytes = arrayify(wallet.privateKey);
const userPublicKey: string = new SigningKey(wallet.privateKey).compressedPublicKey;
const userPublicKeyBytes = arrayify(userPublicKey)

//Gateway Encryption key for ChaCha20-Poly1305 Payload encryption
const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3";
const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);

//create the sharedKey via ECDH
const sharedKey = await sha256(ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes));
```

## Define the Callback information & data for the secret contract

... to be continued

## Estimate the Callback Gas

The callback gas is the amount of gas that you have to pay for the message coming on the way back. If you do pay less than the amount specified below, your Gateway TX will fail:&#x20;

```solidity
/// @notice Increase the task_id to check for problems 
/// @param _callbackGasLimit the Callback Gas Limit

function estimateRequestPrice(uint32 _callbackGasLimit) private view returns (uint256) {
    uint256 baseFee = _callbackGasLimit*block.basefee;
    return baseFee;
}
```

Since this check is dependent on the current `block.basefee` of the block it is included in, it is recommended that you estimate the gas fee beforehand and add some extra overhead to it. An example of how this can be implemented in your frontend can be found in this [example](https://github.com/SecretSaturn/VRFDemo/blob/6f396e7174fcad297e26455e11b1fa3814ceea16/src/submit.ts#L124) and here:&#x20;

```typescript
//Then calculate how much gas you have to pay for the callback
//Forumla: callbackGasLimit*block.basefee.
//Use an appropriate overhead for the transaction, 1,5x = 3/2 is recommended since gasPrice fluctuates.

const gasFee = await provider.getGasPrice();
const amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
```

