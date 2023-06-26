---
description: >-
  Learn how to write a full stack decentralized React application utilizing a
  Secret smart contract and Secret.js
---

# Fullstack dApp Integration

## Millionaire Problem Decentralized Application

Yao's Millionaires' problem is a secure multi-party computation problem introduced in 1982 by computer scientist and computational theorist Andrew Yao. The problem discusses two millionaires, Alice and Bob, who are interested in knowing which of them is richer without revealing their actual wealth.&#x20;

[The Secret smart contract](https://github.com/scrtlabs/MillionaireProblemTutorial/tree/master) we will be working with demonstrates an example implementation that allows two millionaires to submit their net worth and determine who is richer, without revealing their actual net worth.&#x20;

[This is the source code](https://github.com/scrtlabs/examples/tree/master/secret-millionaire) for the full stack application. In this demo you will learn how to **integrate the Secret Millionaire contract with React using Secret.Js.** Let's get started! &#x20;

<figure><img src="../../.gitbook/assets/secret millionaire (1).gif" alt=""><figcaption><p>Completed React.js application</p></figcaption></figure>

### **Frontend library overview**&#x20;

This tutorial assumes that you've already learned how to [compile, upload, and instantiate a Secret smart contract](https://docs.scrt.network/secret-network-documentation/development/getting-started/interacting-with-the-testnet) to the Secret testnet and now you will learn how to connect your instantiated smart contract to a frontend library, namely, React.js.&#x20;

Excluding the instantiation message, the Secret Millionaire smart contract is capable of [executing three messages](https://github.com/scrtlabs/examples/blob/master/secret-millionaire/millionaire-contract/src/msg.rs):&#x20;

1. Submit net worth
2. Reset net worth&#x20;
3. Query net worth

Thus, we need to design our frontend in an intuitive manner that will allow the user to execute these messages. By the end of this tutorial you will learn how to do the following:&#x20;

1. Integrate Keplr wallet with React.js
2. Use secret.js to execute multiple transactions simultaneously&#x20;
3. Use secret.js to query the updated Secret Millionaire smart contract&#x20;

### Integrating Keplr Wallet with Secret.js

In order to execute the Secret millionaire contract, users must first be able to connect to their Keplr wallet. To see a generalized approach to connecting to Keplr wallet with Secret.js, you can [review the Secret.js docs here](https://secretjs.scrt.network/#keplr-wallet). However, for our application you will learn how to **connect to Keplr with React.js using the useContext hook**, which is designed to share data that can be considered "global" for a tree of React components, meaning that once the user connects their wallet with Keplr, we can then use that data in every other part of our application.&#x20;

#### Connect Wallet function&#x20;

Before we proceed, review the [`ConnectWallet()`](https://github.com/scrtlabs/examples/blob/bc4676c4d3a644e3cc841384033ba1b7306250eb/secret-millionaire/react-millionaire/src/secretJs/SecretjsContext.js#L49C2-L63C4) function: &#x20;

```javascript
 async function connectWallet() {
    try {
      if (!window.:) {
        console.log("intall keplr!");
      } else {
        await setupKeplr(setSecretjs, setSecretAddress);
        localStorage.setItem("keplrAutoConnect", "true");
        console.log(secretAddress);
      }
    } catch (error) {
      alert(
        "An error occurred while connecting to the wallet. Please try again."
      );
    }
  }
```

[`SetupKeplr()`](https://github.com/scrtlabs/examples/blob/bc4676c4d3a644e3cc841384033ba1b7306250eb/secret-millionaire/react-millionaire/src/secretJs/SecretjsContext.js#L11C1-L47C4) is an asynchronous function that ensures Keplr and its related utilities are loaded, enables the Secret Network on Keplr, retrieves the user's account information from Keplr, creates a Secret Network client with this information, and then sets the `secretjs` instance and `secretAddress` with these details so that we can then share this data with the rest of our application.  Notice that when we establish the Secret Network client with Secret.js we are also specifying the `url` and `chainId` of the client, which in this case is the `url` + `chainId` for Secret testnet:

```javascript
    const accounts = await keplrOfflineSigner.getAccounts();

    const secretAddress = accounts[0].address;

    const secretjs = new SecretNetworkClient({
      url: SECRET_LCD,
      chainId: SECRET_CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: secretAddress,
      encryptionUtils: window.getEnigmaUtils(SECRET_CHAIN_ID),
    });

    setSecretAddress(secretAddress);
    setSecretjs(secretjs);
  }
```

In fewer than 100 lines of code, you have the functionality to connect and disconnect a Keplr wallet and can now use this data in every other part of any dApp you choose to create. Now that a user can connect to our front end, let's write some functions with Secret.js that allow them to **execute the `submit_net_worth()` and `reset_net_worth()` functions.**&#x20;

### Writing the Execution Messages

[The Secret Millionaire contract is designed](https://github.com/scrtlabs/examples/blob/bc4676c4d3a644e3cc841384033ba1b7306250eb/secret-millionaire/millionaire-contract/src/contract.rs#L45) such that when a millionaire's net worth is submitted, the contract saves the first two entries and then returns an error for subsequent attempts until a reset. The reset operation resets the contract's state back to its initial condition, where no millionaires are registered.&#x20;

Because the Secret smart contract requires two millionaires to be submitted at any given time, it would be an improved UI experience if the user could submit two millionaires simultaneously, rather than having to execute two separate transactions. We are able to implement this functionality with Secret.js using [MsgExecuteContract: ](https://github.com/scrtlabs/examples/blob/bc4676c4d3a644e3cc841384033ba1b7306250eb/secret-millionaire/react-millionaire/src/secretJs/SecretjsFunctions.js#L2)

```javascript
let submit_net_worth = async (millionaire1, millionaire2) => {
    const millionaire1_tx = new MsgExecuteContract({
      sender: secretAddress,
      contract_address: contractAddress,
      msg: {
        submit_net_worth: {
          name: millionaire1.name,
          worth: parseInt(millionaire1.networth),
        },
      },
      code_hash: contractCodeHash,
    });

    const millionaire2_tx = new MsgExecuteContract({
      sender: secretAddress,
      contract_address: contractAddress,
      msg: {
        submit_net_worth: {
          name: millionaire2.name,
          worth: parseInt(millionaire2.networth),
        },
      },
      code_hash: contractCodeHash,
    });
    const txs = await secretjs.tx.broadcast(
      [millionaire1_tx, millionaire2_tx],
      {
        gasLimit: 300_000,
      }
    );
    console.log(txs);
  };
```

### Writing the Query Message

_Coming soon._&#x20;

&#x20; &#x20;
