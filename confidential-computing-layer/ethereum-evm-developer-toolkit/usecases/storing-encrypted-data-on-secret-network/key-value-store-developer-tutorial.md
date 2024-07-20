---
description: Learn how to use SecretPath on EVM to encrypt payloads.
---

# Key-Value store Developer Tutorial

## Overview

SecretPath seamlessly handles encrypted payloads on the EVM, which means EVM developers can use SecretPath to encrypt and decrypt messages cross-chain with little-to-no Rust experience required.&#x20;

This tutorial explains how to upload your own Key-value store contract on Secret Network, which you can use to encrypt values on the EVM, as well as how to encrypt payloads and transmit them cross-chain. After this tutorial, you will have the tools you need to use SecretPath to encrypt messages on any [EVM-compatible chain](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/evm-testnet-gateway-contracts).&#x20;

## Getting Started

To get started, clone the SecretPath tutorials repository:

```bash
git clone https://github.com/SecretFoundation/Secretpath-tutorials
```

### Configuring Environment Variables

`cd` into encrypted-payloads/evm-contract

```bash
cd encrypted-payloads/evm-contract
```

Install the dependencies:

```bash
npm install
```

Create an `env` file and add your:

* EVM wallet private key
* Infura API endpoint (Sepolia testnet)

{% hint style="info" %}
See [here](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/encrypted-payloads/evm-contract/.env.local) for a properly configured example env file
{% endhint %}

Get sepolia tokens from faucet:&#x20;

* [Sepolia faucet ](https://www.infura.io/faucet/sepolia)

{% hint style="info" %}
This tutorial is for Sepolia testnet, but there are 10+ chains currently configured that are also compatible by simply swapping out the [SecretPath gateway address](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/evm-testnet-gateway-contracts).
{% endhint %}

Now that your developer environment is properly configured, you're ready to encrypt your first payload with SecretPath!&#x20;

### Upload the Key value store contract on Secret Network

`cd` into encrypted-payloads/secret-contract

```bash
cd encrypted-payloads/secret-contract
```

Compile the Secret Network key value store contract:&#x20;

<pre class="language-bash"><code class="lang-bash"><strong>RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
</strong></code></pre>

`cd` into secret-contract/node

```bash
cd secret-contract/node
```

Install the dependencies:

```bash
npm i
```

Open the upload.js file and review the instantiate message at [line 70](https://github.com/SecretFoundation/Secretpath-tutorials/blob/e5d5d01926a14e8f8509e8d842b7b196be15f858/encrypted-payloads/secret-contract/node/upload.js#L70):&#x20;

```javascript
 let init = {
    gateway_address: gatewayAddress,
    gateway_hash: gatewayHash,
    gateway_key: gatewayPublicKeyBytes,
  };
```

* gatewayAddress is the SecretPath gateway contract address for testnet
* gatewayHash is the SecretPath gateway contract hash for testnet
* gatewayKey is public key used for SecretPath encryption on Secret testnet

{% hint style="warning" %}
These three parameters remain constant and must be passed for every Secret Network contract that implements SecretPath. They can be found [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/secretpath-testnet-pulsar-3-contracts) for testnet.&#x20;
{% endhint %}

To upload and instantiate the contract, run `node upload`:&#x20;

```bash
node upload
```

Upon successful upload, a `contractHash` and `address` will be returned:&#x20;

```javascript
codeId:  5701
Contract_hash: "6311a3f85261fc720d9a61e4ee46fae1c8a23440122b2ed1bbcebf49e3e46ad2"
contract_address:  "secret1j0gpu6tlwnc9fw55wcfsfuml00kqpcnqz7dck7"
```

### Encrypt a payload

Now that you have your key value store smart contract uploaded on Secret Network, let's use it to store  encrypted messages. Most of the ECDH cryptography has been abstracted away so there are only a few values you need to change.&#x20;

`cd` into encrypted-payloads/evm-contract:

```bash
cd encrypted-payloads/evm-contract
```

Open `encrypt.js` in evm-contract/scripts and navigate to [lines 43-49](https://github.com/SecretFoundation/Secretpath-tutorials/blob/f3e3bd85a2b9f868cab26f12143630ce598ae152/encrypted-payloads/evm-contract/scripts/encrypt.js#L43).&#x20;

Update the `routing_contract` and `routing_code_hash` to the contract address and `codehash` of the Secret Network smart contract that you instantiated:&#x20;

```javascript
  //EVM gateway contract address
  const publicClientAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";

  //the contract you want to call in secret
  const routing_contract = "secret1z9wdcmxdad2c07m6m8l5cwvrhmwrkexp64fck0";
  const routing_code_hash =
    "6311a3f85261fc720d9a61e4ee46fae1c8a23440122b2ed1bbcebf49e3e46ad2";
```

{% hint style="info" %}
`publicClientAddress` is the gateway contract address for Sepolia, which is found in Secret's gateway contract docs [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/gateway-contracts/evm-testnet/evm-testnet-gateway-contracts).&#x20;
{% endhint %}

Next, update[ lines 73-77](https://github.com/SecretFoundation/Secretpath-tutorials/blob/63a1df61cab6b9e863989d779bc6b98665e73509/encrypted-payloads/evm-contract/scripts/encrypt.js#L73) with the EVM wallet address associated with the private key in your env file (`myAddress)`, a key (any `string` of your choosing), a value, (any `string` of your choosing), and a viewing\_key (any `string` of your choosing).&#x20;

{% hint style="info" %}
`value` is the data that you want to encrypt, `key` and `viewing_key` are parameters you pass to encrypt the `value.`
{% endhint %}

```javascript
 const myAddress = "";
  const key = "";
  const value = "";
  const viewing_key = "";
```

Next, you are going to set the `handle` variable to call the `store_value` function inside of the Secret contract that you instantiated earlier.  You do this with [line 80](https://github.com/SecretFoundation/Secretpath-tutorials/blob/63a1df61cab6b9e863989d779bc6b98665e73509/encrypted-payloads/evm-contract/scripts/encrypt.js#L80), which corresponds to the [`store_value` function in the Secret contract](https://github.com/SecretFoundation/Secretpath-tutorials/blob/63a1df61cab6b9e863989d779bc6b98665e73509/encrypted-payloads/secret-contract/src/contract.rs#L67):&#x20;

{% code overflow="wrap" %}
```rust
    let handle = msg.handle.as_str();
    match handle {
        "store_value" => store_value(deps, env, msg.input_values, msg.task, msg.input_hash),
        "retrieve_value" => retrieve_value(deps, env, msg.input_values, msg.task, msg.input_hash),
        _ => Err(StdError::generic_err("invalid handle".to_string())),
```
{% endcode %}

Once you have decided upon these parameters, simply run `encrypt.js:`&#x20;

```bash
npx hardhat run scripts/encrypt.js --network sepolia
```

Upon successful encryption, your payload hash will be returned:&#x20;

```bash
Payload Hash: 0xcd51559a345f37217a41757cdbe16e7b816f150d8b29ed1bf59fe6b7b5dbfbff
Payload Signature: 0x985085588613f7cf7cd8ca117b747ed8d9f604ee3fca9a66c3cee1ebeb1bc38f17fbe8e63438715f7f479e4e178b4022afbcf0b3967156b8ea1d84ebce7d3f321c
Recovered public key: 0x0423d8d8b518902cd6b0da592af0424719c355a724687cb74d96bd1171eb148edb87f3e9ca67f9ccecde109333461162af4dc09b33604c7e82242852a7142878ec
Verify this matches the user address: 0x49e01eb08bBF0696Ed0df8cD894906f7Da635929
_userAddress: 0x49e01eb08bBF0696Ed0df8cD894906f7Da635929
  _routingInfo: secret1pfg825wflcl40dqpd3yj96zhevnlxkh35hedks 
  _payloadHash: 0xcd51559a345f37217a41757cdbe16e7b816f150d8b29ed1bf59fe6b7b5dbfbff 
  _info: {"user_key":"0x02b7411401eb089a091ba7680e7f13588d8d297a4ad215aafd24eda0a397d50a2e","user_pubkey":"0x0423d8d8b518902cd6b0da592af0424719c355a724687cb74d96bd1171eb148edb87f3e9ca67f9ccecde109333461162af4dc09b33604c7e82242852a7142878ec","routing_code_hash":"fc5007efb0580334be20142a3011f34101be681eaa2fe277ee429f4d76107876","task_destination_network":"pulsar-3","handle":"store_value","nonce":"0x3a813b8a8061a79758a2b69d","payload":"0x4814d8e4e160ca3cc3172d0ef3511b586225b490e8ea8bf08f00d82a4f097711d3edec93fb6005ed98b493a98628d9b4dd32de77b3f6c19892dc854d9c4f9fd2cd311f442ec8b1abf43234b028eb0ea3dd55d4a7ec9bba86a772d8874a7b3066276d0f956d029362412e098b464caeeb07f7df1798666ec803db558dc649faf6438fd2689a93f003f8933e271f7952a2c312db9d54d271fc1b4206a8f6a867c709dc2e9a2a63ccc5e2c3fba6eb86b78f98dadc91e2b1db1f889ab9d90f9cc67649e410b68f67cc687eba859211ce15d1ecb24e583f6516e1b71c7fe78752c8dcce0aa06c8141c93472e7c36023a3d2e471703a8065f7f7513a9e975b600a32e5e890f560bec8f97862d435b97bb6388961ee1b9c5f16017c9a1deb4af5a5539238d003e549bb09a8e803deb95cc89f2ff46d4f68d6bd47bac123d6dd520787820cbbdc371217550d7e7ed510c0fa2d16c1c7d5408a5a3576e38108a9acd02c100e86e265b08aaf28098c09d862349bafea19fe03d214d6b0460f9580d5ad96b0f95cde593ce12f1a5b3c67f913ba9756e5bebc2ab3988fba1156654d4f93cb62d37e8bea36c41c21ce7c4a17d078eddd7393a779a44d6b594e3c36ef85595e04a618d3abbfc8b4570ca9337851d6d3ebc969c1ce16780a967d477c4f2ad4f1ec6d47ee39cfb6df533b2f01e34f3048464e86d36123ffc14224fd7e38204a9968de7618aaca7d169bdd262655111f34869562871c18192dfb2c5cccd9dc72c8a948f725251cd26bc0361862a07f","payload_signature":"0x985085588613f7cf7cd8ca117b747ed8d9f604ee3fca9a66c3cee1ebeb1bc38f17fbe8e63438715f7f479e4e178b4022afbcf0b3967156b8ea1d84ebce7d3f321c","callback_gas_limit":300000}
  _callbackAddress: 0x3879e146140b627a5c858a08e507b171d9e43139,
  _callbackSelector: 0x373d450c ,
  _callbackGasLimit: 300000
Transaction sent! Hash: 0x7cba6149de15e42d0198a1c33548dbcaf6e1142c778f665f62b25a21e9475b57
Transaction confirmed! Block Number: 5412596
```

Congrats, you have encrypted your first cross-chain payload with SecretPath!&#x20;

## Decrypt your payload

To decrypt your encrypted payload, `cd` into `secret-contract/node`

```bash
cd secret-contract/node
```

Open decrypt.js and update [lines 8-9](https://github.com/SecretFoundation/Secretpath-tutorials/blob/8ccd1668c718741826760f3831f33488313ef897/encrypted-payloads/secret-contract/node/decrypt.js#L8) with your `key` and `viewing-key:`

```javascript
  const key = "secret sauce";
  const viewing_key = "my viewing key";
```

Then run `node decrypt:`

```bash
node decrypt 
```

Your decrypted payload will be returned:

```bash
{
  key: 'secret sauce',
  value: 'secret to the moon',
  message: 'Retrieved value successfully'
}
```

Congrats! You have now used SecretPath to encrypt and decrypt cross-chain payloads! [🔥](https://emojipedia.org/fire)

### Summary

SecretPath is a powerful addition to Secret Network’s cross-chain messaging capabilities. Along with [IBC](https://cosmos.network/ibc/) and [Axelar GMP](https://docs.axelar.dev/dev/general-message-passing/overview), and eventually to be joined by additional bridging technologies like [Wormhole](https://wormhole.com/) and [Union](https://union.build/), it enables [groundbreaking new use-cases](https://scrt.network/blog/introducing-privacy-as-a-service/) for Web3 applications by providing access to confidential computation. This facilitates novel applications such as [private voting for DAOs](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/usecases/confidential-voting/confidential-voting-developer-tutorial), [secure random number generation](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/usecases/vrf/vrf-developer-tutorial), confidential data access control via NFTs, encrypted DeFi order books, sealed-bid auctions, and [storing encrypted data](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/usecases/storing-encrypted-data-on-secret-network/key-value-store-developer-tutorial).&#x20;

We also encourage developers to check out our [grants program](https://scrt.network/blog/q224-grants-open/) to get funding for building with SecretPath, and to join our [Discord](https://scrt.network/discord) and [Telegram](https://t.me/SCRTCommunity) to get involved with our community. You can also [contact our team](https://share.hsforms.com/1mdCYD6BmS9OFdTGnnzQ8Lwqgzib) directly if you have any questions about building on Secret.

