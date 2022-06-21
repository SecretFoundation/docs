# Privacy comparison

## Privacy for blockchain

Cryptocurrency in its original vision was always meant to provide a private way of p2p interaction but lately this vision has only gone further and further from the truth. Although blockchain still has a pseudonymous structure it has become harder and harder for users to keep their real life identity locked away from their cryptocurrency wallet. Know Your Customer (KYC) regulations for Centralized Exchanges (CEX), Profile picture NFTs, Chain analysis by large players and data harvesting on public APIs, wallet providers and Cryptocurrency social accounts all form risks for the privacy of single users. Personal finances have never been part of the public information but with growing blockchain adoption this has become somewhat of a reality for a lot of people.&#x20;

Transactional and computational privacy projects in blockchain try to solve this issue with novel encryption technology and specialized hardware. Longstanding projects like Monero (XMR), Zcash (ZEC) and Secret Network (SCRT) are now joined with just as innovative projects like DERO, Penumbra, NYM and many others. In this article we try to explain the differences between some of the major privacy focused blockchain projects.

&#x20;We specifically focus on the differences of these projects with Secret Network and try to be as honest as possible about both advantages and disadvantages of the technology stack and network architecture. If anywhere during below article you think something is incorrect or missing then feel free to contact us using the details at the bottom.

## Transactional vs computational privacy

First and foremost it is important we distinguish between 2 goals of privacy networks which might or might not be mutually exclusive. Transactional privacy describes how a user can transact with another user using the decentralized network while preserving full privacy. full privacy can be denoted as not giving away your public key, balance and metadata of the trade to either an observer of the chain or the counterparty in the transaction. Examples for networks with full transactional privacy are Monero, DERO, Zcash and Anoma. A blockchain focused on transactional privacy often does not have the ability to also do private smart contract computation, much like Bitcoin does not have smart contracts while Ethereum does. Computational privacy is the label given to smart contract operations which are either fully private or have private metadata which make it so a user can perform P2P or contract interactions which are more than transactions. Forms of smart contract computations are using a Dececentralized Exchange (DEX), Minting an Non-Fungible-Token (NFT) or attacking a player in a Blockchain game. Examples of projects that acheive or are developing computational privacy include Secret Network, DUSK and Oasis.

We will now go over the various projects 1 by 1 starting with Secret Network.

## Privacy Technologies

### Hash functions

Hashing is the process of restructuring data of arbitrary size to&#x20;

### mixing

### Zero knowledge proofs

* zk-SNARK
* Bulletproofs

### ring signatures

### shielding

### TEE

### Viewing keys

## Secret network (SCRT) - semi-transactional privacy & Computational privacy - Mainnet

Design:

privacy technology:

Trust and privacy assumptions:

***

## Monero (XMR)- Transactional privacy - Mainnet

**Design**

Monero is a Proof of Work (POW) blockchain with full transactional privacy launched in 2014. Monero uses a combination of Bulletproofs, ring signatures, RingCT and stealth adresses to grant users privacy for their transactions. Monero is often deemed the private version of Bitcoin and does not offer smart contract computation. Monero differentiates from Bitcoin not only with the provided privacy but also with the mining mechanism and token inflation metrics. CPUs are the most effective way to mine Monero causing a different distribution of hashing power amongst many more smaller users. While Bitcoin supply is set to a maximum of 21 million, Monero supply will infinitely increase via tail block rewards guaranteeing the miner incentives. The XMR token is 100% fungible as a token does not have a traceable path of transactions like on Bitcoin due to its private nature

**Privacy Technology**

Monero relies on ring signatures to disguise what is really happening on the chain. A ring signature is a mechanism by which every transaction on the blokchain is not only signed by the initiator but also by a set number of other random publick keys. These other signers are copies of actual network participants and their transactions. This way it can still be confirmed that every block is valid without indicating the balnce or direction of every transaction. The number of signers in a ring signature is very important for privacy yet incrases the computational difficulty of any single transaction, this dilemma between scalabillity and privacy is core to Monero's infrastructure. "something about Monero decryption in a full node" "something about bulletproofs" "something about fake addresses"

Trust and privacy assumptions:

* Ring signatures only provide a decoy but there is no privacy security
* Required to use your own full node to make transactions private
* Monero forks and old transactions may yield high probabillity to find out what is happening in current transactions
* Malicious actors can fill the chain with many of their own transactions to yield information on other transactions.

## Zcash (ZEC) - Transactional privacy - Mainnet

## Dusk (DUSK) - Computational privacy - Mainnet

## Phala (PHA) - Privacy for cloud computing - Mainnet

## NYM (NYM) - Private web interaction - Mainnet

## Tornado cash - reprivatizing assets - Mainnet

## Oasis (ROSE) - Computational Privacy - Testnet

## Dero (DERO) - Computational Privacy - Testnet

## Haven - Transactional privacy - Mainnet

## Penumbra - Privacy for swaps in cosmos - In development

## Anoma- Privacy for bridging data and assets - In development

## Dash - Transactional privacy
