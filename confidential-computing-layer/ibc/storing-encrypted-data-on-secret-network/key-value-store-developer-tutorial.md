---
description: >-
  Learn how to use Secret Network as the confidential computation layer of the
  Cosmos with IBC hooks
---

# Key-Value store Developer Tutorial

{% hint style="danger" %}
_These docs are currently in progress 7/26/24_
{% endhint %}

### Overview <a href="#overview" id="overview"></a>

Secret Network's Confidential Computation SDK uses IBC hooks to seamlessly handle cross-chain encrypted payloads, which means Cosmos developers can now encrypt and decrypt messages with a simple token transfer.&#x20;

This tutorial explains how to upload your own Key-value store contract on Secret Network, which you can use to encrypt values on the Cosmos chain of your choice, as well as how to encrypt payloads and transmit them cross-chain. After this tutorial, you will have the tools you need to encrypt messages on any IBC hooks-enabled Cosmos chain.&#x20;

### Getting Started <a href="#getting-started" id="getting-started"></a>

To get started, clone the repository:

```
git clone https://github.com/writersblockchain/cosmos-ccl-sdk/tree/main
```
