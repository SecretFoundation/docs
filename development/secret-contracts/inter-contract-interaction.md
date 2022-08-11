---
description: >-
  General Overview of Inter-Contract Interaction. Note: This section is
  incomplete, and is a work-in-progress and will be actively expanded upon
---

# Contract Interactions

While Inter-Contract communication may seem complex to those coming from Solidity or even other Cosmos Ecosystems, it is simple when using the proper tools.

## Why is this different to other Cosmos chains?

Unlike other Cosmos chains, Secret requires the hash of the smart contract in addition to the address when executing calls to smart contracts. For a user, the interaction with the code hash is transparent, but it is something that is important when writing Secret Contracts and dApps, since we need to include this code hash when we call another contract.

Contract hashes are what binds a transaction to the specific contract code being called. Otherwise, it would be possible to perform a replay attack in a forked chain with a modified contract that decrypts and prints the input message.&#x20;

## How to Get a Contract Hash

### SecretCLI

One way to manually get the hash of a contract is with SecretCLI. Simply use the following command:

```
secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek
```

### REST

Another way is via the REST API.&#x20;

```
curl http://api.scrt.network/wasm/contract/secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek/code-hash
```

### SecretJS

Lastly, if you are developing using SecretJS (or any other sdk) you can programmatically fetch the contract hash using the code-id (the identifier of the code you [_stored_](../getting-started/compile-and-deploy.md#storing-the-contract)_)_

```
const contractCodeHash = await secretjs.query.compute.codeHash(codeId);
```
