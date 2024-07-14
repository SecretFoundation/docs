---
description: Learn how to use submessages on Secret Network
---

# Submessages

{% hint style="danger" %}
_**7/14/24: These docs are currently in progress**_
{% endhint %}

## Introduction

In the CosmWasm SDK, submessages are a powerful feature that allows a contract to execute additional messages within the context of its own execution. They provide a way to perform multiple actions atomically, ensuring that either all actions are successfully executed or none at all. This is particularly useful for complex transactions where multiple steps need to be taken, and any failure in one step should roll back the entire operation.

&#x20;Submessages allow for:&#x20;

1. **Atomic Execution**: Submessages ensure atomic execution, meaning that if any submessage fails, all preceding actions within that transaction are rolled back. This is crucial for maintaining consistency and preventing partial updates.
2. **Multiple Actions**: Submessages allow a contract to send multiple messages, such as executing a series of transfers, interacting with other contracts, or performing various state changes, all within a single transaction.
3. **Custom Handling of Replies**: Contracts can specify how to handle the replies from submessages. This includes defining custom logic based on the success or failure of the submessages. This allows for more complex interactions and decision-making processes within a contract.
4. **Flexibility and Reusability**: By using submessages, contract developers can create more modular and reusable code. Different parts of a contract can send submessages to other parts or even to external contracts, enabling complex workflows and interactions.
5. **Error Handling**: Submessages provide detailed error handling mechanisms. Contracts can capture and respond to errors from submessages, allowing them to gracefully handle failures and take corrective actions.

In this tutorial, you will learn how to use submessages to execute a smart contract on Secret Network from another contract 😊

### Getting Started

In this tutorial, we will be [designing a simple smart contract ](https://github.com/writersblockchain/secret-submessages/tree/master)that can execute a counter smart contract with submessages. Thus, we are working with two smart contracts:

1. Manager Contract - which executes the Counter Contract
2. Counter Contract - which is executed by the Manager Contract&#x20;

By the end of this tutorial, you will understand how to implement submessages to increment a counter smart contract every time the Increment function is called.&#x20;

