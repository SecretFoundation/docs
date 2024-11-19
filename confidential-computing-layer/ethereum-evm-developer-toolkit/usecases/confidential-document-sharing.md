---
description: >-
  Learn how to store and share confidential documents on the EVM using Secret
  Network.
---

# Confidential Document Sharing

### Introduction

In this tutorial you will learn how to implement the [`@secret-network/share-document` SDK](https://github.com/fifty-wei/secret-share-documents/tree/main) to store, view, and share confidential documents on the EVM using Secret Network as a confidential storage layer.&#x20;

By using our SDK, you will have the possibility to:

* Store a new document
* See the contents of this document
* Grant/Revoke access to the document to another wallet address

{% hint style="info" %}
When using our SDK, your EVM wallet address is linked to a Secret Network wallet address that enables you/your users to retrieve confidential documents.&#x20;
{% endhint %}

Note that when you want to share a document with another wallet address, you need to provide the Secret Network address of the person you want to share it with.

{% hint style="info" %}
See the fullstack Polygon Mainnet demo [here](https://secret-share-documents.vercel.app/).&#x20;
{% endhint %}

### Getting Started&#x20;

Create an empty `wagmi` project:

```bash
npm create wagmi
```

During the install process, `wagmi` will ask you to select a `framework` and a `variant`. To follow along with this tutorial, select `React` for framework, and  `Next` for variant. Once you have installed your `wagmi` project, `cd` into your project:

```
cd <your project name>
```

Install the dependencies & the sdk:&#x20;

```bash
npm i @secret-network/share-document
```

This tutorial will teach you how to use the SDK on Polygon Mainnet. Update your `wagmi.ts` file for Polygon Mainnet configuration like so:&#x20;

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

Create a `.env` file with the following content since we are interacting with the Polygon Mainnet contract:

```
ENVIRONMENT= "mainnet" 
```

{% hint style="info" %}
{% code overflow="wrap" %}
```
ENVIRONMENT can use the following variables depending on which dev environment you are using:
"mainnet" | "testnet" | "local"
```
{% endcode %}
{% endhint %}

### Custom chain

{% hint style="info" %}
If you want to deploy your own EVM contract on a different chain rather than using the deployed contract on Polygon, you can do so by deploying the contract [here](https://github.com/fifty-wei/secret-share-documents/tree/main/polygon-secret). Make sure that you deploy your contract to an [Axelar GMP compatible chain](https://docs.axelar.dev/dev/reference/mainnet-chain-names) ⚠️&#x20;
{% endhint %}

```javascript
import { scroll } from "viem/chains";
import { Config, EvmChain } from "@secret-network/share-document"

const config = new Config({
  sourceChain: EvmChain.SCROLL,
  customChain: scroll  
});
```

#### Storage API Keys

Next, navigate to [Pinata](https://app.pinata.cloud/developers/api-keys) and generate a new `API key` + `JWT token` to use for storing documents. Make sure you save the credentials in a safe place because we will use them shortly :D

{% hint style="info" %}
We are using Pinata as our storage solution for this tutorial, but you can use any of the [storage options](https://github.com/fifty-wei/secret-share-documents/tree/main/sdk-js/src/StoreDocument/Storage) provided in the SDK, or even build your own!&#x20;
{% endhint %}

#### React Imports & State Variables

Navigate to `/src/page.tsx`.

{% hint style="info" %}
To see a barebones implementation of all of the React logic,  view the completed repo [here](https://github.com/SecretFoundation/share-documents-tutorial?tab=readme-ov-file). Simply clone it to your machine and run `npm run dev`to run it locally.&#x20;
{% endhint %}

Configure your React imports + state viarables like so:&#x20;

```javascript
'use client'

import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi'
import { Config, SecretDocumentClient, Environment, MetaMaskWallet, PinataStorage } from "@secret-network/share-document";
import { useEffect, useState } from 'react';

function App() {
  const { address } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<SecretDocumentClient>();
  const [downloadFileId, setDownloadFileId] = useState('');
  const [shareFileId, setShareFileId] = useState('');
  const [secretAddress, setSecretAddress] = useState('');
}
```

Your environment is now configured to store confidential documents on Polygon Mainnet using Secret Network!

### Initialize the Client&#x20;

Configure the SDK client like so:&#x20;

```javascript
// Initialize user wallet for the SDK
  useEffect(() => {
    const initializeClient = async () => {
      if (!walletClient) return;

      const config = new Config({ env: Environment.MAINNET });
      config.useEvmWallet({ client: walletClient });
      console.log("config: ", config);

      const wallet = await MetaMaskWallet.create(window.ethereum, address || "");
      config.useSecretWallet(wallet);

      const gateway = "https://gateway.pinata.cloud";
      const accessToken = "Your JWT token";
      
      const pinataStorage = new PinataStorage(gateway, accessToken);
      config.useStorage(pinataStorage);

      const secretClient = new SecretDocumentClient(config);
      setClient(secretClient);
      console.log("client: ", secretClient);
    };

    initializeClient();
  }, [walletClient, address]);
```

### Store a File

```javascript
// Store File to Secret Network
  const storeFile = async () => {
    if (!client) {
      console.error('Client is not initialized');
      return;
    }
    try {
      const file = new File(["Hello, world!"], "hello.txt", { type: "text/plain" });
      const res = await client.storeDocument().fromFile(file); 
      console.log('File stored successfully:', res);
    } catch (error) {
      console.error('Error storing file:', error);
    }
  };
```

### View a File

```javascript
 // View file
  const viewFile = async () => {
    if (!client) {
      console.error('Client is not initialized');
      return;
    }
    try {
      const res = await client.viewDocument().getAllFileIds();
      console.log('File viewed successfully:', res);
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };
```

### Download a File

```javascript
// Download file
  const downloadFile = async (fileId: string) => {
    if (!client) {
      console.error('Client is not initialized');
      return;
    }
    try {
      const uint8Array = await client.viewDocument().download(fileId);

      // Convert Uint8Array to Blob
      const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'downloaded_file'; // Set the desired file name here

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
```

### Share a File

```javascript
// Share file
  const shareFile = async (fileId: string, secretAddress: string) => {
    if (!client) {
      console.error('Client is not initialized');
      return;
    }
    try {
      const shareDocument = client.shareDocument(fileId);

      // Get existing file access
      // const fileAccess = await shareDocument.getFileAccess();
      // console.log('Existing file access:', fileAccess);

      // Share viewing access to a file
      const addViewingRes = await shareDocument.addViewing([secretAddress]);
      console.log('Viewing access added:', addViewingRes);

      // Delete viewing access to a file
      // const deleteViewingRes = await shareDocument.deleteViewing([secretAddress]);
      // console.log('Viewing access deleted:', deleteViewingRes);

      // Transfer the ownership
      // const changeOwnerRes = await shareDocument.changeOwner(secretAddress);
      // console.log('Ownership transferred:', changeOwnerRes);

      // All in one share operation
      const shareRes = await shareDocument.share({
        // changeOwner: secretAddress,
        addViewing: [secretAddress],
        // deleteViewing: [secretAddress],
      });
      console.log('All-in-one share operation completed:', shareRes);

    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };
```

{% hint style="info" %}
You also have the ability to get existing file access, delete viewing access, and transfer file ownership. See the commented out code above for examples.
{% endhint %}

### Summary

This documentation provides a step-by-step guide on how to implement the `@secret-network/share-document` SDK to securely store, view, and share confidential documents on the EVM using Secret Network as a confidential storage layer. You learned how to create a new wagmi project, configure it for Polygon Mainnet, and integrate the Secret Network SDK. By following this guide, you can now store documents, view their content, and manage access permissions all on the EVM chain of your choosing.&#x20;

### Special Thanks

Special thanks to the [FiftyWei ](https://www.fiftywei.co/)team for building out this SDK as part of the Secret Network Q1 2024 grants cohort :D&#x20;
