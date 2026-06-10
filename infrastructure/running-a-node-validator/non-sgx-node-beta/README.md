# Non-SGX Node (Beta)

### Introduction

Note: this functionality is available starting from v 1.25 of Secret Network

Secret Network executes smart contracts inside Intel SGX secure enclaves so that transaction inputs, outputs, and contract state remain encrypted and private. While this is the defining feature of the chain, it imposes a strict hardware requirement on every node that wants to natively process transactions.

The Non-SGX (Replay) Node removes this hardware requirement. It is a fully functional full node — capable of syncing, verifying, and serving the blockchain — that replaces local enclave execution with a deterministic trace replay mechanism. Instead of running the encrypted WASM bytecode itself, it fetches the precise record of what the enclave did (every storage write, every gas charge, every return value) from an upstream SGX node over gRPC, and applies those operations identically to its own state.

The result is a node whose AppHash is bit-for-bit identical to every SGX node on the network, without ever touching an SGX enclave.

