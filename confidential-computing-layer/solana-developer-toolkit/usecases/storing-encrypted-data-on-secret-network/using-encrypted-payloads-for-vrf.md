---
description: Learn how to send encrypted strings from Solana to Secret Network
---

# Key-value Store Developer Tutorial

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-28 at 10.19.45 PM.png" alt=""><figcaption></figcaption></figure>

Try out encrypting a `string` on Solana Devnet using the demo [here](https://solana-kv-store.vercel.app/)!

## Overview

SecretPath seamlessly handles encrypted payloads on Solana, which means Solana developers can use SecretPath to encrypt and decrypt messages cross-chainon Secret Network with little-to-no Rust experience required.&#x20;

This tutorial explains how to upload your own Key-value store contract on Secret Network, which you can use to encrypt values on  Solana, as well as how to encrypt payloads and transmit them cross-chain.&#x20;

## Getting Started <a href="#getting-started" id="getting-started"></a>

To get started, clone the repo:

```
git clone https://github.com/writersblockchain/solana-kv-store
```

## Solana Prerequisites <a href="#evm-prerequisites" id="evm-prerequisites"></a>

1. [Install Phantom wallet.](https://phantom.app/download)
2. [Fund your Solana devnet wallet. ](https://faucet.solana.com/)

## Upload Key-Value Store contract on Secret Network&#x20;

`cd` into `solana-kv-store/secret-contract`:

```bash
cd solana-kv-store/secret-contract
```

**Compile the contract:**

{% hint style="info" %}
If you want to make any changes to the Secret Network contract before compiling, feel free to do so! You can learn more about Secret Network contracts in the Secret Network docs [here.](https://docs.scrt.network/secret-network-documentation/development/development-concepts)&#x20;
{% endhint %}

```bash
make build-mainnet
```

Upon successful compilation, you will see your compiled contract code in solana-kv-store/secret-contract [here](https://github.com/writersblockchain/solana-kv-store/blob/main/secret-contract/contract.wasm.gz), file name `contract.wasm.gz`. &#x20;

Now that you have compiled the key-value store contract, let's upload it!&#x20;

`cd` into `node`:&#x20;

```bash
cd node
```

Install secretjs:&#x20;

```bash
npm i
```

**Upload and instantiate the contract on Secret Network testnet:**&#x20;

```bash
node upload
```

You will see a contract id, codehash, and address returned:&#x20;

```bash
codeId:  10207
Contract hash: 931a6fa540446ca028955603fa4b924790cd3c65b3893196dc686de42b833f9c
contract address:  secret1zdz2h5883nlz757dsq2ejfwdy0wpq0uwe2mz0r
```

Congrats!  You've just uploaded and instantiated a cross-chain Solana key value store contract! Now let's call this contract address from your frontend!&#x20;

## Connecting Solana Contract to Frontend

Open a new terminal window and `cd` into solana-kv-store/solana-frontend:

```bash
cd solana-rng/solana-frontend
```

Install the dependencies:&#x20;

```bash
npm i
```

Navigate to solana-kv-store/solana-frontend/src/submit.ts and update the [contract address](https://github.com/writersblockchain/solana-kv-store/blob/b7ca8003e5670e2519f10e40dfb0239f1444eed9/solana-frontend/src/submit.ts#L25) and [code hash](https://github.com/writersblockchain/solana-kv-store/blob/b7ca8003e5670e2519f10e40dfb0239f1444eed9/solana-frontend/src/submit.ts#L26) with your deployed contract and code hash.&#x20;

Now it's time to run the progam! In the terminal:&#x20;

```bash
npm run dev 
```

Congrats! You now have your very own Solana key-value store contract deployed on Secret Network and can encrypt strings on Solana!&#x20;

Enter a `value` to encrypt, and a `key` to decrypt the value :D&#x20;

You can monitor the solana gateway contract [here](https://explorer.solana.com/address/DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcD?cluster=devnet).&#x20;

You should see 2 transactions within a few blocks of each other if the transaction was successful:&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-28 at 10.10.55 PM.png" alt=""><figcaption></figcaption></figure>

Below, you can learn more how the frontend interacts with SecretPath and Solana on a deeper level 🤓

<details>

<summary>Frontend - in depth </summary>

First, install the dependencies:

```bash
npm install @solar-republic/cosmos-grpc @solar-republic/neutrino ethers secure-random @coral-xyz/anchor @solana/web3.js buffer js-sha3
```

Next, import the following into your code:&#x20;

```typescript
import { ecdh, chacha20_poly1305_seal } from "@solar-republic/neutrino";
import { bytes_to_base64, json_to_bytes, sha256, concat, base64_to_bytes} from "@blake.regalia/belt";
import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import { keccak256 } from "js-sha3";
import { SigningKey, ethers } from "ethers";
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

## Import the IDL

Next, import the IDL of the Solana Gateway Program into your project, which you can find here: [gateway-contract-idl.md](../../program-ids/gateway-contract-idl.md "mention").

Import the IDL using:&#x20;

```javascript
import idl from "./solana_gateway.json";
```

## Defining variables&#x20;

To start, we first define all of our variables that we need for the encryption, as well as the gateway information:&#x20;

```javascript
const routing_contract = "secret15n9rw7leh9zc64uqpfxqz2ap3uz4r90e0uz3y3"; //the contract you want to call in secret
const routing_code_hash = "931a6fa540446ca028955603fa4b924790cd3c65b3893196dc686de42b833f9c" //its codehash
```

First, we define the Gateway address that is specific to each chain, which can you can look up here [supported-networks](../../../ethereum-evm-developer-toolkit/supported-networks/ "mention").&#x20;

Second, you need to input the private contract that you are going to call, in our case the key-value store contact on Secret Network. The code for this example contract can be found [here](https://github.com/writersblockchain/solana-kv-store/tree/main/secret-contract) in case you want to deploy it yourself.

## **Initializing the Solana Client**

Next, initialize the Solana client that you are using to call the contract with. Connect to the Phantom wallet and set up the Anchor provider with the Program IDL imported earier.

```typescript
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana as any;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const provider = getProvider();
if (!provider) {
  console.error("Phantom wallet not found");
} else {
  await provider.connect(); // Connect to the wallet
}

const wallet = {
  publicKey: provider.publicKey,
  signTransaction: provider.signTransaction.bind(provider),
  signAllTransactions: provider.signAllTransactions.bind(provider),
};

const anchorProvider = new AnchorProvider(connection, wallet, {
  preflightCommitment: "processed",
});
const program = new Program(idl, anchorProvider);
```

## Generating the encryption key using ECDH

Next, you generate ephermal keys and load in the public encryption key for the Secret Gateway that you can look up in [supported-networks](../../../ethereum-evm-developer-toolkit/supported-networks/ "mention"). Then, use ECDH to create the encryption key:

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

We begin by defining the function that we are going to call on the private secret contract, here it's `store_value` . Next, we add the parameters/calldata for this function, which is `"const data = JSON.stringify({ value: value, key : key, });"`and convert it into a JSON string.&#x20;

**1. Define the Function and Parameters (Calldata)**

The first step is to define the function name and the parameters that you want to pass into the private contract on the Secret Network.

```typescript
const handle = "store_value";
  const value = document.querySelector<HTMLFormElement>("#input1")?.value;
    const key = document.querySelector<HTMLFormElement>("#input2")?.value;
    const callback_gas_limit =
    5000000; 

    const data = JSON.stringify({
      value: value,
      key : key,
    });
```

* **Function Name (`handle`)**: This specifies the function you wish to invoke within the Secret contract. In this example, `"store_value"` is a function that stores a key/value pair.&#x20;
* **Parameters (`data`)**: This is the data that you will pass to the function in the Secret contract. Here, we use a JSON string that contains the key/value pair (`data`) that the function will encrypt.

**2. Derive the Program Derived Addresses (PDAs)**

In Solana, Program Derived Addresses (PDAs) are special types of addresses that are derived deterministically based on a seed and the program ID. Both PDAs are used here to store the gateway and the tasks state. You do not need to manually save them as both of these can deterministally derived from the program id at any time.

```typescript
// Derive the Gateway PDA / Program Derived Address
const [gateway_pda, gateway_bump] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("gateway_state")],
  program.programId
);

// Derive the Tasks PDA / Program Derived Address
const [tasks_pda, task_bump] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("task_state")],
  program.programId
);
```

* **`gateway_pda`**: This is the Program Derived Address associated with the gateway's state. It's derived from a seed ("gateway\_state") and the program ID.
* **`tasks_pda`**: This is the Program Derived Address associated with the tasks' state. Similarly, it's derived from a seed ("task\_state") and the program ID.

**3. Define the Callback Information**

The callback information specifies where and how the call should be handled. This involves setting a callback address and a callback selector.

```typescript
// Include some address as a test (not needed here, you can add whatever you need for your dApp)
const testAddress1 = new web3.PublicKey("HZy2bXo1NmcTWURJvk9c8zofqE2MUvpu7wU722o7gtEN");
const testAddress2 = new web3.PublicKey("GPuidhXoR6PQ5skXEdrnJehYbffCXfLDf7pcnxH2EW7P");
const callbackAddress = Buffer.concat([testAddress1.toBuffer(),testAddress2.toBuffer()]).toString("base64");
```

* **Callback Address (`callbackAddress`)**: These are the addresses where the callback addresses needed for the CPI are included. In this example, it’s simply a test address. In a real-world application, this would typically be your callback contract's address or the addresses designated to handle the callback. The callback addresses are the concatenated 32 bytes of all addresses that need to be accessed for the callback CPI. We take two address public keys (32 bytes each), concatinate them together and then `base64` encode them.&#x20;

Next, we define the **callback selector**. The callback selector is a unique identifier that indicates which program and function the callback CPI should access. It's a combination of the program ID and a specific function identifier.

```typescript
// 8 bytes of the function Identifier = CallbackTest in the SecretPath Solana Contract
const functionIdentifier = [196, 61, 185, 224, 30, 229, 25, 52];
const programId = program.programId.toBuffer();

// Callback Selector is ProgramId (32 bytes) + function identifier (8 bytes) concatenated
const callbackSelector = Buffer.concat([programId, Buffer.from(functionIdentifier)]);
```

* **Function Identifier (`functionIdentifier`)**: This is an array of bytes that uniquely identifies the function within the contract that should process the callback. In this example, the identifier corresponds to a hypothetical function `"CallbackTest"` in the SecretPath Solana contract.
* **Program ID (`programId`)**: This is callback program on Solana that is involved for the callback.
* **Callback Selector (`callbackSelector`)**: This is a combination of the `programId` and the `functionIdentifier`, and it uniquely identifies the callback program and function within the Solana contract.

Finally, we specify the callback compute limit or callback gas limit:

```typescript
const callbackGasLimit = Number(callback_gas_limit);
```

* **Callback Gas Limit (`callbackGasLimit`)**: This represents the amount of gas that should be allocated to process the callback on the Solana side. It's important to estimate this correctly to ensure that the callback can be executed without running out of resources.

After defining the contract call and callback, we now construct the payload:

```typescript
//Payload data that are going to be encrypted
const payload = {
  data: data,
  routing_info: routing_contract,
  routing_code_hash: routing_code_hash,
  user_address: provider.publicKey.toBase58(),
  user_key: Buffer.from(userPublicKeyBytes).toString("base64"),
  callback_address: callbackAddress,
  callback_selector: Buffer.from(callbackSelector).toString("base64"),
  callback_gas_limit: callbackGasLimit,
};
```

## Encrypting the Payload

Next, we encrypt the payload using ChaCha20-Poly1305. Then, we hash the encrypted payload into a `ciphertextHash` using Keccak256.

```typescript
//build a JSON of the payload 
const plaintext = json_to_bytes(payload);

// Generate a nonce for ChaCha20-Poly1305 encryption
//DO NOT skip this, stream cipher encryptions are only secure with a random nonce!
const nonce = crypto.getRandomValues(new Uint8Array(12));

// Encrypt the payload using ChachaPoly1305 and concatenate the ciphertext + tag
const [ciphertextClient, tagClient] = chacha20_poly1305_seal(sharedKey, nonce, plaintext);
const ciphertext = concat([ciphertextClient, tagClient]);

// Create the payloadHash by keccak256 of the ciphertext
const payloadHash = Buffer.from(keccak256.arrayBuffer(ciphertext));

```

## Signing the Payload with Phantom Wallet

Next, we use Phantom to sign the `payloadHash` using `signMessage`.&#x20;

Internally, Phantom Wallet only allows for ASCII encoded strings to be signed to prevent any wallet drainers from signing arbitrary bytes. For us this means that we take the `payloadHash` and `base64` encode it. Phantom then actually directly signs the `base64` string (NOT: the `payloadHash` directly) of the `payloadHash` to get the signature. Keep this in mind when verifying the signature against the `payloadHash.`

```typescript
const payloadHashBase64 = Buffer.from(payloadHash.toString("base64"));
const payloadSignature = await provider.signMessage(payloadHashBase64);
```

## Packing the Transaction & Send

Lastly, we pack all the information we collected during previous steps into an `info` struct that we send into the Gateway contract. We the encode the function data. Finally, we set the tx\_params. Please make sure to set an approiate gas amount for your contract call, here we used 150k gas. For the value of the TX, we send over the estimated callback gas that we calculated above.

```typescript
const executionInfo = {
  userKey: Buffer.from(userPublicKeyBytes),
  userPubkey: payloadSignature.publicKey.toBuffer(),
  routingCodeHash: routing_code_hash,
  taskDestinationNetwork: "pulsar-3",
  handle: handle,
  nonce: Buffer.from(nonce),
  callbackGasLimit: callback_gas_limit,
  payload: Buffer.from(ciphertext),
  payloadSignature: payloadSignature.signature,
};

// Get the latest blockhash
const { blockhash } = await connection.getLatestBlockhash("confirmed");

// Construct the transaction
const tx = await program.methods
  .send(provider.publicKey, routing_contract, executionInfo)
  .accounts({
    gatewayState: gateway_pda,
    taskState: tasks_pda,
    user: provider.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .transaction();

// Set the recent blockhash
tx.recentBlockhash = blockhash;
tx.feePayer = provider.publicKey;

// Sign the transaction using Phantom wallet
const signedTx = await provider.signTransaction(tx);

// Send the signed transaction
const signature = await connection.sendRawTransaction(signedTx.serialize());

// Confirm the transaction
await connection.confirmTransaction(signature);

console.log("Final result after rpc:", tx);
```

</details>

## Summary

In conclusion we constructed and encrypted a payload for SecretPath for Solana direct in the Frontend as well as calling the SecretPath gateway contract.

{% hint style="info" %}
Need help with using encrypted payloads with Secretpath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}
