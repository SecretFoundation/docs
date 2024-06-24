---
description: >-
  Learn how to store and share cross-chain documents using Axelar GMP and Secret
  Network
---

# Confidential Document Sharing

{% hint style="danger" %}
These docs are currently in progress: 6/24/24
{% endhint %}

### Features

Document Sharing on Secret Network allows you to store and share confidential documents. By using our SDK, you will have the possibility to:

* Store a new document
* See the content of this document
* Grant/Revoke the access to the document to another wallet address

When using our SDK, you will have the possibility to use an EVM account. When using it, through Metamask for instance, it will generate a new secret account linked to your EVM account. Each time you connect to Metamask, you will keep the same Secret account, enabling you to retrieve your confidential documents.&#x20;

Note that when you want to share a document with someone else, you need to provide the secret address of the person you want to share it with.

{% hint style="info" %}
See demo [here](https://secret-share-documents.vercel.app/)
{% endhint %}

### Getting Started&#x20;

```bash
npm create wagmi
```

It will ask you to select a framework. React or Vanilla JS. Select React. it will ask you to select a variant, Vite or Next. I choose Next.&#x20;

cd into your project

```
cd <your project name>
```

and install dependencies + sdk&#x20;

```bash
npm i @secret-network/share-document
```

Update wagmi.ts file for Polygon configuration like so:&#x20;

```typescript
import { http, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [polygon], // Add Polygon chain
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
  ],
  ssr: true,
  transports: {
    [polygon.id]: http(), // Add polygon chain
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
```

Create a `.env` file with the following content:

```
ENVIRONMENT= "mainnet" | "testnet" | "local"
```

```
// Some code
```
