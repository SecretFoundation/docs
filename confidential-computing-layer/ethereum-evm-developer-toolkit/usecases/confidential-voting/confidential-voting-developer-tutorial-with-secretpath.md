---
description: Learn how to use SecretPath to vote confidentially on the EVM
---

# Confidential Voting Developer Tutorial with SecretPath

### Overview <a href="#overview" id="overview"></a>

[SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath) enables EVM developers to use Secret Network as a Confidential Computation Layer (CCL) for [all EVM-compatible chains](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks).&#x20;

In this developer tutorial, you will learn how to use SecretPath to enable confidential voting on the EVM.&#x20;

{% hint style="info" %}
See a fullstack cross-chain voting demo [here](https://secretpath-voting.vercel.app/).&#x20;
{% endhint %}

### Understanding SecretPath

At a high level, you can think of SecretPath as a confidential bridge that passes encrypted data from your EVM chain to a Secret Network smart contract where the data remains encrypted.&#x20;

To work with SecretPath, you must first create a Secret smart contract that stores the encrypted data that you want to send from the EVM. For our purposes, we have created a Secret smart contract with 2 functionalities:&#x20;

1. Create proposals
2. Vote on existing proposals&#x20;

You create and vote on proposals from the EVM, and then that data is sent to your Secret smart contract via SecretPath where it remains encrypted . Pretty cool, right!? 😎 Let's start by examining our Secret voting contract, and then we will breakdown how to send messages to it from the EVM with SecretPath.&#x20;

### Secret Network Prerequisites <a href="#secret-network-prerequisites" id="secret-network-prerequisites"></a>

1. [Add Secret Network testnet to Keplr](https://keplr-connect-pulsar3.vercel.app/).
2. [Fund your Secret testnet wallet](https://faucet.pulsar.scrttestnet.com/).

### Getting Started with Secret Network <a href="#getting-started" id="getting-started"></a>

To get started, clone the [examples repo](https://github.com/SecretFoundation/Secretpath-tutorials):

```
git clone https://github.com/writersblockchain/secretpath-voting.git
```

cd into secretpath-tutorials/secretpath-voting/voting-contract:&#x20;

```
cd secretpath-voting/voting-contract
```

Open [contract.rs](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/voting-contract/src/contract.rs) and examine the `match` statement at [line 67](https://github.com/SecretFoundation/Secretpath-tutorials/blob/c95f11ea0057e06ea568f0d566efae39ebd2b2bd/secretpath-voting/voting-contract/src/contract.rs#L67):&#x20;

{% code overflow="wrap" %}
```rust
match handle {
        "create_proposal" => create_proposal(deps, env, msg.input_values, msg.task, msg.input_hash),
        "create_vote" => create_vote(deps, env, msg.input_values, msg.task, msg.input_hash),

        _ => Err(StdError::generic_err("invalid handle".to_string())),
    }
```
{% endcode %}

This `handle msg` is where you define the functionality of your SecretPath contract. For our purposes, we have written the functions [`create_proposal`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/c95f11ea0057e06ea568f0d566efae39ebd2b2bd/secretpath-voting/voting-contract/src/contract.rs#L75) and [`create_vote`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/c95f11ea0057e06ea568f0d566efae39ebd2b2bd/secretpath-voting/voting-contract/src/contract.rs#L140). You can examine those functions in more detail if you'd like and make adjustments as you see fit 🤓.&#x20;

### Compiling and uploading the Secret contract

Update the [`env`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/voting-contract/node/.env.example) file with your Secret Network wallet mnemonic, and rename it ".env" instead of ".env.example"

**Compile the contract**

```
make build-mainnet
```

`cd` into `voting-contract/node:`

```
cd node
```

**Install the node dependencies**

```
npm install
```

**Set SecretPath parameters:**

Open [upload.js](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/voting-contract/node/upload.js) and configure the SecretPath `gatewayAddress`, `gatewayHash`, and `gatewayPublicKey:`

```
const gatewayAddress = "secret10ex7r7c4y704xyu086lf74ymhrqhypayfk7fkj";

const gatewayHash =
  "012dd8efab9526dec294b6898c812ef6f6ad853e32172788f54ef3c305c1ecc5";

const gatewayPublicKey =
  "0x046d0aac3ef10e69055e934ca899f508ba516832dc74aa4ed4d741052ed5a568774d99d3bfed641a7935ae73aac8e34938db747c2f0e8b2aa95c25d069a575cc8b";
```

`gatewayAddress, gatewayHash`, and `gatewayPublicKey` are needed for instantiating contracts that utilize SecretPath and can be found in the docs [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/supported-networks/evm-testnet/secretpath-testnet-pulsar-3-contracts). You will always use these same 3 parameters for instantiating a SecretPath-compatible contract on testnet.

Upload and instantiate the contract:

```
node upload
```

Upon successful upload and instantiation, add the contract `codeHash` and `address` to your[ `env`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/voting-contract/node/.env.example).

### Send encrypted data to your Secret Contract on the EVM&#x20;

Now that you have instantiated your confidential voting contract on Secret Network, it's time to pass your encrypted data from the EVM to Secret Network. Remember the `create_proposal` and `create_vote` functions from the Secret contract? Now you will execute those functions and send encrypted data to the voting contract! 🤯

#### Bootstrapping the frontend <a href="#list-an-auction-item" id="list-an-auction-item"></a>

Let's create and vote on your first proposal with SecretPath!

`cd` into `secretpath-voting/frontend`:

```
cd secretpath-voting/frontend
```

**Install the dependencies**

```
npm i
```

**Configure env**

Configure the [`env`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/frontend/.env)with your confidential voting `contractAddress` and `codeHash.`

**Run the application**

```
npm run start
```

You should see the following React application running locally in the browser:&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-05-08 at 1.55.43 PM.png" alt=""><figcaption><p>Cross-chain EVM voting frontend</p></figcaption></figure>

Now, create and vote on a proposal to understand the frontend functionality. Then, let's look at the underlying code to understand how we are passing encrypted data from the EVM to Secret Network **🙂**

**Passing Encrypted Data with SecretPath**

As stated above, we have two functions we are executing with SecretPath: `create_proposal` and `create_vote`. In our React application, there are two corresponding components which execute these functions: [CreateProposal](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/frontend/src/components/CreateProposal.js) and [VoteonProposal](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/frontend/src/components/VoteOnProposal.js).&#x20;

**Create a Voting Proposal**

Open CreateProposal.js and navigate to the [handleSubmit](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/CreateProposal.js#L60) function, which contains all of our SecretPath logic.&#x20;

{% hint style="info" %}
The majority of the `handleSubmit` function is boilerplate code used for SecretPath verification, signing, and converting contract inputs into correctly formatted packets and vice versa.
{% endhint %}

For our purposes, we only need to examine 2 lines of code, `data` [on line 88](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/CreateProposal.js#L88) and `handle` on [line 218.](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/CreateProposal.js#L218)

1. `data` is the encrypted data that we are passing from the EVM to the Secret Network voting contract. It takes a user input of  `name`, `description,` and `end_time`. This corresponds with the [`ProposalStoreMsg`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/voting-contract/src/msg.rs#L22) in the Secret contract.&#x20;
2. `handle`  is the function that is actually being called in the Secret contract that you deployed. You are passing the `create_proposal` handle, which executes the [`create_proposal`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/voting-contract/src/contract.rs#L68) function in your  Secret voting contract.

Now that you have all of your SecretPath code configured, execute the frontend to send your voting proposal to the Secret contract!&#x20;

Upon successful execution,  your SecretPath [transaction hash](https://sepolia.etherscan.io/tx/0x8516974443bd3ef71e02ec3172776751a0cceceddb570985d99ffc55d3765f69) will be logged in the console.&#x20;

**Vote on a Proposal**

Open [VoteonProposal.js](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/secretpath-voting/frontend/src/components/VoteOnProposal.js) and navigate to the [`handleSubmit`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/VoteOnProposal.js#L79) function, which, again, contains all of our SecretPath logic.&#x20;

1. [`data`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/VoteOnProposal.js#L116) is the encrypted data that we are passing from the EVM to the Secret Network voting contract. It takes a user input of  `vote`, ("yes" or "no"), `wallet_address` (the wallet address of the voter), and `index.`This corresponds with the [`VoteStoreMsg`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/voting-contract/src/msg.rs#L29) in the Secret contract.&#x20;

{% hint style="info" %}
The voting contract is designed so that each proposal has an ascending index starting with 1. The first proposal you create is index 1, the second is index 2, etc. So when you vote, the React application passes the corresponding index of the proposal that is to be voted on 🙂
{% endhint %}

2. `handle:` You are passing the `create_vote` handle, which executes the [`create_vote`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/voting-contract/src/contract.rs#L69) function in your  Secret voting contract.

Execute the frontend to vote on an existing proposal and send the encrypted vote to the Secret contract!&#x20;

Upon successful execution,  your SecretPath [transaction hash](https://sepolia.etherscan.io/tx/0xb8a8900be8b9906679569687d74ba1ac935ba901d4db9a80c783330300be27a8) will be logged in the console.&#x20;

**Secret Queries - retrieving proposals and votes from Secret contract storage**

Perhaps you are wondering how the React frontend queries the Secret voting contract to display the data that we pass from the EVM. This is possible with [secret.js](https://secretjs.scrt.network/), the javascript SDK for Secret Network.&#x20;

We have [2 query functions](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/voting-contract/src/msg.rs#L58) defined in our Secret voting contract, `RetrieveProposals` and `RetrieveVotes.` Once you have created proposals with votes, you can use execute these query functions with secret.js to:&#x20;

1. [Query all proposals](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/VoteOnProposal.js#L304)
2. [Query all votes ](https://github.com/SecretFoundation/Secretpath-tutorials/blob/7ddc6ec9da761ae1f046c27c75aff9c999ad7c25/secretpath-voting/frontend/src/components/VoteOnProposal.js#L337)

These queried proposals and their associated votes are then displayed in our React frontend.&#x20;

#### Conclusion <a href="#conclusion" id="conclusion"></a>

Congrats! You deployed your very own confidential voting contract on Secret Network and used SecretPath to send cross-chain encrypted votes on an EVM chain. See the fullstack demo [here](https://secretpath-voting.vercel.app/). You now have all of the tools you need to start building your own cross-chain SecretPath contracts on the EVM 🎉

{% hint style="info" %}
Note: the end user of the application is not exposed to Secret Network and is only working directly in the EVM environment. However, the data is fully protected and cannot be viewed by anyone because it is stored in encrypted Secret contracts 😮‍💨
{% endhint %}

If you have any questions or run into any issues, post them on the [Secret Developer Discord ](https://discord.gg/secret-network-360051864110235648)and somebody will assist you shortly.

<details>

<summary><strong>SecretPath - a deep dive</strong> </summary>

Let's dive a little deeper into the boilerplate SecretPath code to understand how our data is encrypted, signed, and formatted by SecretPath. The following comments are for the [`handleSubmit`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/fb9560312a51ffd0ef0283df0d68f851a26d52ca/secretpath-voting/frontend/src/components/CreateProposal.js#L60) function of our CreateProposal component:

```javascript
// Load the contract ABI into an ethers Interface.
const iface = new ethers.utils.Interface(abi);

// Load routing contract address and code hash from environment variables.
const routing_contract = process.env.REACT_APP_SECRET_ADDRESS;
const routing_code_hash = process.env.REACT_APP_CODE_HASH;

// Connect to the Ethereum network through a web provider (e.g., MetaMask).
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

// Request user accounts from the Ethereum provider.
const [myAddress] = await provider.send("eth_requestAccounts", []);

// Generate a new random wallet and extract private key and public key.
const wallet = ethers.Wallet.createRandom();
const userPrivateKeyBytes = arrayify(wallet.privateKey);
const userPublicKey = new SigningKey(wallet.privateKey).compressedPublicKey;
const userPublicKeyBytes = arrayify(userPublicKey);

// Hardcoded public key for the gateway and conversion to bytes.
const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3";
const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);

// Compute a shared key using Elliptic Curve Diffie-Hellman (ECDH) and hash it with SHA-256.
const sharedKey = await sha256(
  ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes)
);

// Get the selector (method ID) for the `upgradeHandler` function from the ABI.
const callbackSelector = iface.getSighash(
  iface.getFunction("upgradeHandler")
);
const callbackGasLimit = 300000;  // Set the gas limit for the callback.

// Create the data object from form state for payload.
const data = JSON.stringify({
  name: name,
  description: description,
  end_time: minutes,
});

// Determine the appropriate client address based on the network (chainId).
let publicClientAddress;

// Mainnet client addresses by chain ID.
if (chainId === "1") { publicClientAddress = mainnet.publicClientAddressEthereumMainnet; }
// Add similar conditions for other chain IDs, both mainnet and testnet.

// Lowercase the client address to ensure consistency.
const callbackAddress = publicClientAddress.toLowerCase();

// Log relevant information.
console.log("callback address: ", callbackAddress);
console.log(data);
console.log(callbackAddress);

// Construct the payload with necessary information for processing.
const payload = {
  data: data,
  routing_info: routing_contract,
  routing_code_hash: routing_code_hash,
  user_address: myAddress,
  user_key: bytes_to_base64(userPublicKeyBytes),
  callback_address: bytes_to_base64(arrayify(callbackAddress)),
  callback_selector: bytes_to_base64(arrayify(callbackSelector)),
  callback_gas_limit: callbackGasLimit,
};

// Serialize the payload to JSON and prepare it for encryption.
const payloadJson = JSON.stringify(payload);
const plaintext = json_to_bytes(payload);
const nonce = crypto.getRandomValues(bytes(12)); // Generate a nonce for encryption.

// Encrypt the payload using ChaCha20-Poly1305, obtain the ciphertext and authentication tag.
const [ciphertextClient, tagClient] = chacha20_poly1305_seal(
  sharedKey,
  nonce,
  plaintext
);
const ciphertext = concat([ciphertextClient, tagClient]);

// Compute the hashes of the ciphertext and prepare it for signature.
const ciphertextHash = keccak256(ciphertext);
const payloadHash = keccak256(
  concat([
    text_to_bytes("\x19Ethereum Signed Message:\n32"),
    arrayify(ciphertextHash),
  ])
);

// Sign the payload hash using the user's account.
const msgParams = ciphertextHash;
const params = [myAddress, msgParams];
const method = "personal_sign";
const payloadSignature = await provider.send(method, params);

// Recover public key from the signature to verify it.
const user_pubkey = recoverPublicKey(payloadHash, payloadSignature);

// Bundle info for the transaction.
const _info = {
  user_key: hexlify(userPublicKeyBytes),
  user_pubkey: user_pubkey,
  routing_code_hash: routing_code_hash,
  task_destination_network: "pulsar-3",
  handle: "create_proposal",
  nonce: hexlify(nonce),
  payload: hexlify(ciphertext),
  payload_signature: payloadSignature,
  callback_gas_limit: callbackGasLimit,
};

// Encode the transaction data using the interface.
const functionData = iface.encodeFunctionData("send", [
  payloadHash,
  myAddress,
  routing_contract,
  _info,
]);

// Fetch the current gas price and calculate the transaction cost.
const gasFee = await provider.getGasPrice();
let amountOfGas;
if (chainId === "4202") {
  amountOfGas = gasFee.mul(callbackGasLimit).mul(100000).div(2);
} else {
  amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
}

// Set up transaction parameters.
const tx_params = {
  gas: hexlify(150000),
  to: publicClientAddress,
  from: myAddress,
  value: hexlify(amountOfGas),
  data: functionData,
};

// Send the transaction and handle the response.
try {
  const txHash = await provider.send("eth_sendTransaction", [tx_params]);
  console.log(`Transaction Hash: ${txHash}`);

  setIsModalVisible(true); // Show the modal on success
} catch (error) {
  console.error("Error submitting transaction:", error);
}
```

</details>
