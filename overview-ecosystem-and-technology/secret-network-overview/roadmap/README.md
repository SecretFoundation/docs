# Roadmap (Core development)

In this section we will be sketching out the roadmap as it pertains to the Secret Network layer 1 and its development. If you are interested to learn what is in development on the application side instead then please check out the **Ecosystem Roadmap** on the [scrt.network website.](https://scrt.network/ecosystem/ecosystem-roadmap)

{% embed url="https://scrt.network/ecosystem/ecosystem-roadmap" %}

## Infrastructure/Engineering

### 1. Iterators, Contract migration - DEV ex

Iterators and contract migration are features available in the vanilla CosmWasm library but not in Secret Network at this moment in time. Iterators have to be implemented in a different way due to data on secret being encrypted with different keys for each contract. Development towards this feature has started end of 2022.

* **Upgradeability expected in V1.10 - Iterators coming in Early 2024**

Contract migration has not been implemented yet either as it was always deemed both a privacy and a security risk. However, it seems many chains have this feature available for their developers and therefore so will Secret. Implementing this feature with backwards compatibility is not super easy however, more about the design choices there is highlighted here - [https://forum.scrt.network/t/feedback-for-contract-upgradeability-design/6643/](https://forum.scrt.network/t/feedback-for-contract-upgradeability-design/6643/)

* CW-plus and better compatabillity with CosmWasm v1 -vanilla  - has been launched already.&#x20;

### 1a. EVM support

Multiple phases of EVM support coming to Secret Network over 2024

Phase 1/2 - Privacy as a service with metamask support and bridge solutions to Ethereum - Launching September 2023

Phase 3/4 - Full EVM support on Secret Adjacent to CosmWasm, acting as a Private rollup for Secret on the current Tendermint chain



Full details: --- Blog here Soon --

Announcement: 4:37:00 - [https://www.youtube.com/watch?v=8d9ERiS9JcM](https://www.youtube.com/watch?v=8d9ERiS9JcM)

### 2. Bridge migration - Expected Fall of 2023

The current multisig Ethereum and Binance Smart chain bridge will be deprecated over the coming half year in favor of the Axelar bridging platform. To ensure a good migration SCRT Labs will launch a one-click migration UI for people bridge out via the old bridge and bridge back in via the new bridge and use their Secret Tokens in new protocols like Shade and Blizzard.\
\
More info about the partnership between Axelar and Secret can be found in [this blog](https://scrt.network/blog/secret-partners-with-axelar-network).

### 3. Privacy as a Service (PaaS) APIs

SCRT labs is working on several proof of concept privacy as a service solutions including Randomness, threshold wallets and private voting and is developing APIs with easy access for Cosmos and non-Cosmos chains to integrate them.

The above products will be available soon without a required chain-upgrade and will prove the functionality of Interchain contracts and privacy of Secret Network.

The above POC ideas are an easier to implement solution for other chains and dApps but building a own relay solution could still be needed for more complex use cases like Sealed-bid-auctions ([Bidshop - Liquid factory](https://liquidfactory.io/)) and Private voting on Ethereum ([Timber network](https://matthewnolan.xyz/blog/secret-dao-voting-ethereum-with-timber-network/)).

* Secret VRF - Launched
* Private voting API (additive HME) - Q4 2023
* MPC wallets - POC launched - Additive HME added to the network
* Walletless - PMF research + early 2024 POC

{% embed url="https://www.youtube.com/watch?v=vFhjn6TcVJc" %}

### 4. Hardening SGX / Privacy improvements

This section describes many improvements to the Secret network protocol improving privacy guarantees, developer experience for building private dApps and securing Secret for the future.

* In-enclave light client for replay protection - Launched v1.7
* Disabling simulation - launched v1.7
* Light client addition for MRENCLAVE or shared key MRSIGNER implementation - end of 2023
* Merkle proofs - protecting against modified state replay attacks - end of 2023
* consensus seed regeneration - launched v1.7 - automatic every upgrade/x blocs - under research
* Threshold key-sharing for validators - MPC addition to Secret protocol for either seed generation or private key sharing - under research.
* ORAM for SNIP-20s - under research

### 5. ICA, ICS, ICQ, IBC middleware

With the IBC-go V6 upgrade and the upcoming Rho upgrade by the Cosmos-Hub Interchain Accounts and Interchain Security will come to full use. ICA is already live on secret but the controller side is missing, adding this will be done in the near future after further bumping of the Cosmos-SDK version Secret uses. ICS is a longer term item for Secret Network but core to Secret 2.0 and will come if the technology proves to be secure and necesarry for Chains willing to launch on Secret.\
\
In collaboration with Strangelove Ventures a lot of work goes into Interchain Queries and the IBC middleware. SCRT labs is aware of both development efforts and will aim to integrate middleware in the near future and ICQ when development is finished.\
\
For questions regarding the state of any of these features please reach out to Ertemann via Email (Ertemann@scrt.agency), Telegram (@ Ertemann) or Discord (Ertemann | Lavender.Five nodes#9832)

* PMF - launched
* Fee middleware - launched
* IBC hooks - V1.10
* ICA destination - Launched
* ICA controller + v7 - Q2 2024
* ICS - no determined timeline

### 6. WASM Engine Replacement + GRAMINE + next gen Intel CPUs

When initially developing secret contracts a decision was made to go with WebAssembly (WASM) engine _wasmi_ - a slower, older engine that was made for SGX (the core technology that enables privacy) - rather than undertaking long development to adapt a more performant engine. This allowed the network to launch faster, and now it is catching up with the newer more performant engines.

The team aimed to do the WASM engine replacement in phases and start with a replacement to WASM3 (which happened in December 2022 as part of Shockwave Omega) which will bring a \~3.5x TPS increase for smart contract executions.\
\
Over the long term the intention is to replace the current WASM engine with the vanilla CosmWasm’s WASM engine, Wasmer. This is going to be a difficult task, as the engine that runs the Secret contracts is tightly integrated with many system components. This new engine would bring a smart contract TPS increase of another \~50x. The team is confident they can pull this off for a release in 2023. Before Wasmer can be integrated the TEE backend has to be switched to Gramine.\
\
Gramine will allow for a cleaner management of the TEE component of the techstack, bring many new software compatibillities (like Wasmer) and kickstart the integration of the improved next generation Intel SGX CPUs for increased infrastructure stabillity.

* WASM3 - launched
* GRAMINE - Delayed as security risks found  - finding better alternative
* WASMER - Delayed as security risks found - finding better alternative
* DCAP attestation aka 3rd genCPU - Before end of 2024

> Stay up to date with the latest roadmap development by subscribing to the DEV-updates channel in our discord (https://scrt.network/discord)

