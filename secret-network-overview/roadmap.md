# Roadmap (Core development)

In this section we will be sketching out the roadmap as it pertains to the Secret Network layer 1 and its development. If you are interested to learn what is in development on the application side instead then please check out the **Ecosystem Roadmap** on the [scrt.network website.](https://scrt.network/ecosystem/ecosystem-roadmap)

{% embed url="https://scrt.network/ecosystem/ecosystem-roadmap" %}

## Infrastructure/Engineering

### 1.  Iterators, Contract migration and CosmWasm portability

Iterators and contract migration are features available in the vanilla CosmWasm library but not in Secret Network at this moment in time. Iterators have to be implemented in a different way due to data on secret being encrypted with different keys for each contract. Development towards this feature has started end of 2022 and a release is expected in early 2023.\
\
Contract migration has not been implemented yet either as it was always deemed both a privacy and a security risk. However, it seems many chains have this feature available for their developers and therefore so will Secret. Implementing this feature with backwards compatibility is not super easy however, more about the design choices there is highlighted here: [https://forum.scrt.network/t/feedback-for-contract-upgradeability-design/6643/](https://forum.scrt.network/t/feedback-for-contract-upgradeability-design/6643/)\
\
The last step in allowing for easy code portability across Cosmos is by allowing developers to use the same development tools and in particular [CW-plus](https://github.com/CosmWasm/cw-plus). SCRT Labs is working on renaming the Secret contract API so to fit CosmWasm API, add CW-plus tools directly or via the [Secret toolkit](https://github.com/scrtlabs/secret-toolkit) and overall increase compatibility between Vanilla and Secret CosmWasm. Some more info on the efforts can be found in this [Twitter thread](https://twitter.com/cryp\_toml/status/1605567571947917313?s=20\&t=kpJGqt4t3AfEK-PVk41b8Q).

### 2. Consensus seed rotation

To increase security and enable partial forward secrecy SCRT labs is working to rotate the consensus seed, which determines the private in-enclave randomness, in the next upgrade.

The testnet upgrade for this feature was already succesfull and a timeline for the mainnet upgrade should come in early february.

### 3. Bridge migration

The current multisig Ethereum and Binance Smart chain bridge will be deprecated over the coming half year in favor of the Axelar bridging platform. To ensure a good migration SCRT Labs will launch a one-click migration UI for people bridge out via the old bridge and bridge back in via the new bridge and use their Secret Tokens in new protocols like Shade and Blizzard.\
\
More info about the partnership between Axelar and Secret can be found in [this blog](https://scrt.network/blog/secret-partners-with-axelar-network).

### 4. Privacy as a Service (PaaS) APIs

SCRT labs is working on several proof of concept privacy as a service solutions including Randomness, threshold wallets and private voting and is developing APIs with easy access for Cosmos and non-Cosmos chains to integrate them.

The above products will be available soon without a required chain-upgrade and will prove the functionality of Interchain contracts and privacy of Secret Network.

The above POC ideas are an easier to implement solution for other chains and dApps but building a own relay solution could still be needed for more complex use cases like Sealed-bid-auctions ([Bidshop - Liquid factory](https://liquidfactory.io/)) and Private voting on Ethereum ([Timber network](https://matthewnolan.xyz/blog/secret-dao-voting-ethereum-with-timber-network/)).

### 5. ICA, ICS, ICQ, IBC middleware

With the IBC-go V6 upgrade and the upcoming Rho upgrade by the Cosmos-Hub Interchain Accounts and Interchain Security will come to full use. ICA is already live on secret but the controller side is missing, adding this will be done in the near future after further bumping of the Cosmos-SDK version Secret uses. ICS is a longer term item for Secret Network but core to Secret 2.0 and will come if the technology proves to be secure and necesarry for Chains willing to launch on Secret.\
\
In collaboration with Strangelove Ventures a lot of work goes into Interchain Queries and the IBC middleware. SCRT labs is aware of both development efforts and will aim to integrate middleware in the near future and ICQ when development is finished.\
\
For questions regarding the state of any of these features please reach out to Ertemann via Email (Ertemann@scrt.agency), Telegram (@ Ertemann) or Discord (Ertemann | Lavender.Five nodes#9832)

### 6. WASM Engine Replacement + GRAMINE + next gen Intel CPUs

When initially developing secret contracts a decision was made to go with WebAssembly (WASM) engine _wasmi_ - a slower, older engine that was made for SGX (the core technology that enables privacy) - rather than undertaking long development to adapt a more performant engine. This allowed the network to launch faster, and now it is catching up with the newer more performant engines.&#x20;

The team aimed to do the WASM engine replacement in phases and start with a replacement to WASM3 (which happened in December 2022 as part of Shockwave Omega) which will bring a \~3.5x TPS increase for smart contract executions. \
\
Over the long term the intention is to replace the current WASM engine with the vanilla CosmWasm’s WASM engine, Wasmer. This is going to be a difficult task, as the engine that runs the Secret contracts is tightly integrated with many system components. This new engine would bring a smart contract TPS increase of another \~50x. The team is confident they can pull this off for a release in 2023. Before Wasmer can be integrated the TEE backend has to be switched to Gramine.\
\
Gramine will allow for a cleaner management of the TEE component of the techstack, bring many new software compatibillities (like Wasmer) and kickstart the integration of the improved next generation Intel SGX CPUs for increased infrastructure stabillity.

> For more information about Scaling Secret Network check out: [SCRT Labs Update: Scaling Secret](https://scrt.network/blog/scrt-labs-update-scaling-secrets) or the below video with SCRT Labs senior software engineer Assaf.

{% embed url="https://www.youtube.com/watch?v=0CBg6ZACJtk" %}

## Secret 2.0/Cryptography

### What is Secret 2.0?

> Below info comes from the "Request for Feedback" [forum post](https://forum.scrt.network/t/secret-2-0-the-next-generation-request-for-feedback/6607).

Secret remains today the only privacy-preserving smart contracts L1 in production. We were first to identify the need for privacy beyond transactional and beyond Zero-Knowledge Proofs (which in general are more of a scaling solution rather than a privacy one). With concerns such as MEV and L1 censorship, it appears that others are catching up to the need of having base-layer privacy.

To support further growth (and Secret still has a lot of room for growth) and to ensure we remain the market leaders, it’s time to look ahead and revise our short, medium and long term vision that will ensure that Secret grows to become the privacy hub for all Web3.

What does being the privacy hub for all of Web3 actually mean? We identified several areas of focus:

1. **Cryptography layer for Secret**: SGX was always the pragmatic choice, and TEEs in general (not necessarily SGX), are certainly a big part of any end-game solution. TEEs will continue to evolve into a more robust solution, but for highly sensitive use-cases combining TEEs with MPC (and other cryptographic techniques such as additively HE or ZKPs) is the most secure option (much more than using cryptography alone). Secret 2.0 Cryptographic roadmap will add the building blocks required for this. These primarily include: MPC/Secret-Sharing, Threshold (Homomorphic) Encryption/Decryption, and accompanying Zero-Knowledge proofs in Secret’s client libraries.

* Some examples of the kinds of use cases this would enable or greatly improve include private DAOs, RNGs, threshold wallets (and by extension - threshold key management and stronger Secret NFTs)

<figure><img src="https://global.discourse-cdn.com/business4/uploads/enigma1/optimized/2X/a/a550749afd0574ab352f0331cedf6b911e660361_2_690x297.jpeg" alt=""><figcaption></figcaption></figure>

2. **Constellation of chains**: Secret 2.0 will look to collaborate with others to build an ecosystem of blockchains that Secret Network will spearhead and/or support, truly solidifying Secret’s position as the hub of Web3 Privacy. Alongside the existing Secret Network blockchain, we expect to see:

* The development of a threshold fully homomorphic encryption (“FHE”) Layer-1 (“L1”)
* The development of consumer chains utilizing Privacy-as-a-Service (“PaaS”)
* The development of privacy-preserving rollups to complement the threshold FHE Layer-1
* The addition/inclusion of any chain that shares our mission for privacy. In other words, becoming part of the constellation does not necessitate having an affiliation with Secret. Being a kindred spirit and formalizing all kinds of business relations (see next section on becoming a liquidity hub, as an example) is enough.\*\*

3. **Becoming a liquidity hub for privacy-aware projects**: As part of a clear strategy to own and be the focal point of the Web3 privacy narrative, Secret should strive to support liquidity for any other privacy-aware project, whether it is built on Secret or not.

* As a precursor, Secret should reignite its DeFi ecosystem. There are several DeFi projects launching soon (some of which, like Shade, offer a whole suite of solutions!). **We should target $50M TVL in strategic pools across these new products as an immediate and important milestone to achieve**. We would obviously want to grow significantly beyond that and this is only an initial milestone.
* We also hope to create some new structures to grow Secret Network’s DeFi suite - to enable users to have a better experience with lower costs. We also want to use this opportunity to provide a platform for developers to build a broader range of applications. We believe the future of Secret Network’s DeFi suite will be led by Liquid Staking Derivatives (“LSDs”) which will enable people to earn both staking yield and yield from DeFi protocols.\*\*

### Roadmap items Secret 2.0

> More info/detail coming soon!

* Honest-dealer Key Generation
* Validator Threshold Decryption Protocol
* Distributed Key Generation Protocol
* Additively Homomorphic Encryption Library and API (client and enclave-friendly)
* Client-side proof of encryption ZK API
* Hardened Private Voting (via HE+ZKP)
* Threshold wallets
* Threshold key-management (e.g., hardened Secret NFTs)
* Threshold Randomness (using Threshold BLS)

## Potential long term roadmap items

#### sSCRT usage as gas fee

Long term the SCRT labs development team is looking into enabling Secret tokens for gas payments. This would bring better privacy to the Secret Network as interactions would no longer be noted on chain if users pay with Secret Tokens.&#x20;

This idea comes with several development challenges and changes to the standard Cosmos SDK module. No expected date is set for this feature.

#### Use PRNG for deterministic rollups inside the SN layer 1

An active idea amongst the SCRT labs developers is to use the Secret Network deterministic entropy as a way to scale Secret Network. All validators have access to the same deterministic network random-number generator. Outside of the enclave of any validator the deterministic component is unknown. Because of this every validator can generate the same randomness at any given time. \
\
When heavy computations come in the network could immediately agree that only one validator would run that given computation. Any other validator can still validate this transaction. The same can be done when a Secret Oracle is requested from the chain. The separation of these transactions is different from the standard Tendermint implementation where every validator does the compute for all transactions. This structure would significantly further scale Secret Network as it acts as an L2 rollup inside the native layer 1.\
\
The same logic as proposed above can be used for one validator doing non-deterministic actions like issuing a TLS connection to the outside world. The result of any interactions (eg. interim bridge) over this connection can than be signed by the validator and submitted by any user on-chain. This authenticates the Oracle.
