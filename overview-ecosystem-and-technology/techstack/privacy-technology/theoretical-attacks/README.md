# Potential Attacks

There are several theoretical attacks identified as potentially being problematic for the Secret Network. This page seeks to identify and explain each theoretical attack to educate the community of developers building on the Secret Network.

### Two Contracts With The Same `contract_key` Could Deanonymize Their States <a href="#two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states" id="two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states"></a>

If an attacker creates a contract with the same `contract_key` as another contract, the state of the original contract can potentially be deanonymized.

For example, an original contract with a permissioned getter, such that only whitelisted addresses can query the getter. In the malicious contract, the attacker can set themselves as the owner and decrypt the state of the original contract using a permissioned getter.

### &#x20;<a href="#deanonymizing-with-ciphertext-byte-count" id="deanonymizing-with-ciphertext-byte-count"></a>

### &#x20;<a href="#tx-replay-attacks" id="tx-replay-attacks"></a>

###

### Partial Storage Rollback During Contract Runtime <a href="#partial-storage-rollback-during-contract-runtime" id="partial-storage-rollback-during-contract-runtime"></a>

Our current schema can verify that when reading from a field in storage, the value received from the host has been written by the same contract instance to the same field in storage.

BUT we can not (yet) verify that the value is the most recent value that was stored there. This means a malicious host can (offline) run a transaction, and then selectively provide outdated values for some fields of the storage. In the worst case, this causes a contract to expose old secrets with new permissions, or new secrets with old permissions.

The contract can protect against this by either (e.g.) making sure that pieces of information that have to be synced with each other are saved under the same field (so they are never observed as desynchronized) or (e.g.) somehow verify their validity when reading them from two separate fields of storage.

### Inputs

Encrypted inputs are known by the query sender and the contract. In `query` we don't have an `env` like we do in `init` and `handle`.

| Input | Type       | Encrypted? | Trusted? | Notes |
| ----- | ---------- | ---------- | -------- | ----- |
| `msg` | `QueryMsg` | Yes        | Yes      |       |

`Trusted = No` means this data can easily be forged. An attacker can take its node offline and replay old inputs. This data that is `Trusted = No` by itself cannot be trusted in order to reveal secrets. This is more applicable to `init` and `handle`, but know that an attacker can replay the input `msg` to its offline node.

Although `query` cannot change the contract's state and the attacker cannot decrypt the query output, the attacker might be able to deduce private information by monitoring output sizes at different times. See [differences in output return values size ](./#differences-in-output-messages-callbacks)to learn more about this kind of attack and how to mitigate it.

###



###
