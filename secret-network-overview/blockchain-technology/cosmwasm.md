---
description: An introduction to CosmWasm
---

# CosmWasm

## Introduction

CosmWasm is a modular framework for writing secure smart contracts in Rust, and using them in any blockchain built with the Cosmos SDK. It's a low-level tool developers use to implement entirely new features. The framework enables the creation of modular and reusable code for smart contracts, without being exposed to the underlying nature of the blockchain and its inner workings.

## CosmWasm Smart Contracts

Everything in blockchain is a smart contract. To understand what this means, it helps to know that a smart contract is simply a set of rules that describe how parties interact with each other. These rules are written as code and stored on the blockchain, where they can be executed by the network itself.

The blockchain world has seen several attempts to make smart contracts safer, but these solutions were either too complicated or simply didn't work. CosmWasm is different because it's easy to use and works well in practice.

CosmWasm wraps Rust binaries as secure smart contracts. The source code is verified by the compiler and the resulting binary contains all of its dependencies statically linked. This prevents attackers from modifying any part of the contract after it has been deployed on-chain.

### Making Smart Contracts With CosmWasm

You don't have to write Rust code in order to use CosmWasm. If you're a developer and want to write your own contracts using CosmWasm, you can! As long as your programming language generates a WASM binary with no external dependencies, and defines the correct entry points it will work with CosmWasm. This means you can use any programming language of your choosing. You could write your contract in Go or Python, for example, and then deploy it with CosmWasm.
