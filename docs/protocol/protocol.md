---
title: Protocol
---

# About the Protocol
The Secret Network is a blockchain protocol giving developers the ability to use private or sensitive data. Secret Network makes it easy for developers to build new types of solutions (Secret Apps) protecting data privacy while greatly increasing usability. These improvements are critical for achieving mass adoption of privacy-first, decentralized applications.

## How Secret Works
Secret Network offers a platform for building censorship-resistant applications using encrypted data. Rather than letting specific organizations manage private data, Secret relies on a decentralized network of secure processors. Every node operator is equipped with specialized hardware for running code in secure enclaves - also known as Trusted Execution Environments, or TEEs. Nobody, including device administrators, can access the raw information being decrypted and processed within enclaves.

### Secret Network, Step by Step:
1. User sends encrypted input to network
2. Validators (secret nodes) perform computations over encrypted data
3. Proposing validator submits encrypted output
4. Validators achieve consensus on the results
5. Encrypted outputs and encrypted contract state are recorded on Secret Network

Secret contract functionality is based on [CosmWasm](https://www.cosmwasm.com) (a smart contracting platform) running inside TEEs operated by the secret nodes on the network. [WebAssembly](https://webassembly.org) (the “Wasm” part of CosmWasm) allows code written in various languages to run securely on a blockchain. Enigma, and other members of the Secret Network community, are making valuable contributions in parallel with the CosmWasm dev team. Building on their hard work, we are developing a module named `compute`, designed to enable secure data processing.

![Architecture Diagram](/diagrams/architecture.png)

> If you want to build your own Secret DApps, check out our full [documentation](https://docs.scrt.network), which includes a Secret Contract development guide and other useful resources.

## Secret Contracts and Use Cases
Decentralized technologies need privacy to be secure and usable. Secret Contracts (smart contracts on Secret Network) utilize encrypted inputs, encrypted outputs and encrypted state. This greatly improves usability of existing blockchain applications and expands the scope of products that can be built on public blockchains.

Below we highlight existing use cases the Secret Network provides clear performance, security, and usability advantages for:

### Access Control / Digital Content Management
Used for monetization of digital content in decentralized web, such applications would store a decryption key (secret) to the content in the encrypted Secret Contract state, and when users make the required payment (triggering event), the Secret Contract will share a decryption key (secret) that is unique to each user. This use-case is not possible to build in the traditional blockchain networks as all data in state is publicly visible.

### Secret Auctions and Secret Voting
These related use cases involve replacing the inefficient, two-step “commit-reveal” schemes with a better approach with Secret Contracts. Both secret auctions and secret voting allows users to submit encrypted bids or votes and the Secret Contract can compute encrypted inputs to determine the winner(s), without requiring the users to reveal bids or votes. 

### Decentralized Finance
On Secret Network, DeFi users maintain privacy while interacting with a permissionless economic system creating new opportunities for wealth.

## Secret Network and the Cosmos Ecosystem
Secret Network is based on [Cosmos SDK](https://cosmos.network/sdk) and [Tendermint consensus](https://tendermint.com/core). Generally, Cosmos represents a unique approach to developing scalable, interoperable blockchains. The inter-blockchain communication ([IBC](https://cosmos.network/ibc)) protocol supports transmission of information across a network of blockchains. Through IBC, application-specific “zones” and “hubs” can leverage Secret Network by using its distributed network of Secret Nodes for privacy-preserving computations.

> Learn how our “Secret Hub” fits into the Cosmos Ecosystem on the [Secret Blog](https://blog.scrt.network/secret-hub).
