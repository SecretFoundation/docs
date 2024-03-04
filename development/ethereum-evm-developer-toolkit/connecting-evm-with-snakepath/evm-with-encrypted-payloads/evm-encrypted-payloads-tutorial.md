---
description: Learn how to use Snakepath on EVM to encrypt payloads.
---

# EVM Encrypted Payloads Tutorial

## Getting Started

To get started, clone the encrypted payloads example repo:

```bash
git clone https://github.com/writersblockchain/encrypted-payloads.git
```

### Configuring Environment Variables

`cd` into sepolia

```bash
cd sepolia
```

Create an `env` file and add your EVM wallet private key.&#x20;

Update [lines 73-76](https://github.com/writersblockchain/encrypted-payloads/blob/71c86e979978dfa9bf28c5cf380c6c260b119704/sepolia/scripts/encrypt.js#L73) with your eth wallet address (`myAddress)`, a key (any `string` of your choosing), a value, (any `string` of your choosing), and a viewing\_key (any `string` of your choosing).&#x20;



{% hint style="info" %}
`value` is the the data that you want to encrypt, `key` and `viewing_key` are parameters you pass to encrypt the `value.`
{% endhint %}

```javascript
 const myAddress = "";
  const key = "";
  const value = "";
  const viewing_key = "";
```

Once you have decided upon these parameters, simply run `node encrypt:`&#x20;

```bash
node encrypt 
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

## Decrypt your payload

To decrypt your encrypted payload, open a new terminal and `cd` into `secret-contract/node`

```bash
cd secret-contract/node
```

Update [lines 8-9 ](https://github.com/writersblockchain/encrypted-payloads/blob/71c86e979978dfa9bf28c5cf380c6c260b119704/secret-contract/node/decrypt.js#L8)with your `key` and `viewing-key:`

```javascript
  const key = "secret sauce";
  const viewing_key = "my viewing key";
```

Then run `node decrypt:`

```bash
node decrypt 
```

And your decrypted payload will be returned:

```bash
{
  key: 'secret sauce',
  value: 'i love anewbiz',
  message: 'Retrieved value successfully'
}
```

Congrats! You have now used Snakepath to encrypt and decrypt cross-chain payloads.&#x20;
