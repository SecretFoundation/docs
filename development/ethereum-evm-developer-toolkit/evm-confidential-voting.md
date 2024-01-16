---
description: >-
  Learn how to use Secret Network smart contracts to encrypt and decrypt votes
  on Polygon testnet.
---

# EVM Confidential Voting

{% hint style="danger" %}
_**Docs currently in progress: 1/16/24**_
{% endhint %}

## Intro

View the completed fullstack dApp here

## Prerequisites

1. Add Polygon Mumbai testnet to Metamask.
2. Fund your Mumbai wallet.&#x20;

## SECRET

```bash
cd private_voting/secret_network
```

```bash
npx hardhat compile
```

```bash
cd private-voting/polygon
```

```bash
npx hardhat compile
```

```bash
cd private-voting/polygon
```

```bash
npx hardhat compile
```

## EVM

```bash
cd private_voting/polygon
```

```bash
npx hardhat compile
```

<pre class="language-bash"><code class="lang-bash"><strong>npx hardhat run scripts/deploy.js --network polygon
</strong></code></pre>

```bash
npx hardhat --network polygon run ./scripts/create_proposal.js
```

```bash
npx hardhat --network polygon run ./scripts/query_proposals.js
```

```bash
npx hardhat --network polygon run ./scripts/create_keys.js
```

```bash
npx hardhat --network polygon run ./scripts/vote.js
```

