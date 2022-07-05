---
description: https://docs.scrt.network/protocol/protocol.html#how-secret-works
---

# Privacy Technology

## Privacy-preserving smart contract introduction

Smart contract blockchains are typically public by default. This means that the ledger, the transactions and the data contained in the smart contract are accessible to anyone. However, this is not the case with Secret Network as it’s the first blockchain that offers programmable privacy through privacy-preserving smart contracts (“Secret Contracts”). “Secret Contracts” have both public and private metadata. Private data on Secret Network is encrypted at input, state and output and therefore never accessible to any nodes, developers, users, or everyone else.&#x20;

#### Programmable privacy

Programmable privacy, is the ability to compute with private data while allowing for not only transfers (transactional privacy) but arbitrarily private complex computations. This allows developers to include sensitive data in their smart contracts without moving off-chain to centralized (and less secure) systems; allowing for truly private and scalable decentralized applications — The true vision of the decentralized web.

To achieve such programmable privacy, Secret Network uses a combination of techniques which will be explained in the further sections of this documentation.

#### Overview

* Detailed steps for private transactions on Secret Network
* Trusted Execution Environments (TEE) - Intel SGX
  * Security
  * Trusted and untrusted core
  * Remote attestation
* Encryption protocols / Key management
  * Encryption schemes and Key derivation functions
  * Bootstrapping of the network
  * Generating shareable keys
  * Transaction encryption
* Access control&#x20;
  * Viewing keys
  * Permits
* Theoretical attacks
* Comparison of Secret Network to other privacy projects.
