---
description: >-
  Learn how to connect EVM compatible chains with Secret Network using Reown
  (Formerly called WalletConnect).
---

# SecretPath + Reown integration

SecretPath 🤝 Reown

[SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath) connects Secret Network to [20+ EVM chains](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/supported-networks), enabling public EVM chains to call functions on Secret Network while preserving the privacy of the inputs and validity of the outputs.&#x20;

With [Reown](https://docs.reown.com/) (formerly called WalletConnect), you can create a seamless user experience with one wallet login that **allows users to interact with Secret Network smart contracts on every SecretPath-connected chain.**&#x20;

{% hint style="info" %}
See [here](https://secretpath-ballz.vercel.app/) for a fullstack SecretPath + Reown demo
{% endhint %}

**In this tutorial, you will learn how to configure SecretPath and Reown in React.js so you can create seamless UI for confidential cross-chain computation** :smile:

## Reown Configuration

1. Sign in to [Reown](https://cloud.reown.com/sign-in).
2. Create a [Reown project](https://cloud.reown.com/app/).&#x20;

{% hint style="info" %}
Be sure to select "WalletKit" for product type:
{% endhint %}

<figure><img src="../../../.gitbook/assets/Screenshot 2024-09-18 at 12.18.43 PM.png" alt="" width="375"><figcaption></figcaption></figure>

In this tutorial, you are building a React.js application. Select "Javascript" for platform to build your React.js app:

<figure><img src="../../../.gitbook/assets/Screenshot 2024-09-18 at 12.19.43 PM.png" alt="" width="375"><figcaption></figcaption></figure>

After successfully creating a project, you will see your project id:&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-09-18 at 12.21.41 PM.png" alt="" width="375"><figcaption></figcaption></figure>

### Connecting Reown to SecretPath

1. Clone the SecretPath Reown repository:&#x20;

```bash
git clone https://github.com/writersblockchain/secretpath-walletconnect
```

5. Install the dependencies:&#x20;

```bash
cd frontend 
npm install 
```

5. Update the [project-id](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L8) with your project-id&#x20;

Now you're ready to use Reown with SecretPath!&#x20;

### Configuring Reown for SecretPath

Now that you have your environment properly configured, let's understand how everything is connected. Run `npm run start` to see your Reown application:

```bash
npm run start
```

Out of the box, you can use this React application as a starting point for your SecretPath + Reown applications.&#x20;

Click "Connect Wallet" and sign in to your Metamask or EVM wallet. Click on the network you are currently connected to in order to see all of the EVM networks available:&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-05-23 at 11.50.46 AM.png" alt="" width="359"><figcaption></figcaption></figure>

All of these 20+ networks are connected to SecretPath, which means any of these chains can call functions on Secret Network smart contracts 🤯

Now let's breakdown each of the parameters that are required to properly configure our  [Web3Modal](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L30).&#x20;

### Web3Modal Parameters

We must pass 5 parameters to Web3Modal: `chainImages`, `ethersConfig`, `chains`, `projectId`, and `metadata`.&#x20;

**chainImages**

[chainImages ](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L31)is an object that associates EVM chain IDs with images that are displayed in the wallet UI. You can add additional chain IDs and images for each additional chain you would like included in your application. Currently, every chain that is supported by SecretPath is included.&#x20;

**ethersConfig**

[ethersConfig](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L18) is an object that contains boilerplate ethers configuration code.  &#x20;

**chains**

[chains](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L94) contains the RPC info for each chain that you connect to SecretPath. The chain info is imported from the [chains.js](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/config/chains.js#L1) file in the config folder. If you have added RPC info for a chain to Metamask before, this should look familiar. &#x20;

**projectId**

Your unique [project id](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L8) generated by Reown.&#x20;

**metadata**

[Metadata](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/components/WalletConnect.js#L11) unique to your dApp.&#x20;

### Putting it all together: SecretPath + Reown

Now that you have your Reown interface enabled to your liking, let's understand how it connects the EVM to Secret Network with SecretPath.&#x20;

Open [App.js](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/App.js#L9). Notice that there are 3 functions working in tandem here:&#x20;

1. [`useEffect`](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/App.js#L12), which returns the currently enabled chain ID (so every time the user switches to a new chain, this is saved in the application state)
2. [`requestRandomness`](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/App.js#L41) - this is our SecretPath function which requests a verifiable random number from a Secret smart contract. It takes the parameter `chainId`, because the application must know which [EVM gateway contract](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/config/contracts.js#L1) to execute based on which EVM chain is currently connected.&#x20;
3. [querySecret](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/App.js#L43) - a query function that queries the random number stored in the Secret Network smart contract

Finally, on click, `requestRandomness` calls the  [`request_random`](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/secret-rng-contract/src/contract.rs#L97) handle in the Secret smart contract, which returns a random number between 1-200. SecretPath knows which EVM gateway contract to execute based on which chain ID is currently enabled by Reown (you can see the if/else logic [here](https://github.com/writersblockchain/secretpath-walletconnect/blob/980989c3386738e98a703fac19341690fa2676d9/frontend/src/functions/requestRandomness.js#L39)).&#x20;

### Summary

✨ SecretPath integrates Secret Network with over 20 EVM chains, enabling public EVM chains to execute functions on Secret Network while preserving privacy and ensuring output validity. Using Reown, developers can create a seamless user experience, allowing users to interact with Secret Network smart contracts across all SecretPath-connected chains through a single wallet login.

This tutorial provides a step-by-step guide to configuring SecretPath and Reown in a React application, starting from signing in with Reown and creating a project, to setting up the development environment. Key configurations include specifying parameters for Web3Modal, such as chainImages, ethersConfig, chains, projectId, and metadata. The tutorial also explains how to connect EVM to Secret Network using functions like `requestRandomness` and `querySecret` within the app, ensuring smooth and confidential cross-chain computations ✨
