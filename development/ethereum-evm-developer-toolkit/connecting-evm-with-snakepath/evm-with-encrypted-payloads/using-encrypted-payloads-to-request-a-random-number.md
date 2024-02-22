# Using encrypted payloads to request a random number

{% hint style="info" %}
Need help with using encrypted payloads with Snakepath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

## Complete example

You can find the complete example on [Github](https://github.com/SecretSaturn/Snakepath-Encryption-Example/).

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

In your `vite.config.ts` in the project, you need to add the support for `bigInt` into the esbuildOptions:

```typescript
optimizeDeps: { 
    esbuildOptions: { 
        target: "esnext", 
        supported: { 
        bigint: true 
        }, 
    } 
}
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

## Define the Calldata for the secret contract & Callback information&#x20;

Next, you define all of the information that you need for calling the private contract on Secret + add the callback information for the message on its way back.&#x20;

We begin by defining the function that we are going to call on the private secret contract, here it's `request_random` . Next, we add the parameters/calldata for this function, which is `("{ numWords: Number(numWords) }"`and convert it into a JSON string.&#x20;

Next, we define the callback Information. In this case, we are using the gateway contract as an example callback. Here, you would typically put in your own custom callback address and callback selector in.

```typescript
//the function name of the function that is called on the private contract
const handle = "request_random"

//data are the calldata/parameters that are passed into the contract 
const data = JSON.stringify({ numWords: Number(numWords) })
    
const callbackAddress = publicClientAddress.toLowerCase();
//This is an empty callback for the sake of having a callback in the sample code.
//Here, you would put your callback selector for you contract in. 
const callbackSelector = iface.getSighash(iface.getFunction("upgradeHandler"))
const callbackGasLimit = Number(callback_gas_limit)
```

After defining the contract call and callback, we now construct the payload:

```typescript
//payload data that are going to be encrypted
const payload = {
      data: data,
      routing_info: routing_contract,
      routing_code_hash: routing_code_hash,
      user_address: myAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(arrayify(callbackAddress)),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit,
}
```

## Encrypting the Payload

Next, we encrypt the payload using ChaCha20-Poly1305. Then, we hash the encrypted payload into a `ciphertextHash` using Keccak256.

```typescript
//build a Json of the payload 
const payloadJson = JSON.stringify(payload); 
const plaintext = json_to_bytes(payload);
//generate a nonce for ChaCha20-Poly1305 encryption 
//DO NOT skip this, stream cipher encryptions are only secure with a random nonce!
const nonce = crypto.getRandomValues(bytes(12));

//Encrypt the payload using ChachaPoly1305 and concat the ciphertext+tag to fit the Rust ChaChaPoly1305 requirements
const [ciphertextClient, tagClient] = chacha20_poly1305_seal(sharedKey, nonce, plaintext);
const ciphertext = concat([ciphertextClient, tagClient]);

//get Metamask to sign the payloadhash with personal_sign
const ciphertextHash = keccak256(ciphertext)
```

## Signing the Payload with Metamask

Next, we use Metamask to sign the `ciphertextHash` using `personal_sign`. Then, we recover the `user_pubkey` from this signed message, which will be also passed into the Public Gateway.

{% hint style="info" %}
Internally, Metamask takes the  `ciphertextHash`, preprends the `"\x19Ethereum Signed Message:\n32"` string and then hashes it using Keccak256, which results the `payloadHash`. Metamask actually signs the `payloadHash` to get the signature. Keep this in mind when verifying the signature against the `payloadHash` and NOT the `ciphertextHash`.
{% endhint %}

```typescript
//this is what metamask really signs with personal_sign, it prepends the ethereum signed message here
const payloadHash = keccak256(concat([
      text_to_bytes("\x19Ethereum Signed Message:\n32"),
      arrayify(ciphertextHash),
]))
//this is what we provide to metamask
const msgParams = ciphertextHash;
const from = myAddress;
const params = [from, msgParams];
const method = 'personal_sign';

const payloadSignature = await provider.send(method, params)
console.log(`Payload Signature: ${payloadSignature}`)

const user_pubkey = recoverPublicKey(payloadHash, payloadSignature)
console.log(`Recovered public key: ${user_pubkey}`)
```

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

## Packing the Transaction & Send

Lastly, we pack all the information we collected during previous steps into an `info` struct that we send into the Gateway contract. We the encode the function data. Finally, we set the tx\_params. Please make sure to set an approiate gas amount for your contract call, here we used 150k gas. For the value of the TX, we send over the estimated callback gas that we calculated above.

```typescript
// function data to be abi encoded
const _userAddress = myAddress
const _routingInfo = routing_contract
const _payloadHash = payloadHash
const _info = {
        user_key: hexlify(userPublicKeyBytes),
        user_pubkey: user_pubkey, 
        routing_code_hash: routing_code_hash,
        task_destination_network: "pulsar-3",  //Destination for the task, here: pulsar-3 testnet
        handle: handle,
        nonce: hexlify(nonce),
        payload: hexlify(ciphertext),
        payload_signature: payloadSignature,
        callback_gas_limit: Number(callbackGasLimit)
}

const functionData = iface.encodeFunctionData("send",
        [
            _payloadHash,
            _userAddress,
            _routingInfo,
            _info,
        ]
    )
    
const tx_params = [
    {
            gas: hexlify(150000),
            to: publicClientAddress,
            from: myAddress,
            value: hexlify(amountOfGas), // send that extra amount of gas in to pay for the Callback Gas Limit that you set
            data: functionData, 
        },
      ];

const txHash = await provider.send("eth_sendTransaction", tx_params);
```
