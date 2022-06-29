# Theoretical Attacks

**TODO add more**\
**- Add sidechain attack**



#### Deanonymizing with ciphertext byte count <a href="#deanonymizing-with-ciphertext-byte-count" id="deanonymizing-with-ciphertext-byte-count"></a>

No encryption padding, so a value of e.g. "yes" or "no" can be deanonymized by its byte count.

#### [#](https://docs.scrt.network/protocol/encryption-specs.html#two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states)Two contracts with the same `contract_key` could deanonymize each other's states <a href="#two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states" id="two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states"></a>

If an attacker creates a contract with the same `contract_key` as another contract, the state of the original contract can potentially be deanonymized.

For example, an original contract with a permissioned getter, such that only whitelisted addresses can query the getter. In the malicious contract, the attacker can set themselves as the owner and decrypt the state of the original contract using a permissioned getter.

#### Tx replay attacks <a href="#tx-replay-attacks" id="tx-replay-attacks"></a>

After a contract runs on the chain, an attacker can sync up a node up to a specific block in the chain, and then call into the enclave with the same authenticated user inputs given to the enclave on-chain, but out-of-order, or omit selected messages. A contract not anticipating or protecting against this might end up de-anonymizing the information provided by users. For example, in a naive voting contract (or other personal data collection algorithm), we can de-anonymize a voter by re-running the vote without the target's request, and analyze the difference in final results.

#### More advanced tx replay attacks -- search to decision for millionaire's problem <a href="#more-advanced-tx-replay-attacks-search-to-decision-for-millionaire-s-problem" id="more-advanced-tx-replay-attacks-search-to-decision-for-millionaire-s-problem"></a>

This attack provides a specific example of a tx replay attack extracting the full information of a client based on replaying a tx.

Specifically, assume for millionaire's that you have a contract where one person inputs their amount of money, then the other person does, then the contract sends them both a single bit saying who has more — this is the simplest implementation for Millionaire's problem-solving. As person 2, binary search the interval of possible money amounts person 1 could have — say you know person 1 has less than N dollars. First, query with N/2 as your value with your node detached from the wider network, get the single bit out (whether the true value is higher or lower), then repeat by re-syncing your node and calling in. By properties of binary search, in log(n) tries (where n is the size of the interval) you'll have the exact value of person 1's input.

The naive solution to this is requiring the node to successfully broadcast the data of person 1 and person 2 to the network before revealing an answer (which is an implicit heartbeat test, that also ensures the transaction isn't replay-able), but even that's imperfect since you can reload the contract and replay the network state up to that broadcast, restoring the original state of the contract, then perform the attack with repeated rollbacks.

Note: You could maybe implement the contract with the help of a 3rd party. I.e. the 2 players send their amounts. When the 3rd party sends an approval tx only then the 2 players can query the result. However, this is not good UX.

#### Partial storage rollback during contract runtime <a href="#partial-storage-rollback-during-contract-runtime" id="partial-storage-rollback-during-contract-runtime"></a>

Our current schema can verify that when reading from a field in storage, the value received from the host has been written by the same contract instance to the same field in storage. BUT we can not (yet) verify that the value is the most recent value that was stored there. This means a malicious host can (offline) run a transaction, and then selectively provide outdated values for some fields of the storage. In the worst case, this causes a contract to expose old secrets with new permissions, or new secrets with old permissions. The contract can protect against this by either (e.g.) making sure that pieces of information that have to be synced with each other are saved under the same field (so they are never observed as desynchronized) or (e.g.) somehow verify their validity when reading them from two separate fields of storage.

#### Tx outputs can leak data <a href="#tx-outputs-can-leak-data" id="tx-outputs-can-leak-data"></a>

For example, a dev writes a contract with 2 functions, the first one always outputs 3 events and the second one always outputs 4 events. By counting the number of output events an attacker can know which function was invoked. Also applies with deposits, callbacks and transfers.
