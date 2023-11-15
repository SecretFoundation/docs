---
description: >-
  An introduction to the differences between standard CosmWasm smart contracts
  and Secret Contracts
---

# CosmWasm vs Secret CosmWasm

### Cosmwasm and Secret

Secret Contracts are an implementation of the Rust-based library CosmWasm, while additionally enabling computation with private metadata. This brings unique use cases to Secret Network which aren’t possible on other blockchains, and also means that Secret Contracts have features that are different from standard CosmWasm contracts including: contract hashes, a specialized approach to iterators, raw queries, and contract migration.&#x20;

{% hint style="info" %}
An in-depth analysis of [a smart contract](https://github.com/scrtlabs/crosschain-contract-demo/blob/old-std-name/src/contract.rs) that can be **deployed on a vanilla CosmWasm chain as well as Secret Network** can be found in our [cross-deployment tutorial.](../development-concepts/cross-deploy-vanilla-cw-and-secret-contracts.md)
{% endhint %}

### Contract Hashes

Contract hashes are required to bind a transaction to the specific contract being called. Otherwise, in a forked chain you could replace the called contract with one that decrypts and prints the input message.

### Iterator Feature

Secret contracts do not have access to standard CosmWasm iterators because keys and values of data are encrypted when stored on-chain. This means that there is no logical structure that can allow iteration over these keys. However, Secret Labs has developed iterator functionality that can be imported using the [Secret Toolkit storage package.](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/storage)

### Raw Query

Raw queries are not available since raw data is encrypted when stored on-chain. Data can be decrypted only by the contract that owns the data, and so data is only available via permissioned contract queries (smart queries).

### CW-plus

CW-plus, a toolkit for CosmWasm contracts is largely supported but might not be optimal to use in all cases. Secret has its own Toolkit called [Secret-Toolkit](../tools-and-libraries/contract-development/secret-toolkit.md) that has the majority of CW-plus functionality. Alternatively one can alter small parts of CW-plus around the missing Iterator feature to leverage that library as well.

{% hint style="info" %}
Additionally one would have to learn about privacy design, [potential attack vectors](../../overview-ecosystem-and-technology/techstack/privacy-technology/theoretical-attacks/) and [trusted and untrusted data](../secret-contract-fundamentals/secret-contracts.md) to make their application properly privacy preserving.\
\
An introduction to these concepts can be found[ here.](../development-concepts/privacy-design/)
{% endhint %}
