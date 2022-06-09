---
description: https://github.com/SecretFoundation/docs/blob/main/README.md
cover: .gitbook/assets/header_shockwave.png
coverY: 0
---

# Introduction

### Secret Network in a Nutshell — Privacy for Web3

Secret Network offers programmable privacy on public permissionless blockchains — improving the adoption and usability of decentralized technologies. Secret enables individuals to keep private information private and to share this information with whom they trust. The use cases of Secret will undoubtedly touch every domain impacted by blockchain technology including exchanges, finance, governance, banking, media, supply-chain, voting, identity fraud, key-access, gaming, messaging control, entertainment, crowdfunding, and so on.

![](https://cdn-images-1.medium.com/max/800/0\*27ro4dbsIA-kz5eB)

Over the past few years, blockchain transparency and privacy have been of great concern in different parts of the world. While traditional Blockchain technologies could provide unprecedented freedoms, they could, in the same vein, be used as tools for surveillance and totalitarian control.

Public permissionless blockchains, such as bitcoin and Ethereum, have one major “flaw”- an inherent lack of privacy. Vital information including wallet balance, transfers, complete transaction history, and your custom wallet address is publicly available and trackable. This poses a serious risk and limits the ability of certain individuals and institutions to adopt Blockchain technology.

Think of these real-world situations: How would you feel if anyone could see your bank account balances, financial transactions you made and with whom, or trace your online orders? Or how would you feel if you are being tracked down and sentenced to 15 years imprisonment after several years for offering humanitarian aid (in crypto) to either Russia or Ukraine? Consequences like these and even more are a very real possibility when using the architectural design of public permissionless blockchains.

> 💡 Learn more about how Programmable privacy is changing the Web3 landscape in [this article.](https://carter-woetzel.medium.com/computational-and-transactional-privacy-a-deep-dive-commentary-fc3951d0d086)

### **How Secret Network achieves programmable privacy**

Smart contract-based blockchains are typically public by default. This means that the data contained in the smart contract could be easily accessed by anyone. However, this is not the case with Secret Network. Secret Network is the first blockchain that offers privacy-preserving smart contracts by default. These contracts enable encrypted input, state, and output, providing for a great deal of design and implementation options.

Secret Network protocol leverages key management, encryption protocols, and Trusted Execution Environments (TEE) that are part of the hardware specification for all validator nodes of the network. TEEs guarantee that nodes are unable to view computations that occur within the trusted environment — preserving the privacy of the underlying data during the computation. Computations are performed by each node on the network for verifiability, security, and consensus purposes.

![The flow of data when a user interacts with Secret Network](https://cdn-images-1.medium.com/max/800/0\*YBOwyI7LxdRgJfgP)

Secret Network leverages SGX as a TEE. Intel’s Software Guard Extensions (SGX) is a set of security-related instruction codes that are built into certain Intel CPUs that enable TEEs. The consensus seed is stored inside the TEE of each validator node, allowing for encrypted inputs to be decrypted and computed within a safe and secure hardware environment.

SGX comes in 2 forms; SGX-ME and SGX-SPS. SGX-ME (management engine) uses small extra chips to manage functions related to the enclave such as memory and energy management, both of which have been used in the lab to break into the enclave. SGX-SPS (Server Platform Services) allows the bypassing of the ME chip.&#x20;

To further reduce the number of possible attack vectors on the network, Secret Network has opted to only use SGX-SPS. Hence, all attack vectors of the ME chip do not apply to Secret Network. Similarly, each node creates an attestation report that proves the node is using the latest security patches of SGX before it registers. The entire network verifies the attestation report of the new node on-chain, and within the consensus and new node’s enclave to ensure that node operators cannot decrypt anything.

> 💡 Do you want to understand the technology stack of Secret Network? You can start by reading the [Whitepaper](https://scrt.network/graypaper) of Secret Network or [this article](https://carter-woetzel.medium.com/secret-network-tees-lets-talk-fud-vulnerability-33ca94b6df38) on the intricacies of SGX.

### **Secret Network as the Privacy hub for the Multichain**

Secret Network is the leading blockchain that is interoperable with the multichain. Secret being a layer one solution built with the Cosmos SDK, is chain-agnostic and interoperable with a range of networks using the Cosmos InterBlockchain Communication (IBC) Protocol. Secret Network implements programmable privacy, which is defined as arbitrarily complex data privacy controls within an application.

Programmable privacy enables tokens denominated in SCRT, BTC, ETH, and many others, to be wrapped into their private and fungible equivalent using the Secret Network SNIP-20 standard via a Secret Contract. Secret Contracts use an adaptation of CosmWasm v0.10 for optimal integration with the Cosmos ecosystem. With CosmWasm, Secret Contracts can run on multiple chains using IBC. Secret Contracts prevent data leakages by enforcing constant length messages via padding.

![How Secret Network is bringing scalable private by default smart contracts to the multichain](https://cdn-images-1.medium.com/max/800/0\*RX8gqZIW-hQRPKts)

With this feature, when a transfer is made after creating a viewing key for wrapped tokens, transactional privacy of both the sender and receiver to the other observers is assured. Say, for example, A transfers a wrapped token to B. The result would be as follows: nobody knows what A exactly did (only an interaction with a token contract is visible), nobody knows B received a token (no interaction visible), B knows he received the token from A yet no observer knows how many tokens were sent and who the recipient is.

These privacy features provide users with the opportunity to create new wallets that can’t be associated with a wallet that was accidentally doxxed or could be linked to a public-by-default chain that was used to fund the Secret wallet, like Ethereum or Binance Smart Chain. — Learn how [here](https://medium.com/@secretnetwork/private-secret-wallet-how-to-a842776c6531)

Secret Network’s privacy and interoperability have revolutionized the world of Defi and smart contracts which has resulted in a wide range of use cases including Secret Bridges, secret swap, Secret AMM, sealed-bid OTC marketplace, Secret NFT video games, privacy-preserving email software, privacy-preserving social media, and so on.

### Access Control — Viewing key and Query Permit

**Viewing keys**

When a user converts public assets such as ETH, BNB, and SCRT to their private equivalent (sETH, sBNB, sSCRT) using secret network SNIP-20 standard, metadata, such as balances, becomes encrypted by default, including from the user who has these assets. To view all of the encrypted data, Secret Network users must have access to a “viewing key”. This viewing key helps users to privatize their data, allowing them to exclusively access and analyze all the underlying information.

Secret Network helps to create an environment where individuals would have control of the level of privacy as opposed to complete transparency or complete privacy. They allow users to maintain control over their data and decide what is shared and with whom. Viewing keys give each secret contract a unique and unforgeable encryption key, hence, making it difficult for malicious validators to locally encrypt transactions with their own encryption key and then decrypt the resulting state with the fake key.

However, in times of high traffic, the UI/UX built around viewing keys can lead to the creation of many unnecessary transactions which can decrease node performance, resulting in cascading problems for the network. Therefore, to solve these technical and UX challenges, a new method for querying private user data was implemented — query permits.

**Query permit**

Query permit is an alternative querying method introduced in the SNIP-24 design specification. it was found to be a superior querying method when compared to viewing keys. Query permit uses a cryptographic technique known as public-key encryption coupled with digital signatures. A permit is a formatted message. It outlines several arguments such as what tokens the permit applies to and what permissions the permit should allow, (e.g. should the permit allow the querier to view a user’s transaction history, balance, etc.).

This message is signed by the user using his account’s private key. When a user submits a query, he sends his signed permit as an argument to a smart contract. Once received, the smart contract, using the user’s public key, can validate his identity based on the signature he provided. If the user’s identity is confirmed, the smart contract returns his data as requested. Query permits are an improvement to Secret Network’s privacy-preserving tokens.

> 💡 Read up on the technology behind Secret network and the difference between viewing keys and permits via [this article.](https://medium.com/@secretnetwork/secret-network-access-control-viewing-keys-vs-permits-97baad539e72)

**Secret Network Privacy Features Versus Group-Oriented Anonymous Signature Schemes**

Secret network viewing keys and query permits offers “programmable privacy” on an individual basis. It provides users with the opportunity to transact securely with a preferred level of anonymity. It also ensures that individuals have control over their data and decide what is shared and with whom.

In contrast, the two most prominent group-oriented anonymous signature schemes — group and ring signatures enable user anonymity with group settings. Any member of the group can produce a signature while hiding his identity in a group. Both signature schemes help to protect users’ identities which makes several applications adopt them. However, standard group signatures enable an authority to freely revoke signers’ anonymity while traditional ring signatures maintain permanent user anonymity, allowing space for malicious user activities. Therefore, achieving the requirements of privacy-preserved traceability in group signatures and controlled anonymity in ring signatures has been a drawback for the wide adoption and usability of these schemes.

### Use cases for web3 privacy

Secret network enables novel use cases because of private smart contracts adopted by over 20 different applications. Below we will give a small rundown of two use cases for programmable privacy and give a set of example applications. If you want to learn more about the different use cases you can read [this article](https://medium.com/@secretnetwork/secret-use-cases-588d7fc5f46a) on all of them.

**Private Finance (PriFi)**

Private Finance is the general concept for all decentralized financial (DeFi) applications enabled by Secret Network smart contracts. Until now, traditional DeFi applications built on smart contract platforms like Ethereum had one key drawback: by default, all financial data is made public. Anyone who has your wallet address can run a query to see your transaction history, wallet balances, and account activities. Data is exposed when users utilize DeFi applications, putting them in danger of targeted attacks from hackers and front-running MEV bots.

PriFi applications are private by default since smart contracts on Secret Network are securely encrypted, meaning your sensitive financial data will be secure and protected from prying eyes and even front-running bots. PriFi’s goal is to privatize the data, making it accessible only to those with access to the viewing keys. This is done to satisfy regulators and auditors while keeping the information private for all and sundry.

An array of PriFi applications have been built on Secret Network all providing novel features. SecretSwap is the first fully front running resistant AMM with a private governance application. Sienna Network has a private AMM accompanied by a Lending solution where the details of the user’s debt positions are unknown leading to protected borrowing. Btn.group has built a dex aggregator and yield optimizer giving users the optimal trading experience. Meanwhile Shade protocol and Hydro finance are building Defi 2.0 Applications with Private auto compounding Staking derivatives, Stable coins and Protocol owned liquidity.&#x20;

> 💡 Visit [scrt.network/ecosystem/dapps](https://scrt.network/ecosystem/dapps) to learn about all the Privacy enabling applications built on Secret Network.

![](https://cdn-images-1.medium.com/max/800/0\*YanmCsc5mvSGR5oX.jpeg)

**Secret NFTs**

Secret NFTs are non-fungible tokens built on Secret Network with programmable privacy features. Unlike the traditional NFTs, Secret NFTs support both public and private metadata for NFT creators. It also enables private ownership and access controls for NFT owners. Because providing programmable privacy is about choice, you can choose to make ownership or/and private metadata completely public for anyone to see if you so desire! These unique items can be used for a variety of purposes, with impacts on many industries including art, fashion, science, business, entertainment, etc.

Learn more about what SecretNFTs bring to Web3 by reading [our article](https://medium.com/@secretnetwork/history-will-remember-2021-as-the-year-that-nfts-came-of-age-but-what-comes-next-73e338d1578b) on it.

![](https://cdn-images-1.medium.com/max/800/0\*5n9PkXRu1jgxVM7e.jpeg)

**Example Applications**

[DataVault](https://mobile.twitter.com/data\_vault\_) is the world’s first decentralized privacy-preserving content management and data exchange protocol built on blockchain technology — powered by Secret Network.

[StarShell](https://starshell.net/) is a privacy-preserving, free, and open-source Web3 wallet built for the Secret Network and Cosmos Ecosystem. It protects your identity by limiting the types of information dApps can collect from your account.

[Alter](https://altermail.live/) is a decentralized messaging service providing a secure data integrity sharing model, with the use of a digital signature, a proxy encryption scheme, and Secret Network’s encrypted smart contracts. Users of Alter are owners of their own encryption key providing a new level of security.

[Orbem Wars](https://mobile.twitter.com/domeriumlabs) is a fully on-chain tower defense gaming leveraging the Private metadata in Secret NFTs and the Private blockchain state to offer fair gaming with stunning visuals.

Other amazing dApps that are currently being built on Secret include Jackal, Shade protocol, Secret heroes, Sienna Network, Hydro finance, Blackbox, Fardels and much more.

![The Secret Network Ecosystem](https://cdn-images-1.medium.com/max/800/0\*1EnJw32oGDihRO02.jpeg)

#### **Conclusion**

Blockchains that have all data of every smart contract and transaction publicly visible are limited in their capacity to generate effective use cases where privacy is a fundamental component of the feasibility of the application. There has never been a greater need for easily accessible privacy solutions inside and outside the blockchain space. The intent of the Secret Network is to be an open-source protocol that enables a wide range of privacy-preserving tools and applications through programmable privacy — improving the adoption and usability of decentralized technologies.

Do you want to help bring Secret Network and programmable privacy to the masses? [Become a Secret agent](https://scrt.network/get-involved/become-secret-agent) and spread awareness on the importance of privacy in a Web3 multichain world.&#x20;

Want to get started with Secret Network? We have [a guide for you](https://medium.com/@secretnetwork/secret-network-starter-guide-8a6231c7c5b4/) :)

You can follow Secret Network on [twitter](https://twitter.com/secretnetwork) to keep up to date or checkout the blog at [https://scrt.network/blog](https://scrt.network/blog)

\
