---
description: https://docs.scrt.network/protocol/protocol.html#how-secret-works
---

# Privacy Technology

## Privacy By Default On Secret Network

Smart contract blockchains are typically public by default, meaning the data contained in smart contracts is accessible to everyone. However, this is not the case with Secret Network. Secret Network is the first blockchain offering privacy-preserving smart contracts by default.&#x20;

“Secret Contracts” have both public and private metadata. Private data on Secret Network is encrypted in both input, state, and output — meaning data is never accessible to any observer or validator.&#x20;

## Programmable Privacy

Programmable privacy is the ability to compute with private data while allowing for not only transfers (transactional privacy), but arbitrarily complex computations. Secret Contracts allow for an environment where sensitive data is safe yet usable  —  the true vision of the decentralized web.&#x20;

Secret Network uses a combination of techniques to achieve programmable privacy:

1. Trusted Execution Environments (TEE)
2. Encryption protocols / Key management
3. Access control

## **Trusted Execution Environments  (TEE) —  Intel SGX**

Data flows through the Secret Network through multiple client and on-chain interactions to reach consensus over an encrypted state (see diagram below for more detail).&#x20;

![The data flow for a Secret Contract interaction.](https://cdn-images-1.medium.com/max/800/0\*CkxsmqlU0i-k--V7.png)

### Software Guard Extensions (SGX)

Secret Network uses the Intel’s Software Guard Extensions (SGX) implementation of TEE technology. TEE refers to a secure area of a processor where data is inaccessible to any other component in the system. A TEE acts as a blackbox for computation, input and output can be known, but the state inside the TEE is never revealed. Intel’s Software Guard Extensions (SGX) is a set of security-related instructions built into certain Intel CPUs enabling TEEs.&#x20;

#### How Secret Network Uses SGX

Secret Network leverages TEE technology to do computation with encrypted input, output, and state. The consensus and computation layer of the Secret Network is combined; every validator uses an Intel SGX CPU and processes every transaction. Private metadata used in Secret Contracts is encrypted before send to validators for computation.&#x20;

Data is only decrypted inside the TEE of any specific validator, which is inaccessible to them. Computations following the smart contract are then done over the decrypted data, the output is encrypted and written to state. The consensus encryption seed of the network is only stored inside the TEE of each validator node, no entity has access to the encryption keys.

#### SGX-ME And SGX-SPS

SGX comes in 2 forms; SGX-ME and SGX-SPS. SGX-ME (management engine) uses small extra chips to manage functions related to the enclave such as memory and energy management. SGX-SPS (Server Platform Services) allows the bypassing of the ME chip.&#x20;

#### Secret Network Uses SGX-SPS

To further reduce the number of possible attack vectors on the network, Secret Network has opted to only use SGX-SPS. Hence, all attack vectors of the ME chip do not apply to Secret Network. Furthermore, each full node on Secret Network creates an attestation report that proves that their CPU is using the latest security patches of SGX before it registers. The entire network verifies the attestation report of the new node on-chain, to ensure that node operators cannot decrypt anything.

> 💡 Do you want to better understand the workings of SGX for Secret Network? Then check out t[his article](https://carter-woetzel.medium.com/secret-network-tees-lets-talk-fud-vulnerability-33ca94b6df38) on the intricacies of TEE technology.

## **Encryption Protocols / Key Management**

In order for Secret Network to use encrypted data as input, output, and state it requires strong encryption and key derivation logic. Secret Network uses several key derivation and encryption techniques:

* [HKDF-SHA256](https://datatracker.ietf.org/doc/html/rfc5869#section-2) function for deterministic key derivation&#x20;
* [ECDH ](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman)(x25519) function for generating public / private key pairs
* [AES-128-SIV](https://tools.ietf.org/html/rfc5297) symmetric encryption scheme

### Symmetric And Asymmetric Encryption

A combination of above symmetric and asymmetric encryption methods is used to create a safe process for the bootstrapping of the decentralized network, addition of new SGX nodes, and the encryption of input, output, and state. The management of all the private and public keys may only be shared under specific conditions, and others never leave the SGX instance to ensure private data handling.

#### Consensus Seed

The Secret Network uses a random number called the “consensus seed” as a parameter to derive a public and private key set used by the Network for encryption purposes. The consensus seed is unknown to any party in the ecosystem, and was created at the genesis of the network by the network itself. For deterministic key generation the network uses a known “salt” which is the chosen to be the hash of the Bitcoin halving block.

#### Input Key Material (IKM)

As a transaction is initiated by a user of the network they derive IKM (Input Key Material) using their own private key and the network generated public key, the network derives the same IKM using the users public key and the network generated private key. An encryption key for the transaction is then derived inside the TEE from the IKM, the salt, and a random number generated with the consensus seed. The encryption key is used to encrypt the input specific to this transaction. Only the protocol and the user signing the transaction have access to the encryption key, and therefore access to the input, output, and state related to this specific smart contract computation.

> 💡 [https://docs.scrt.network/protocol/encryption-specs.html#bootstrap-process](https://docs.scrt.network/protocol/encryption-specs.html#bootstrap-process)

## **Access Control**

Since all computations are done privately inside the TEE of the network full nodes and the state of the blockchain is encrypted we would expect that users have no access to their own balance, debt positions, tokens and other important information.&#x20;

However, because users sign transactions with their own private key the protocol knows they should have access to their information. Viewing keys and Permits are the tools used to provide only the owner access to the private data of their signed transactions.

### **Viewing Keys**

Secret Network uses the Cosmos SDK and its infrastructure which makes it so that the identity of a querier (someone requesting data) cannot be cryptographically authenticated. On public networks this might not be a problem for users as they can query data by using their public key. However, on private networks (where only the owners should have access) this is a problem.&#x20;

To solve this problem, viewing keys were implemented as a part of the[ SNIP-20 token specification](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-20.md). Viewing keys act as an encrypted password for the viewing of data related to a specific smart contract and private key. The password can only be created by the private key owner, but anyone with the password who knows the accompanying public key gets access.

#### Creating Viewing Keys

To create a viewing key a user signs a transaction for a specific contract (ex sSCRT token), this transaction asks for a random input from which it generates a viewing key. The viewing key is saved in the contract state together with the users public key (address). To query for private data (ex balance, history) both the viewing key and the accompanying address is required. Anyone who knows the correct combination of key + address can view the private data without needing access to the private key of the address. Secret Network allows users to maintain control over their data and decide what is shared and with whom.

### **Query Permits**

Query permits are an alternative querying method introduced in the [SNIP-24 design specification](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-24.md). Query permits use a cryptographic technique known as public-key encryption coupled with digital signatures.&#x20;

#### Permits

A permit is a formatted message, it outlines several arguments such as what tokens the permit applies to and what permissions the permit should allow (e.g. should the permit allow the querier to view a user’s transaction history, balance, etc.). Permits are not saved in the smart contract state and do not require the initiation of a blockchain transaction. Therefore, permits are a less permanent way of gaining viewing access with less network strain.

#### Signing Permits

Users can sign permits with their account’s private key to give certain dApps or parties viewing access to specific parts of their private data for a specified amount of time. To get viewing access a user sends a query, with the signed permit as an argument, to a smart contract. Once received, the smart contract, using the user’s public key, can validate the identity based on the signature the user provided. If the user’s identity is confirmed, the smart contract returns the data as requested.&#x20;

> 💡 Want to better understand the difference between viewing keys and permits? Consider reading [this article.](https://medium.com/@secretnetwork/secret-network-access-control-viewing-keys-vs-permits-97baad539e72)
