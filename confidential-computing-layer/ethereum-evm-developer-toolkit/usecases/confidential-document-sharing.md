---
description: >-
  Learn how to store and share confidential documents on the EVM using Secret
  Network.
---

# Confidential Document Sharing

{% hint style="danger" %}
Note: This documentation is currently in progress: 6/25/24
{% endhint %}

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

Create a `.env` file with the following content:

```
ENVIRONMENT= "mainnet" | "testnet" | "local"
```

#### Storage API Keys

Next, navigate to [Pinata](https://app.pinata.cloud/developers/api-keys) and generate a new `API key` + `JWT token` to use for storing documents. Make sure you save the credentials in a safe place because we will be using them shortly :D

{% hint style="info" %}
We are using Pinata as our storage solution for this tutorial, but you could use any of the [storage options](https://github.com/fifty-wei/secret-share-documents/tree/main/sdk-js/src/StoreDocument/Storage) provided in the SDK, or even build your own!&#x20;
{% endhint %}

#### React Imports & State Variables

Navigate to `/src/page.tsx`.

{% hint style="info" %}
To see a barebones implementation of all of the React logic, you can view the completed repo [here](https://github.com/SecretFoundation/share-documents-tutorial?tab=readme-ov-file). Simply clone it to your machine and run `npm run dev`to run it locally.&#x20;
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
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NGEzMzEyOC1mOThiLTQ2ZDAtYTcyMS04Mzk5MDRlZWQ2NDMiLCJlbWFpbCI6InNlYW5yYWQxM0B5YWhvby5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYmEyY2ZjNWUyOTI0Yzg0OTI1NGEiLCJzY29wZWRLZXlTZWNyZXQiOiJlN2EyNTE4ZjRmODczZWNlNGNlMzZkM2NiNjY2OWViNzBmZmM1N2JjMTk5NzQ0YjVlMjlmMjEwZGM3OWVjZDBlIiwiZXhwIjoxNzUwODY2MzEwfQ.2Tv7_kNUjLfkiXZkUDWFs0xsy23gcMGz4e6ZsunQP_s"
      
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

### Summary

This documentation provides a step-by-step guide on how to implement the `@secret-network/share-document` SDK to securely store, view, and share confidential documents on the EVM using Secret Network as the confidential storage layer. The tutorial walks through the process of creating a new wagmi project, configuring it for Polygon Mainnet, and integrating the Secret Network SDK. By following this guide, you have learned how to store documents, view their contents, and manage access permissions. Additionally, the tutorial includes instructions for setting up a Pinata storage solution and initializing the SDK client.

### Special Thanks

Special thanks to the [FiftyWei ](https://www.fiftywei.co/)team for building out this SDK as part of the Secret Network Q1 2024 grants cohort :D&#x20;
