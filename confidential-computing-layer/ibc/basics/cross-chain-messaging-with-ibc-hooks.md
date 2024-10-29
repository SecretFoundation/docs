# Cross-chain Messaging with IBC Hooks

### IBC Hooks for Cross-Chain Messaging

IBC-Hooks is an IBC middleware that **uses incoming ICS-20 token transfers to initiate smart contract calls**.  Secret Network created a Cosmos Developer SDK that uses IBC hooks to execute Secret gateway contracts, **which allows Cosmos developers on other chains to use Secret as a privacy layer for your chain**.&#x20;

**The SDK abstracts the complexities involved in interacting with the Secret Network for applications that deal with Cosmos wallets**. It introduces a secure method for generating confidential messages and reliably authenticating users at the same time using the `chacha20poly1305` algorithm.&#x20;

The SDK can be used be for developing major gateways that forward incoming messages to Secret Network, as well as built-in support for confidential messages directly in other contracts. **To learn by doing, start with the key value store developer tutorial** [**here**](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ibc/usecases/storing-encrypted-data-on-secret-network/key-value-store-developer-tutorial).&#x20;

### SDK Requirements&#x20;

* **IBC Transfer channel between the consumer chain and Secret Network**

{% hint style="info" %}
See [Mintscan](https://www.mintscan.io/secret/relayers/) for a list of existing transfer channels between Cosmos chains and Secret Network
{% endhint %}
