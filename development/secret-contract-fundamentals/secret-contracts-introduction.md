---
description: >-
  This page describes some of the core information required to get up to speed
  about the state of Secret Contracts in comparison to public (cosmos) networks.
---

# Secret Contracts introduction

### CosmWasm smart contracts

Smart contracts on Secret Network follow the widely used [CosmWasm](https://book.cosmwasm.com/) framework. The framework is built as a module for the Cosmos SDK and allows developers to build smart contracts with [Rust](https://doc.rust-lang.org/book/) which compile to [WebAssmebly](https://webassembly.org/) (Wasm). This type of efficient and fast binary, combined with the power of a low-level typed coding language, makes CosmWasm a secure and efficient way for developers to write smart contracts. Contracts on Secret have a public binary just like any other smart contract network, only **the contract input, output and state is encrypted.**

Secret Contracts slightly differ from any standard CosmWasm implementation as they handle encrypted data, secure enclaves, and the key design around that. Secret currently emulates CosmWasm v1.1.9 and is completely compatible over IBC with other V1.0+ Cosmos Smart contract networks. To learn more about IBC compatible contracts you can read [this section](broken-reference).

### Encrypted data storage

Private data (contract input, output and state) on Secret is encrypted using an unforgeable contract encryption key which is unique for every contract. Moreover, the user dedicated state in a contract is only visible to the user themselves. Because of this design, contract migration is a privacy risk. If enabled, a contract admin could upload a malicious contract that reads and prints data entrusted to the old contract. **CosmWasm native contract migration is therefore disabled** on Secret; workarounds are available [here](../development-concepts/contract-migration.md). Additionally, **iterators and raw queries are not supported** as one can not iterate over data stored by a different user as there is no access to their dedicated encryption key.&#x20;

### Available tools and cool features

Secret contract encrypted input and access-controlled output is very powerful and enables many different usecases, combining this with novel development tools creates a powerful framework for developers to leverage. Below some of these tools and ideas are listed to get your brain going.

* [Privacy as a Service](privacy-as-a-service-paas.md) - More utility for other blockchains by leveraging Secret contracts cross-chain. Want to build on polygon, ethereum, Sei, Neutron or Aptos but want additional features only possible with data privacy? You can use Secret contracts cross-chain to keep your application decentralized and offer users new and interesting ways to explore your dApp.
* Storage of private/encryption key (fragments) - One can use Secret contracts to store very sensitive info to enable cool usecases like access-controlled content or even cross-chain account ownership for DAOs and unstoppable threshold wallets.
* [on-chain randomness](available-native-features-modules/secret-vrf-on-chain-randomness.md) (secret-vrf) and hidden (game) state - Games on Secret benefit of true on-chain randomness that can remain hiddin inside the contract forever if so desired. Together with a hidden gamestate this brings a whole new dimension and fairness to turn-based games for Web3 like Poker or Mario party and more clarity and ownership to casino games and lootboxes.
* Frontrunning resistant and privatized DeFi - because of an encrypted mempool secret is frontrunning resistant by default. Order size - unknown, Placed bids - unknown, liquidation points - unknown and many other features from orderbooks to dark pools have these privacy features as well.
* [Secret.js](../tools-and-libraries/frontend-development/secretjs/) -  a Javascript library for interacting with the Secret network, Secret contracts, providing encrypted input and creating viewing keys/permits for encrypted output. The library can also be considered as a more complete Cosm.js and can be used on every other cosmos chain. - Alternatives in [Python](../tools-and-libraries/secretpy.md), [Kotlin](https://github.com/eqoty-labs/secretk), [.Net](../tools-and-libraries/secret-net/) and more exist as well.
* [Polar](../tools-and-libraries/contract-development/polar.md), [Fadroma](../tools-and-libraries/contract-development/fadroma.md),[ Secret-toolkit](../tools-and-libraries/contract-development/secret-toolkit.md) (CW-plus) and[ Secret IDE](../tools-and-libraries/contract-development/secret-ide.md) - Secret has dedicated tooling sets built by external teams and core development that abstract boilerplate code (for DeFi), help with testing scenarios, simplify contract development nightmares like storage and type handling and even catch errors as you work in a dedicated IDE.
* IBC, Interchain accounts/Queries/contracts, Axelar GMP, Bidshop messaging and more - Want to build your application crosschain? Secret has many options for both Message and Asset bridging protocols with the most renowned being IBC (current version IBC-go V3).&#x20;

### Input Data verification

The privacy of Secret Network is reliant on secure enclaves, which impacts how the network performs but also how one should design their contracts to enhance privacy. Firstly, it is important to note that only data originating from inside the enclave is verifiable and any data coming from external resources has to be verified before relying on it for execution. This means data coming from contract callbacks is to be trusted, but the sender address is not. If I allow the sender to create an item on-chain, then only the sender should be able to remove that item. Verifying that it is indeed the sender (data owner) that is requesting this change is done by "input data verification". Explanation of the various network level integrated methods is available [here.](../../overview-ecosystem-and-technology/techstack/privacy-technology/private-computation-and-consensus-flow/secret-contracts.md)

In practice a Secret contract developer does not have to think too much about this as its abstracted away in the data verification process in the contract module of the network.

### Replay/Side-chain attacks - privacy design

When designing contracts for Secret network, one should take into account the usage of so-called replay attacks and other [theoretical attack](../../overview-ecosystem-and-technology/techstack/privacy-technology/theoretical-attacks.md) vectors on secure enclave derived privacy. An example of this is the abundant usage of the Contract hash in Secret contract development. The usage of a contract hash is required to link the input to the specific contract being called. Otherwise one could make a forked chain and replace the contract with one that reads and prints the input parameters. Although encryption for Secret contracts is handled by the protocol, developers should still be mindful of their contract design to optimize for these privacy aspects.&#x20;

One example of such a privacy optimized design would be the use of the Gas evaporation function as added in the v1.9 upgrade and documented here (link coming soon).

#### Summary

* Secret Contracts have private input, output and state. This means all data on-chain is stored as cyphertext and is only accessible by the owner (either the contract or the user). More details are available in the [encryption specs](../../overview-ecosystem-and-technology/techstack/privacy-technology/encryption-key-management/contract-state-encryption.md).
* The binary of any contract is public, meaning the execution logic is verifiable just like any other smart contract blockchain.
* Secret smart contracts are IBC compatible (CosmWasm v1.0+), allowing for cross-chain logic with other IBC-connected chains.
* Unlike vanilla CosmWasm, Secret does not support migrate-able contracts and iterators due to contract privacy design. Workarounds are highlighted under [ugradeabillity](../development-concepts/contract-migration.md) and [storage](../contract-components/storage/keymap.md).
* When designing Secret contracts, the verification of input-data is key to ensure the secure execution of transactions as not all blockchain data is exposed automatically to the enclave.
* Developers need to be mindful of data leakage via replay attacks, improper padding, and more so that the privacy for users of their contracts is optimized.

