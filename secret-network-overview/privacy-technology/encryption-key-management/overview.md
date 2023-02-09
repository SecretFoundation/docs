# Overview

### **Encryption Protocols / Key Management**

In order for Secret Network to use encrypted data as input, output, and state it requires strong encryption and key derivation logic. Secret Network uses several key derivation and encryption techniques:

* [HKDF-SHA256](https://datatracker.ietf.org/doc/html/rfc5869#section-2) function for deterministic key derivation;&#x20;
* [ECDH ](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman)(x25519) function for generating public / private key pairs; and
* [AES-128-SIV](https://tools.ietf.org/html/rfc5297) symmetric encryption scheme.

#### Symmetric And Asymmetric Encryption

A combination of the above symmetric and asymmetric encryption methods is used to create a safe process for the bootstrapping of the decentralized network, the addition of new SGX nodes, and the encryption of input, output, and state. The management of all the private and public keys may only be shared under specific conditions, and others never leave the SGX instance to ensure private data handling.

#### Consensus Seed

The Secret Network uses a random number called the “consensus seed” as a parameter to derive a public and private key set used by the Network for encryption purposes. The consensus seed is unknown to any party in the ecosystem and was created at the genesis of the network by the network itself. For deterministic key generation, the network uses a known “salt” which is chosen to be the hash of the Bitcoin halving block.

#### Transaction encryption

As a transaction is initiated by a user of the network they derive IKM (Input Key Material) using their own private key and the network-generated public key, the network derives the same IKM using the user's public key and the network-generated private key. An encryption key for the transaction is then derived inside the TEE from the IKM, the salt, and a random number generated with the consensus seed. The encryption key is used to encrypt the input specific to this transaction. Only the protocol and the user signing the transaction have access to the encryption key, and therefore access to the input, output, and state related to this specific smart contract computation.
