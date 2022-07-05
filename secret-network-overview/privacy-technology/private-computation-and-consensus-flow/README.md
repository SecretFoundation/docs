# Private computation & consensus flow

Secret Contracts are enabled by the “compute” module of the Cosmos SDK, and execute over plaintext while still allowing for encrypted inputs, outputs and state because of trusted and verifiable computations. Consensus with encrypted state is reached by using shared secrets amongst the validator nodes of the network.

In this part of the documentation we highlight the flow of data for interactions on the secret network and dive into the design of Secret Contracts and their differntiations with standard CosmWasm contracts.

#### Overview

* Consensus for private interactions
* Secret contracts - verifiable code
* Secret contracts - execution and output
* Secret contracts vs CosmWasm

