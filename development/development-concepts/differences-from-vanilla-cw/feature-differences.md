# Feature differences

### Cosmwasm and Secret

Secret Contracts are an implementation of the Rust-based library CosmWasm, while additionally enabling computation with private metadata. This brings unique use cases to Secret Network which aren’t possible on other blockchains, and also means that Secret Contracts have features that are different from standard CosmWasm contracts including: contract hashes, a specialized approach to iterators, raw queries, and contract migration.&#x20;

Let's begin with an overview of these concepts before an **in-depth analysis of** [**a smart contract**](https://github.com/scrtlabs/crosschain-contract-demo/blob/old-std-name/src/contract.rs) **that can be deployed on a vanilla CosmWasm chain as well as Secret Network.**&#x20;

### Contract Hashes

Contract hashes are required to bind a transaction to the specific contract being called. Otherwise, in a forked chain you could replace the called contract with one that decrypts and prints the input message.

### Iterator Feature

Secret contracts do not have access to standard CosmWasm iterators because keys and values of data are encrypted when stored on-chain. This means that there is no logical structure that can allow iteration over these keys. However, Secret Labs has developed iterator functionality that can be imported using the [Secret Toolkit storage package.](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/storage)

### Raw Query

Raw queries are not available since raw data is encrypted when stored on-chain. Data can be decrypted only by the contract that owns the data, and so data is only available via permissioned contract queries (smart queries).

### Migrate Function

The implementation of the CosmWasm runtime on Secret Network is designed to safeguard against unauthorized access to data stored within smart contracts. Specifically, the platform disallows the native migration of contracts, which effectively ensures that any data written to storage using a given contract can only be accessed by that same contract. This crucial aspect of Secret Network's approach to smart contract management ensures the utmost privacy and security for its users.

{% hint style="info" %}
Additionally one would have to learn about privacy design, potential attack vectors and trusted and untrusted data to make their application properly privacy preserving.\
\
An introduction to these concepts can be found[ here.](../../secret-contract-fundamentals/secret-contracts-introduction.md)
{% endhint %}
