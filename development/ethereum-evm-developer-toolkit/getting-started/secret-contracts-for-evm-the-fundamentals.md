---
description: >-
  In this tutorial for EVM developers, you will learn the basics of working with
  Secret contracts
---

# 🐣 Secret contracts for EVM - the fundamentals

## Overview

If you are an EVM developer who is new to Secret Network smart contracts, this tutorial is for you. You will learn how to:&#x20;

* Connect your Metamask wallet to a Secret Network wallet address
* Fund your Secret wallet
* Upload + Instantiate your first Secret contract
* Execute and Query a Secret contract&#x20;

This tutorial will give you the tools you need to work with the entirety of the EVM developer toolkit. Let's dive in! [🏊](https://emojipedia.org/person-swimming)

## Connecting Metamask to Secret Network

{% hint style="info" %}
* Connect your Metamask wallet [here](https://metamask-secret.vercel.app/) to receive your Secret testnet wallet address&#x20;
* Fund your Secret testnet wallet address with the [testnet faucet](https://faucet.pulsar.scrttestnet.com/)
{% endhint %}

Now you have a Secret testnet wallet address that you can use to sign transactions with your Metamask wallet! 🤯

## Uploading a Secret Contract

First, configure your developer environment by installing rust and adding the WASM build target:&#x20;

#### Install Rust

{% tabs %}
{% tab title="Linux/WSL" %}
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
{% endtab %}

{% tab title="MacOS" %}
```bash
curl https://sh.rustup.rs -sSf | sh
```
{% endtab %}

{% tab title="Windows (PowerShell)" %}
Download and run [`rustup-init.exe`](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe).
{% endtab %}

{% tab title="Windows (GUI)" %}
Download and run [the Rust .msi installer](https://static.rust-lang.org/dist/rust-1.68.2-x86\_64-pc-windows-msvc.msi)
{% endtab %}
{% endtabs %}

#### Add WASM build target

```
rustup target add wasm32-unknown-unknown
```

Next, `git clone` the EVM Getting Started repository:&#x20;

```bash
git clone https://github.com/SecretFoundation/workshops.git
```

`cd` into `evm-getting-started/secret-contract-example:`

```bash
cd evm-getting-started/secret-contract-example
```

The Secret Network smart contract is a simple counter contract that can:

* increment the starting count by 1
* reset the current count
* query the current count

Let's compile it and upload it to Secret Network testnet!&#x20;

**Compile the contract:**

```bash
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
```

After the contract compiles successfully, you will see a `contract.wasm.gz` file in .`/secret-contract-example.`&#x20;

**Upload the contract:**&#x20;

`cd` into `evm-getting-started/node`:

<pre class="language-bash"><code class="lang-bash"><strong>cd evm-getting-started/node
</strong></code></pre>

**Install the dependencies:**

```basic
npm i
```

**Upload + Instantiate the contract:**&#x20;

```bash
node deploy
```

Upon successful instantiation, a contract address will be returned:&#x20;

```bash
codeId:  4845
Contract hash: 3bf70d2194564884515d292e720119a3bdee52fdc5bdf865ab36323401442bd8
contract address: secret1ew8yaggu0yyqtyjqx3yp4hjezf5vryxwj6p4tt
```

## Executing a Secret Contract

Open a new terminal window and `cd` into `./metamask-example`:

```bash
cd evm-getting-started/metamask-example
```

Install the dependencies:&#x20;

```bash
npm i
```

At [line 9 in App.js](https://github.com/SecretFoundation/workshops/blob/c76d42ce88f378b0d1336c838e70d1bb69166195/evm-getting-started/metamask-example/src/App.js#L9), update the `contractAddress` and `codeHash` to your `contractAddress` and `CodeHash`:&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-02-20 at 1.53.24 PM.png" alt=""><figcaption></figcaption></figure>

Then start the application:&#x20;

```bash
npm run start 
```

Now when you connect your wallet, you should be able to increment the count! 🎉

## Summary

By following this guide, you're now equipped to take your Ethereum development skills into the world of Secret Network. You've learned how to connect your Metamask wallet to Secret Network, making it possible for you to interact with a confidential blockchain. You've also added funds to your Secret Network wallet, uploaded and set up your first smart contract, and discovered how to execute and check on your smart contracts. With these steps completed, you're ready to dive into building decentralized applications that prioritize user privacy on the EVM.&#x20;
