# Secret Contracts introduction

### CosmWasm smart contracts

Smart contracts on Secret follow the widely used [CosmWasm](https://book.cosmwasm.com/) framework. The framework is build as a module for the Cosmos SDK and allows developers to build smart contracts with [Rust](https://doc.rust-lang.org/book/) which compile to [WebAssmebly](https://webassembly.org/) (Wasm). This type of efficient and fast binary combined with the power of a low-level typed coding language makes CosmWasm a very secure and efficient way for developers to write smart contracts. Contracts on Secret have a public binary just like any other smart contract network, only the contract input, output and state is encrypted.

Secret Contracts do slightly differ from any standard CosmWasm implementation as its handling with encrypted data, secure enclaves and the key design around that. Secret currently emulates CosmWasm v1.1.9 and is completely compatible over IBC with other V1.0+ Cosmos Smart contract networks. To learn more about IBC compatible contracts you can read [this section](../development-concepts/interoperable-contracts/ibc/ibc-contracts.md).

### Encrypted data storage

Private data (contract input, output and state) on Secret is encrypted using an unforgeable contract encryption key which is unique for every contract. Moreover, the user dedicated state in a contract is only visible to the user themselves. Because of this design contract migration is a privacy risk. If enabled a contract admin could upload a malicious contract that reads and prints data entrusted to the old contract. CosmWasm native contract migration is therefore disabled on Secret, workarounds are available [here](../development-concepts/contract-migration.md). Additionally Iterators are not supported as one can not Iterate over data stored by a different user as there is no access to their dedicated encryption key.&#x20;

### Input Data verification

The privacy of secret network is reliant on secure enclaves, this impacts how the network performs but also how one should design their contracts to enhance privacy. Firstly its important to note that only data originating from inside the enclave is verifiable, any data coming from external resources has to be verified before relying on it for execution. This means data coming from contract callbacks is to be trusted but for example the sender address is not. If I allow the sender to create an item on-chain then only the sender should be able to remove that. Verifying that it is indeed the data owner that is requesting this change is done by "input data verification", explanation of the various network level integrated methods is available [here.](../../overview-ecosystem-and-technology/techstack/privacy-technology/private-computation-and-consensus-flow/secret-contracts.md)

### Replay/Side-chain attacks

When designing contracts for Secret network one should take into account the usage of so-called replay attacks and other [theoretical attack](../../overview-ecosystem-and-technology/techstack/privacy-technology/theoretical-attacks.md) vectors on secure enclave derived privacy. An example of this is the abundant usage of the Contract hash in secret contract development. The usage of a contract hash is required to link the input to the specific contract being called. Otherwise one could make a forked chain one could replace the contract with one that reads and prints the input parameters. Although encryption for Secret contracts is handled by the protocol, developers should still be mindful of their contract design to optimize the privacy aspects. For tips and tricks you can read further [here.](../development-concepts/privacy-design-contracts.md)

#### Summary

* Secret Contracts have private input, output and state. This means all data on-chain is stored as cyphertext and is only accessible by the owner (either the contract or the user). More details are available in the [encryption specs](../../overview-ecosystem-and-technology/techstack/privacy-technology/encryption-key-management/contract-state-encryption.md).
* The binary of any contract is public meaning the execution logic is verifiable just like any other smart contract blockchain.
* Secret smart contracts are IBC compatible (CosmWasm v1.0+) allowing for cross-chain logic with other IBC connected chains.
* Unlike vanilla CosmWasm Secret does not support migrate-able contracts and Iterators due to the privacy design. Workarounds are highlighted under [ugradeabillity](../development-concepts/contract-migration.md) and [storage](../contract-components/storage/keymap.md).
* When designing Secret contracts the verification of input-data is key to ensure the secure execution of transactions as not all blockchain data is exposed automatically to the enclave.
* Developers need to be mindful of data leakage via replay attacks, improper padding and more so that the privacy for users of their contracts is optimized.

