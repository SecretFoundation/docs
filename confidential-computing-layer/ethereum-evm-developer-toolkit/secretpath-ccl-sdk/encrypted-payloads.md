---
description: Learn how to encrypt payloads on EVM with secret-network-ccl npm package
---

# Encrypted Payloads

With `encryptData` you can encrypt a `string` in a Secret Network smart contract which can be queried with a `password.`

Select the EVM chain that you want to use to execute the Secret Network smart contract and update your secretPathAddress with the [correct gateway contract address](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks/evm/evm-testnet/evm-testnet-gateway-contracts). For this example we are using Sepolia:

```javascript
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
```

`encryptData` requires `privateKey`, `endpoint`, `secretPathAddress`, `network,` `data,` and `password` parameters:&#x20;

{% code overflow="wrap" %}
```javascript
const {encryptData} = require('./node_modules/secret-network-ccl')

let privateKey = process.env.PRIVATE_KEY;
let endpoint = `https://sepolia.infura.io/v3/${process.env.INFURA_ENDPOINT}`;
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
let data = "I want to encrypt this data";
let password = "password";
let network = "testnet";
//use "mainnet" for network if contract is deployed on Secret mainnet

encryptData(privateKey, endpoint, secretPathAddress, network, data, password); 
```
{% endcode %}

Execute the function to encrypt your data on EVM:

{% code overflow="wrap" %}
```javascript
Transaction sent!
Hash: 0x3cabab1b7a7f421b8f59890b335febfc1a5ccdc2cd547d2bcd80e6e6cf789e48
Transaction confirmed! Block Number: 6155124
```
{% endcode %}
