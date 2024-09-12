---
description: >-
  Learn how to send encrypted on-chain random numbers to Solana from Secret
  Network
---

# VRF Developer Tutorial

## Overview

[SecretVRF](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/available-native-features-modules/secret-vrf-on-chain-randomness), Secret Network's on-chain random number generator, enables Solana developers to access **encrypted** **on-chain verifiable random numbers from Secret Network.**&#x20;

In this tutorial, you will learn how to send random numbers from Secret Network to a Solana program. By this end of this tutorial you will:

* Have an understanding of [SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath), Secret Network's trustless Solana and EVM bridge&#x20;
* Upload and instantiate your very own randomness contract on Secret Network
* Request random numbers on Solana from Secret Network
* Connect a frontend to your Solana application

## VRF Demo

{% hint style="info" %}
Try out requesting a random number on Solana Devnet from Secret Network testnet using the demo [here](https://solana-rng.vercel.app/)!&#x20;

Simply request a random number (up to 2000), and click "submit." You can view your returned random number on the gateway program [here](https://explorer.solana.com/address/DKDX8XbTnCgEk8o1RNnCUokiCmadG1Ch5HLxaz7CnhcD?cluster=devnet).&#x20;

After you make the request, **you will see two transaction signatures within a few seconds of each other.** Open the second transaction signature (which contains the callback info with your random numbers) in a new window, then, scroll down to the **program instruction logs** to view the returned random numbers as a `base64 string`:&#x20;
{% endhint %}

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-27 at 8.31.27 PM.png" alt=""><figcaption></figcaption></figure>

Way to go! You just sent an encrypted on-chain random number from Secret Network to a Solana program. Now it's time to learn how to upload your own randomness contract on Secret Network so that you can program it as you see fit. Let's get started 😊

## Getting Started <a href="#getting-started" id="getting-started"></a>

To get started, clone the repo:

```bash
git clone https://github.com/writersblockchain/solana-rng
```

## Solana Prerequisites <a href="#evm-prerequisites" id="evm-prerequisites"></a>

1. [Install Phantom wallet.](https://phantom.app/download)
2. [Fund your Solana devnet wallet. ](https://faucet.solana.com/)

## Understanding SecretPath ✅

Before you upload a randomness program to Secret Network, it is important for you to understand _how_ messages are sent from Solana to Secret Network and vice-versa. This is thanks to a protocol that Secret Network developed called [**SecretPath**](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath), which allows Solana developers to execute programs on Secret Network while preserving the privacy of the inputs and validity of the outputs using ECDH cryptography 🤯.&#x20;

{% hint style="info" %}
On Solana, smart contracts are referred to as "Programs," which is the terminology we will use for smart contracts on Solana and Secret Network throughout this tutorial.
{% endhint %}

SecretPath has two main components: **gateways** and **relayers**.

1. **The Gateway** is a Solana program created by Secret Network that acts as the interface for handling messages between Solana and Secret Network. The gateway program packages, verifies, and encrypts/decrypts messages. **For your purposes, all that you must know is how to properly format your Secret Network program's functions so they can be understood by the Solana gateway program, which you will learn shortly**.&#x20;
2. **Relayers** watch for messages on Solana and then pass them to Secret Network, and vice-versa. They do **not** have access to the actual data (since messages are encrypted), so they can't compromise security. Their main job is ensuring the network runs smoothly by transmitting the messages, but they don’t move tokens or handle funds. **For your purposes, you needn't focus on relayers as Secret Network maintains a relayer for all Solana transactions.**&#x20;

Now that you understand the basics of SecretPath, let's upload your very own RNG program to Secret Network! 🤓&#x20;

## Understanding the RNG program on Secret Network&#x20;

`cd` into `solana-rng/rng`:

```bash
cd rng
```

Let's examine the RNG program. Open the `src` folder and you will see four files:

* [`contract.rs`](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/contract.rs)
* [`lib.rs`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/src/lib.rs)
* [`msg.rs`](using-encrypted-payloads-for-vrf.md#state.rs)
* [`state.rs`](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/state.rs)

Like Solana, programs on Secret Network are written in Rust.  Unlike Solana, Secret Network developers use a framework called Cosmwasm instead of Anchor. Let's examine each of these files before uploading the program to Secret Network testnet.&#x20;

### [state.rs](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/state.rs)

On Solana, programs are **stateless**. On Secret Network, programs (ie smart contracts) are **stateful**. This means that unlike Solana's stateless programs, Secret Network programs maintain persistent state across transactions, allowing for private data storage and processing.&#x20;

[**state.rs** ](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/state.rs)is where you manage your contract's state, which in this case is simply the program info for the master Solana Gateway Contract:&#x20;

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
    pub gateway_address: Addr,
    pub gateway_hash: String,
    pub gateway_key: Binary,
}
```

When you instantiate your program on Secret Network, you save the Solana Gateway Program info (`gateway_address,` `gateway_hash`, and `gateway_key`) in the Secret program so that it knows how to correctly route messages to the Solana Gateway program.&#x20;

### [msg.rs](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/msg.rs)

In Secret Network programs, a **`msg.rs`** file typically defines the structure of messages that your program will send or receive. It outlines how the program interacts with external users, other programs, or blockchain modules, specifying what kind of data is expected in those interactions.

For example, on Solana, you'd define instruction data formats in a similar way when developing programs that interact with accounts. In CosmWasm (Secret Network's smart contract framework), a `msg.rs` file similarly defines the data types for actions like instantiating, executing, and querying programs.

In the context of SecretPath, this `msg.rs` file defines the messages that will be sent to and received from the master Solana gateway program, which is responsible for managing cross-chain communication.&#x20;

### [contract.rs](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/contract.rs)

In the context of the Secret Network, the [`contract.rs`](https://github.com/writersblockchain/solana-rng/blob/main/RNG/src/contract.rs) file is the core of your program logic, much like the Solana program's main instruction handler. It contains the main program functions, handling instantiation, execution, and migration, as well as any specific functionality you’ve built in.

In this file, you define how the program will handle inputs, store state, interact with other programs (like the Solana gateway in SecretPath), and process outputs. Let’s focus on the key function, [`try_random`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/src/contract.rs#L74), since that's the core of how randomness is handled.

The [`try_random`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/src/contract.rs#L74) function is designed to generate random numbers on Secret Network and send them to the Solana Gateway program. Here's a high-level explanation:

* The randomness generation in the contract creates a buffer to store random data, fills it using a pseudorandom number generator (PRNG), and sends the result to the gateway.&#x20;

{% hint style="info" %}
You can modify this code by changing the buffer size, applying custom post-processing like converting to hex, combining randomness with on-chain data, generating numbers in specific ranges, using a different algorithm like a hash function, etc. The sky's the limit!&#x20;
{% endhint %}

* After generating random numbers, the contract returns the result back to the master gateway program. The randomness result is packaged into a `PostExecutionMsg` and passed to the Solana gateway as a callback.

If you want to make any changes to the Secret Network RNG program before compiling, feel free to do so! You can learn more about Secret Network contracts in the Secret Network docs [here.](https://docs.scrt.network/secret-network-documentation/development/development-concepts)&#x20;

Now that you understand how the program works, let's upload it to Secret Network!

### Uploading the RNG program to Secret Network&#x20;

Before you upload the randomness program to Secret Network, you first must compile the code.&#x20;

Compile the randomness contract:

```bash
make build-mainnet
```

`cd` into `node`:&#x20;

```bash
cd node
```

Install secretjs:&#x20;

```bash
npm i
```

Open [`upload.js`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/node/upload.js#L10) and examine the code. You needn't change anything here unless you want to upload the Secret Network program to Mainnet instead of testnet.&#x20;

{% hint style="info" %}
Remember earlier when you learned that you must instantiate your Secret Network program to correctly communicate with the master Solana Gateway Program? Now that you are uploading your Secret Network randomness program, note that you are instantiating it with the master Solana Gateway [address, code\_hash, and public\_key :D](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/node/upload.js#L10)&#x20;
{% endhint %}

Upload and instantiate the program on Secret Network testnet:&#x20;

```bash
node upload
```

You will see a contract id, codehash, and address returned:&#x20;

```bash
codeId:  10207
Contract hash: 931a6fa540446ca028955603fa4b924790cd3c65b3893196dc686de42b833f9c
contract address:  secret1zdz2h5883nlz757dsq2ejfwdy0wpq0uwe2mz0r
```

Now let's use this program to request random numbers on Solana!&#x20;

## Request Random Numbers on Solana

Now that you have deployed your randomness program on Secret Network, all that's left is to execute it from Solana! To do this, you will use the IDL of the master Solana Gateway program in order to execute your randomness program on Secret Network a**nd correctly format the parameters that you pass to the master Solana Gateway program, which you will now learn how to do** 🤓&#x20;

Let's start by examining [`solana-rng/solana-frontend/src/submit.ts`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/solana-frontend/src/submit.ts#L11)`.`&#x20;

{% hint style="info" %}
`Submit.ts` is where you format and submit the transaction data to the Solana Gateway program so that it can execute your Secret Network randomness program, and then send the randomness back to the Solana Gateway program 🤓&#x20;
{% endhint %}

Notice that the IDL of the master Solana Gateway Program is imported into `submit.ts`, which you can find here: [gateway-contract-idl.md](../../program-ids/gateway-contract-idl.md "mention").

Import the IDL using:&#x20;

```javascript
import idl from "./solana_gateway.json";
```

To start, we first define all of our variables that we need for the encryption, as well as the [gateway information](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/solana-frontend/src/submit.ts#L25).&#x20;

```javascript
const routing_contract = "secret15n9rw7leh9zc64uqpfxqz2ap3uz4r90e0uz3y3"; //the contract you want to call in secret
const routing_code_hash = "931a6fa540446ca028955603fa4b924790cd3c65b3893196dc686de42b833f9c" //its codehash
```

{% hint style="info" %}
Replace `routing_contract` and `routing_code_hash` with your contract address and code hash! This is the Solana program that you just uploaded to Secret network testnet :smile:&#x20;
{% endhint %}

{% hint style="success" %}
At this point, you can run the application exactly as is and the master Solana gateway program will correctly route to the program you deployed on Secret Network. But let's go more in depth so you understand how everything is working together :smile:
{% endhint %}

## Generating the encryption key using ECDH

Next, you [generate ephermal keys ](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/solana-frontend/src/submit.ts#L64)and load in the public encryption key for the Solana Secret Gateway program. Then, use ECDH to create the encryption key:

```typescript
  //Generating ephemeral keys
    const walletEpheremal = ethers.Wallet.createRandom();
    const userPrivateKeyBytes = Buffer.from(
      walletEpheremal.privateKey.slice(2),
      "hex"
    );
    const userPublicKey: string = new SigningKey(walletEpheremal.privateKey)
      .compressedPublicKey;
    const userPublicKeyBytes = Buffer.from(userPublicKey.slice(2), "hex");

    const sharedKey = await sha256(
      ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes)
    );
```

## Define the Calldata for the Secret program & Callback information&#x20;

Next, you define all of the information that you need for calling the RNG program on Secret AND add the callback information for the message on its way back.&#x20;

First, we define the function that we are going to call on your Secret RNG program, which in this case is [`request_random`](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/RNG/src/contract.rs#L69) . Next, we add the parameters/calldata for this function, which is `("{ numWords: Number(numWords) }"`and convert it into a JSON `string`.&#x20;

**1. Define the Function and Parameters (Calldata)**

The first step is to define the function name and the parameters that you want to pass into your RNG program on the Secret Network.

```typescript
const handle = "request_random";
const numWords = document.querySelector<HTMLInputElement>("#input1")?.value;
const callback_gas_limit = document.querySelector<HTMLInputElement>("#input2")?.value;

const data = JSON.stringify({ numWords: Number(numWords) });
```

* **Function Name (`handle`)**: This specifies the function you wish to invoke within the Secret program. In this example, `"request_random"` is a function that generates a random number.
* **Parameters (`data`)**: This is the data that you will pass to the function in the Secret program. Here, we use a JSON string that contains the number of random words (`numWords`) that the function will generate.

**2. Derive the Program Derived Addresses (PDAs)**

In Solana, Program Derived Addresses (PDAs) are special types of addresses that are derived deterministically based on a seed and the program ID. Both PDAs are used here to store the gateway and the tasks' state. You do not need to manually save them as both of these can deterministically derived from the program id at any time.

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

* **Function Identifier (`functionIdentifier`)**: This is an array of bytes that uniquely identifies the function within the contract that should process the callback. In this example, the identifier corresponds to a hypothetical function `"CallbackTest"` in the SecretPath Solana program.
* **Program ID (`programId`)**: This is callback program on Solana that is involved for the callback.
* **Callback Selector (`callbackSelector`)**: This is a combination of the `programId` and the `functionIdentifier`, and it uniquely identifies the callback program and function within the Solana program.

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

Lastly, we pack all the information we collected during previous steps into an `info` struct that we send into the Solana Gateway program. We encode the function data. Finally, we set the `tx_params`. Please make sure to set an appropriate gas amount for your contract call, here we used 150k gas. For the value of the TX, we send over the estimated callback gas that we calculated above.

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

Now that you know how to correctly format and package data for the Solana Gateway program, let's learn how to connect your program to a frontend 🚀

## Connecting Your Solana RNG Program to Frontend&#x20;

Open a new terminal window and `cd` into solana-rng/solana-frontend:

```bash
cd solana-rng/solana-frontend
```

Install the dependencies:&#x20;

```bash
npm i
```

## **Initializing the Solana Client**

Next, [initialize the Solana client](https://github.com/writersblockchain/solana-rng/blob/8c41f370eb609f123f6036391671c76593ba35b7/solana-frontend/src/submit.ts#L35) that you are using to interact with the program. Connect to  Phantom wallet and set up the Anchor provider with the Program IDL imported earlier.

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

Now it's time to run the progam! In the terminal:&#x20;

```bash
npm run dev 
```

Congrats! You now have your very own Solana RNG program deployed on Secret Network and can request encrypted random numbers on Solana!&#x20;

## Summary

In conclusion we constructed and encrypted a payload for SecretPath for Solana direct in the Frontend as well as calling the SecretPath gateway program.

{% hint style="info" %}
Need help with using encrypted payloads with Secretpath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}
