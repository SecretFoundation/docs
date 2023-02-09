# Design of private smart contracts

Secret Contracts are enabled by the “compute” module of the Cosmos SDK, and execute over plaintext while still allowing for encrypted inputs, outputs, and states because of trusted and verifiable computations. Consensus with an encrypted state is reached by using shared secrets amongst the validator nodes of the network.

In this part of the documentation, we highlight the flow of data for interactions on the secret network and dive into the design of Secret Contracts and their differentiations from standard CosmWasm contracts.

## Overview

* [Secret Contracts Vs public contracts](../../../techstack/privacy-technology/private-computation-and-consensus-flow/private-vs-public-contracts.md)
* [Encryption of the contract state](../../../techstack/privacy-technology/private-computation-and-consensus-flow/encryption-of-the-contract-state.md)
* [Execution of a private smart contract](secret-contracts-execution.md)
* [Input data verification](secret-contracts.md)

