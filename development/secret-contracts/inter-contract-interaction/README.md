---
description: General Overview of Inter-Contract Interaction
---

# Inter-Contract Interaction

While Inter-Contract communication may seem complex to those coming from Solidity or even other Cosmos Ecosystems, it is simple when using the proper tools.

## Why Is This Unique From Other Cosmos Chains?

Unlike other Cosmos chains, Secret requires the Hash of the smart contract in addition to the address when calling another contracts functions.

INSERT HERE HOW TO GET THE CONTRACT HASH

## How to Code Interactions

To interact with other contracts, you can make of the Secret-Toolkit Utils

```rust
use secret_toolkit::utils::{InitCallback, HandleCallback, Query};
```

As you can probably guess, `InitCallback` is used for calling a contracts Init function, `HandleCallback` calls a contracts handles, and `Query` calls a contracts query.&#x20;

### Init

### Handle
