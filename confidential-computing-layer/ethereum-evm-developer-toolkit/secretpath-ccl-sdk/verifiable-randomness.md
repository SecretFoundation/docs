---
description: >-
  Learn how to request verifiable randomness on EVM with secret-network-ccl npm
  package
---

# Verifiable Randomness

With `requestRandomness` you can request an array of up to 2000 random numbers on chain from Secret Network.&#x20;

Select the EVM chain that you want to use to execute the Secret Network smart contract and update your secretPathAddress with the [correct gateway contract address](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks/evm/evm-testnet/evm-testnet-gateway-contracts). For this example we are using Sepolia:

```javascript
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
```

`requestRandomness` requires `privateKey`, `endpoint`, `secretPathAddress`, `network`, `numbers,` and `max` parameters:&#x20;

`numbers` is the amount of numbers you want to request

`max` is the the max range the numbers can be. So if you set `max` to 200, the largest random number that can be returned is 200

{% code overflow="wrap" %}
```javascript
const {requestRandomness} = require('./node_modules/secret-network-ccl')

let privateKey = process.env.PRIVATE_KEY;
let endpoint = `https://sepolia.infura.io/v3/${process.env.INFURA_ENDPOINT}`;
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
let numbers = "15";
let max = "5"; 
let network = "testnet";
//use "mainnet" for network if contract is deployed on Secret mainnet

requestRandomness(privateKey, endpoint, secretPathAddress, network numbers, max); 
```
{% endcode %}

Execute the function to request randomness on EVM:

{% code overflow="wrap" %}
```javascript
Transaction sent! Hash: 0x475fb8a46f61f928e46bbbc71a15b7e10c25581647ece64f2538b627f52a0886
Transaction confirmed! Block Number: 6155187
```
{% endcode %}
