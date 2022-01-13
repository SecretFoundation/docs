---
title: "Overview"
---

# General Overview

Secret Network is a blockchain protocol built with Rust enabling decentralized applications (dApps) to perform encrypted computations. Secret Contracts make it possible for dApps to use private data on the Secret Network, and are similar to smart contracts on Ethereum and other blockchains. What makes Secret Contracts special is their ability to take encrypted inputs and produce encrypted outputs without exposing any data using encrypted contract states during Secret Contract execution.

For example, Secret Contracts allow developers to create private voting mechanisms that are provably correct within their dApps, or credit scoring applications capable of generating credit scores using verified user data without ever exposing sensitive user data on-chain. Traditionally blockchain-based applications have struggled with preserving data privacy, and Secret Contracts aim to solve the blockchain privacy problem.

The Cosmos SDK using Tendermint for consensus was used to build the Secret Network. Enigma, a company known for making privacy-preserving applications and encrypted computational services, is a significant core contributor to the Secret Network.

Data privacy on the Secret Network is achieved through a combination of key management and encryption protocols working within a Trusted Execution Environment (TEE).

![contracts](./images/diagrams/contracts.png)
