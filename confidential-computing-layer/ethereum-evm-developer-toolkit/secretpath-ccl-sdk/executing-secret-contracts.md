---
description: >-
  Learn how to execute Secret Network smart contract on EVM with
  secret-network-ccl npm package
---

# Executing Secret contracts

With `executeSecretContract` you can execute any SecretPath-compatible smart contract on Secret Network.&#x20;

Select the EVM chain that you want to use to execute the Secret Network smart contract and update your secretPathAddress with the [correct gateway contract address](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks/evm/evm-testnet/evm-testnet-gateway-contracts). We are using Sepolia:

```javascript
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
```

For this example, we are going to execute the key value store contract on Secret Network.

`executeSecretContract` requires the Secret `contractAddress`, `codeHash`, `handle` (ie the function you want to execute in the Secret Network contract), and any parameters needed for the handle function, which in this case is `data` and `password`.

<pre class="language-javascript" data-overflow="wrap"><code class="lang-javascript">const {executeSecretContract} = require('./node_modules/secret-network-ccl')
const dotenv = require('dotenv');
dotenv.config();
<strong>
</strong><strong>const contractAddress = "secret1s79j3uaa0g49ncur884vv80ucz7hdwgltgke52";
</strong>const contractCodeHash = "f0947ac3d0459bd5ccc24a43aa18762325f7582dc7919b4557ecf98b81345261";
let privateKey = process.env.PRIVATE_KEY;
let endpoint = `https://sepolia.infura.io/v3/${process.env.INFURA_ENDPOINT}`;
let secretPathAddress = "0x3879E146140b627a5C858a08e507B171D9E43139";
let data = { key: "data", value: "moonbeam" }
let password = { key: "password", value: "1234" };
let handle = "request_encrypt";

executeSecretContract( privateKey, endpoint, secretPathAddress, routing_contract, routing_code_hash, handle,  data,
  password); 
</code></pre>

Call the function to execute a Secret Network smart contract on EVM:

{% code overflow="wrap" %}
```javascript
Transaction sent! Hash: 0x925d1f0c3a4048799026ec52b434512d61408a018346ce2750863700934f1a9d
Transaction confirmed! Block Number: 6155238
```
{% endcode %}
