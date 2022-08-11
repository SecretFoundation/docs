---
description: >-
  Note: This section is incomplete, and is a work-in-progress and will be
  actively expanded upon
---

# Differences from Vanilla CW

### Contract Hashes

Contract hashes are required to bind a transaction to the specific contract being called. Otherwise, in a forked chain you could replace the called contract with one that decrypts and prints the input message.

### Iterator Feature

Iterator is missing because keys and values of data are encrypted when stored on-chain. This means that there is no logical structure that can allow iteration over these keys. This feature should become available in a future update.

### Raw Query

Raw queries are not available since raw data is encrypted when stored on-chain. Data can be decrypted only by the contract that owns the data, and so data is only available via permissioned contract queries (smart queries).

### Migrate Function

The Secret Network's version of the CosmWasm runtime disables the ability to natively migrate contracts. Data written to storage using some contract can only ever be accessed by that same contract. This is done for trust and security reasons. Once a user sends some information to a secret contract, there should not be an easy way for anyone to change the code that has access to this information. If it was possible, then the new code would be able to leak any information entrusted by the user to the old code.

### Different Std Package

`secret-std-cosmwasm` vs `std-cosmwasm`
