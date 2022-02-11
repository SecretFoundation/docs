# Secret Tutorials

References to help build Secret Networks dApps and Secret Contracts are found below, beginning with reference tutorials and code repositories.

To learn more about Secret Contracts, please visit our [documentation page](/dev/secret-contracts.html).

To follow a guided walk-through on setting up your development environment, developing a first basic Secret Contract (Simple Secret Counter) and deploying it, please visit our [Quickstart](/dev/quickstart.html) documentation page.

<details>
  <summary>Topics covered on this page</summary>

  - Tutorials
    * [Tutorial Developing Your First Secret Contract](#tutorial-developing-your-first-secret-contract) 
    * [Simple Secret Voting App](#simple-secret-voting-app)
    * [Secret Contracts Guide](#secret-contracts-guide)
    * [Secret Sealed Bid Auction](#secret-sealed-bid-auction)
    * [Figment Learning Materials](#figment-learning-materials)
    * [SecretJS Templates](#secretjs-templates)
    * [Secret Ethereum Bridge](#secret-ethereum-bridge)
    * [Secret References for Contracts](#secret-references-for-contracts) 
  
</details>


## Tutorial Developing Your First Secret Contract
Refer to this [tutorial](https://github.com/darwinzer0/secret-contract-tutorials/tree/main/tutorial1) from `darwinzer0` about developing a Secret Exploding Message app.

A recommended walkthrough, with practical insights on Secret Contract functions, messages & storage.


## Simple Secret Voting App
Use [this link](https://github.com/scrtlabs/SecretSimpleVote/blob/master/src/contract.rs) to see a sample voting contract and a line by line description of everything you need to know.

A dedicated walkthrough for this app is made in [How To Build Secret Apps: An Evolving Development Guide](https://scrt.network/blog/how-to-build-secret-apps/)


## Secret Contracts Guide
This [repository](https://github.com/scrtlabs/secret-contracts-guide) can be used to master Secret Contract development.

In this repository you'll find information on:
- Setting up a local Secret Network developer testnet
- Learning Secret Contract development basics and shortcuts
- Build and deploy Secret Contracts of varying complexity with UIs

A key aspect addresses [how to build a frontend](https://github.com/scrtlabs/secret-contracts-guide/blob/master/building-a-frontend.md) using React.


## Secret Sealed Bid Auction
Use [this link](https://github.com/baedrik/SCRT-sealed-bid-auction) for a sealed-bid (secret) auction contract that makes use of [SNIP-20](https://github.com/scrtlabs/snip20-reference-impl) and a walkthrough of the contract.

For an even more advanced version of this stunning Secret Sealed Bid Auction app, you can refer to its enhanced [Secret Auction Factory](https://github.com/baedrik/secret-auction-factory) put in production.

The VueJS UI code is available [here](https://github.com/stakeordie/scrt-auction).


## Figment Learning Materials
Visit [this link](https://learn.figment.io/network-documentation/secret) for all tutorials about Secret Network by our partner Figment.io.

Make sure you go through the [Secret Pathway Tutorials 1-5](https://learn.figment.io/network-documentation/secret/secret-pathway#secret-pathway-tutorials) covering:
1. Connect to a Secret node using DataHub
2. Create your first Secret account
3. Query the Secret Network
4. Submit your first Secret transaction
5. Write & deploy your first Secret smart contract

Figment's YouTube tutorials playlist can be found [here](https://youtube.com/playlist?list=PLkgTdjgP1aUBZzU5BpYoa5WJx184d_f0k). 


## SecretJS Templates
Refer to the reference [SecretJS Templates](https://github.com/scrtlabs/SecretJS-Templates) provided by SCRT Labs to learn about: 
- Connecting to Secret Network
- Creating account using SecretJS
- Query Secret Network
- Submitting transactions
- Using contracts
- Wallets
- SNIP-20 tokens
- Consuming websocket contract events


## Secret Ethereum Bridge
The source code of the Harmony-based Ethereum bridge frontend is available [here](https://github.com/scrtlabs/EthereumBridgeFrontend).

If you are interested to know how to programmatically use the bridge, you can look at the [manual swap](https://github.com/scrtlabs/EthereumBridge#manual-swap) section of the Ethereum Bridge doc. 


## References for Secret Contracts
### SNIP-20 Contracts
To master the SNIP-20 contract specifications, you can refer to these two key parts:
- [SNIP-20 specifications](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-20.md)
- [SNIP-20 reference implementation](https://github.com/scrtlabs/snip20-reference-impl)

### SNIP-721 NFT
To master the SNIP-721 contract specifications for Non-Fungible Tokens (NFT), you can refer to these two key parts:
- [SNIP-721 specifications](https://github.com/SecretFoundation/SNIPs/blob/master/SNIP-721.md)
- [SNIP-721 reference implementation](https://github.com/baedrik/snip721-reference-impl)

### Secret Toolkit
[Secret Contract Development Toolkit](https://github.com/scrtlabs/secret-toolkit) is a collection of Rust packages that contain common tools used in development of Secret Contracts running on the Secret Network.
