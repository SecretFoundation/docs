# Theoretical Attacks

There are several theoretical attacks identified as potentially being problematic for the Secret Network. This page seeks to identify and explain each theoretical attack to educate the community of developers building on the Secret Network.&#x20;

## Two Contracts With The Same `contract_key` Could Deanonymize Their States <a href="#two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states" id="two-contracts-with-the-same-contract-key-could-deanonymize-each-other-s-states"></a>

If an attacker creates a contract with the same `contract_key` as another contract, the state of the original contract can potentially be deanonymized.

For example, an original contract with a permissioned getter, such that only whitelisted addresses can query the getter. In the malicious contract, the attacker can set themselves as the owner and decrypt the state of the original contract using a permissioned getter.

## Deanonymizing With Ciphertext Byte Count <a href="#deanonymizing-with-ciphertext-byte-count" id="deanonymizing-with-ciphertext-byte-count"></a>

No encryption padding, so a value of e.g. "yes" or "no" can be deanonymized by its byte count.

## Tx Replay Attacks <a href="#tx-replay-attacks" id="tx-replay-attacks"></a>

After a contract runs on the chain, an attacker can sync up a node up to a specific block in the chain, and then call into the enclave with the same authenticated user inputs given to the enclave on-chain, but out-of-order, or omit selected messages. A contract not anticipating or protecting against this might end up de-anonymizing the information provided by users. For example, in a naive voting contract (or other personal data collection algorithm), we can de-anonymize a voter by re-running the vote without the target's request, and analyze the difference in final results.

### More Advanced Tx Replay Attacks ⁠— The Millionaire's Problem <a href="#more-advanced-tx-replay-attacks-search-to-decision-for-millionaire-s-problem" id="more-advanced-tx-replay-attacks-search-to-decision-for-millionaire-s-problem"></a>

This attack provides a specific example of a tx replay attack extracting the full information of a client based on replaying a tx.

Specifically, assume for millionaire's that you have a contract where one person inputs their amount of money, then the other person does, then the contract sends them both a single bit saying who has more — this is the simplest implementation for Millionaire's problem-solving. As person 2, binary search the interval of possible money amounts person 1 could have — say you know person 1 has less than N dollars. First, query with N/2 as your value with your node detached from the wider network, get the single bit out (whether the true value is higher or lower), then repeat by re-syncing your node and calling in. By properties of binary search, in log(n) tries (where n is the size of the interval) you'll have the exact value of person 1's input.

The naive solution to this is requiring the node to successfully broadcast the data of person 1 and person 2 to the network before revealing an answer (which is an implicit heartbeat test, that also ensures the transaction isn't replay-able), but even that's imperfect since you can reload the contract and replay the network state up to that broadcast, restoring the original state of the contract, then perform the attack with repeated rollbacks.

_**Note:** You could maybe implement the contract with the help of a 3rd party. I.e. the 2 players send their amounts. When the 3rd party sends an approval tx only then the 2 players can query the result. However, this is not good UX._

### Data Leakage Attacks By Analyzing Metadata Of Contract Usage

Depending on the contract's implementation, an attacker might be able to de-anonymization information about the contract and its clients. Contract developers must consider all the following scenarios and more, and implement mitigations in case some of these attack vectors can compromise privacy aspects of their application.

In all the following scenarios, assume that attackers have local control of a full node. They cannot break into SGX, but they can tightly monitor and debug every other aspect of the node, including trying to feed old transactions directly to the contract inside SGX (replay). Also, though it's encrypted, they can also monitor memory (size), CPU (load) and disk usage (read/write timings and sizes) of the SGX chip.

For encryption, the Secret Network is using [AES-SIV](https://tools.ietf.org/html/rfc5297), which does not pad the ciphertext. This means it leaks information about the plaintext data, specifically about its size, though in most cases it's more secure than other padded encryption schemes. Read more about the encryption specs [HERE](encryption-key-management/transaction-encryption.md).

Most of the below examples talk about an attacker revealing which function was executed on the contract, but this is not the only type of data leakage attackers may target.

Secret Contract developers must analyze the privacy model of their contract - What kind of information must remain private and what kind of information, if revealed, won't affect the operation of the contract and its users. **Analyze what it is that you need to keep private and structure your Secret Contract's boundaries to protect that.**

## Partial Storage Rollback During Contract Runtime <a href="#partial-storage-rollback-during-contract-runtime" id="partial-storage-rollback-during-contract-runtime"></a>

Our current schema can verify that when reading from a field in storage, the value received from the host has been written by the same contract instance to the same field in storage. BUT we can not (yet) verify that the value is the most recent value that was stored there. This means a malicious host can (offline) run a transaction, and then selectively provide outdated values for some fields of the storage. In the worst case, this causes a contract to expose old secrets with new permissions, or new secrets with old permissions. The contract can protect against this by either (e.g.) making sure that pieces of information that have to be synced with each other are saved under the same field (so they are never observed as desynchronized) or (e.g.) somehow verify their validity when reading them from two separate fields of storage.

## Inputs

Encrypted inputs are known by the query sender and the contract. In `query` we don't have an `env` like we do in `init` and `handle`.

| Input | Type       | Encrypted? | Trusted? | Notes |
| ----- | ---------- | ---------- | -------- | ----- |
| `msg` | `QueryMsg` | Yes        | Yes      |       |

`Trusted = No` means this data can easily be forged. An attacker can take its node offline and replay old inputs. This data that is `Trusted = No` by itself cannot be trusted in order to reveal secrets. This is more applicable to `init` and `handle`, but know that an attacker can replay the input `msg` to its offline node.&#x20;

Although `query` cannot change the contract's state and the attacker cannot decrypt the query output, the attacker might be able to deduce private information by monitoring output sizes at different times. See [differences in output return values size](https://github.com/SecretFoundation/docs/blob/main/docs/dev/privacy-model-of-secret-contracts.md#differences-in-output-return-values-size) to learn more about this kind of attack and how to mitigate it.

## Tx Outputs Can Leak Data <a href="#tx-outputs-can-leak-data" id="tx-outputs-can-leak-data"></a>

For example, a dev writes a contract with 2 functions, the first one always outputs 3 events and the second one always outputs 4 events. By counting the number of output events an attacker can know which function was invoked. Also applies with deposits, callbacks and transfers.

## Side Chain Attack

Coming soon!
