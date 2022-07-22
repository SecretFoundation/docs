---
description: >-
  Contract.rs contains the functions that a user will be calling to interact
  with the contract during a transaction. Those transaction types can be divided
  into three main categories.
---

# Contract.rs

## Init

The init is the function that is run once and only once when the contract is first initialized. This is best suited for holding code to save vital config data or operations that the other functions cannot run without.

## Handles&#x20;

Handles are the transactions in which the state of the contract is changed. In essence, they are the transactions that do things.

## Queries&#x20;

Queries are the transactions in which the state is not changed, but some information is returned to the user. In essence, they are the transactions that tell you things.
