---
description: >-
  Learn how to query Secret Network smart contract on EVM with
  secret-network-ccl npm package
---

# Querying Secret contracts

With `querySecretContract` you can query any SecretPath-compatible smart contract on Secret Network.&#x20;

For this example, we are going to query the key value store contract on Secret Network.

`querySecretContract` requires the Secret `contractAddress`, `codeHash`, `handle` (ie the name of the query function you want to query in the Secret Network contract), and any parameters needed for the query, which in this case is `password`.

{% code overflow="wrap" %}
```javascript
const {querySecretContract} = require('./node_modules/secret-network-ccl')
const dotenv = require('dotenv');
dotenv.config();

const contractAddress = "secret1s79j3uaa0g49ncur884vv80ucz7hdwgltgke52";
const contractCodeHash = "f0947ac3d0459bd5ccc24a43aa18762325f7582dc7919b4557ecf98b81345261";
let password = { password: "2" }
let handle = "retrieve_data";

querySecretContract(  contractAddress, contractCodeHash, handle,
  password); 
```
{% endcode %}

Call the function to execute a Secret Network smart contract on EVM. If you pass the correct `password`, the Secret contract will return your `data`:&#x20;

{% code overflow="wrap" %}
```javascript
{ data: 'secret rules!' }
```
{% endcode %}
