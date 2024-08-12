# Using encrypted payloads for VRF

{% hint style="info" %}
Need help with using encrypted payloads with Secretpath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

## Install and import dependencies

First, install all of the the dependencies via NPM:

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

Next, import the IDL of the Solana Gateway Program into your project, which you can find here: [gateway-contract-idl.md](../../solana/gateway-contract-idl.md "mention").

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

Second, you need to input the private contract that you are going to call, in our case the Secret VRF RNG contact on Secret Network. The code for this example contract can be found [here](https://github.com/SecretSaturn/TNLS/tree/main/TNLS-Samples/RNG) in case you want to deploy it yourself.

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

We begin by defining the function that we are going to call on the private secret contract, here it's `request_random` . Next, we add the parameters/calldata for this function, which is `("{ numWords: Number(numWords) }"`and convert it into a JSON string.&#x20;

**1. Define the Function and Parameters (Calldata)**

The first step is to define the function name and the parameters that you want to pass into the private contract on the Secret Network.

```typescript
const handle = "request_random";
const numWords = document.querySelector<HTMLInputElement>("#input1")?.value;
const callback_gas_limit = document.querySelector<HTMLInputElement>("#input2")?.value;

const data = JSON.stringify({ numWords: Number(numWords) });
```

* **Function Name (`handle`)**: This specifies the function you wish to invoke within the Secret contract. In this example, `"request_random"` is a function that generates a random number.
* **Parameters (`data`)**: This is the data that you will pass to the function in the Secret contract. Here, we use a JSON string that contains the number of random words (`numWords`) that the function will generate.

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

The callback information specifies where and how the response from the Secret contract should be handled. This typically involves setting a callback address and a callback selector (which identifies the specific function that will handle the response).

```typescript
// Include some address as a test (not needed here, you can add whatever you need for your dApp)
const testAddress = new web3.PublicKey("HZy2bXo1NmcTWURJvk9c8zofqE2MUvpu7wU722o7gtEN");
const callbackAddress = Buffer.concat([testAddress.toBuffer()]).toString("base64");
```

* **Callback Address (`callbackAddress`)**: This is the address where the response from the Secret contract will be sent. In this example, it’s simply a test address. In a real-world application, this would typically be your contract's address or an address designated to handle the callback.

Next, we define the **callback selector**. The callback selector is a unique identifier that indicates which function on the Solana side should handle the response from the Secret contract. It's a combination of the program ID and a specific function identifier.

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

{% hint style="info" %}
Internally, Phantom Wallet only allows for ASCII encoded strings to be signed to prevent any wallet drainers from signing arbitrary bytes. For us this means that we take the `payloadHash` and `base64` encode it. Phantom then actually directly signs the `base64` string (NOT: the `payloadHash` directly) of the `payloadHash` to get the signature. Keep this in mind when verifying the signature against the `payloadHash.`
{% endhint %}

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

## Summary

In conclusion we constructed and encrypted a payload for SecretPath for Solana direct in the Frontend  as well as calling the SecretPath gateway contract.
