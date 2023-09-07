---
description: A step-by-step guide on how to auto-wrap SNIP-20 tokens with IBC hooks.
---

# Auto-wrapping of SNIP-20 tokens with IBC Hooks

_note: this documentation is currently in progress as of 9.7.23_

## Tutorial: Auto-wrapping of SNIP-20 Tokens

In this tutorial, you will learn how to use [IBC hooks](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/ibc-hooks) to auto-wrap [SNIP-20 tokens](https://docs.scrt.network/secret-network-documentation/overview-ecosystem-and-technology/secret-network-overview/private-tokens) between two LocalSecret IBC chains. Simply put, you will learn how to IBC transfer tokens from one blockchain to another blockchain, and in doing so, the token transfer will execute a smart contract call that turns the tokens into privacy-preserving tokens, all with a single token transfer!&#x20;

### Overview

This tutorial will cover the following:&#x20;

1. Set up a Hermes relayer between two LocalSecret chains (Chain A and Chain B)
2. Execute an IBC token transfer between Chain A and Chain B
3. Upload and instantiate a Wasm Hooks wrapper contract on Chain A
4. Upload and instantiate a SNIP-20 contract on Chain A
5. Send tokens from chain A to Chain B, and in doing so, use IBC hooks to auto-wrap SNIP-20 tokens.&#x20;

Let's dive in! 🏊‍♀️

### Set up Hermes Relayer

To follow along with this tutorial, setup a Hermes relayer between two LocalSecret chains using the [Secret IBC setup documentation](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/secret-ibc-setup). Once you have established an [IBC transfer channel](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/secret-ibc-setup#creating-the-ibc-transfer-channel), you are ready to proceed to the next step.&#x20;

### Execute IBC Token Transfer



### Wasm Hooks Contract

### SNIP-20 Contract

### Auto-wrap Tokens







###

