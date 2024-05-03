# Sealed Bid Auction

## Overview

A first-price sealed-bid auction, also known as a "blind auction", is a type of auction in which all bidders simultaneously submit sealed bids so that no bidder knows the bid of any other participant. The highest bidder pays the price that was submitted. In this tutorial you will learn **how to create a cross-chain sealed bid auction dApp with encrypted bids using**[ **SecretPath**](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath).&#x20;

{% hint style="success" %}
See a live demo [here](https://secretpath-tutorials.vercel.app/)!
{% endhint %}

## SecretPath Contract Design

1. **Contract Deployment**: Participants initiate the process by deploying a Sealed Bid Contract to the Secret Network. This contract contains their auction items and encrypted bids, safeguarding the bid details from public exposure.
2. **Contract Execution via Public Gateway**:
   * The execution sequence begins when the Sealed Bid Contract is interacted with via the Ethereum Virtual Machine (EVM).
   * The SecretPath Public Gateway Smart Contract serves as the intermediary, facilitating communication between the EVM and Secret Network.
3. **Secure Message Transmission**:
   * Messages and transactions pass through the Public Gateway to the Private Gateway Smart Contract,  utilizing ECDH to ensure that the data exchanged remains confidential and tamper-proof, maintaining the integrity of the sealed bid throughout the process.
4. **Finalization**:
   * Once the bidding period concludes, the Sealed Bid Contract processes the bids to determine the winner securely.
   * The outcome is then communicated back through the gateway contracts to the relevant parties on the EVM.



