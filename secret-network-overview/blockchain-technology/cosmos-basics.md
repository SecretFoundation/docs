# Cosmos basics

A simple way to describe a blockchain is that it’s a distributed ledger on a peer-to-peer network where each node of that network has a copy of the blockchain state. The state of the blockchain is updated by an application and broadcasted to each node, agreeing on this new state through consensus.

#### Horizontal scaling - Application specific blockchains

Cosmos is an ecosystem of independent, interconnected and application specific blockchains commonly referred to as the internet of blockchains. By having all these application specific interconnected blockchains, the ecosystem can easily scale horizontally which avoids most of the bottlenecks and scalability issues we know today on other heterogenous blockchains.

The conceptual layers of a blockchain are:

<img src="https://lh4.googleusercontent.com/DFcp9kAgbjouY-hhBc5jOuz1DgsuYALpK5dr74VBiRP-8ePvIFdxWtJ5144P8xO3njsFp1929sXjF_eSFh-1QP2QGZlgSROSf-pURm2gMcJNOybec6fe9ofsZVdIVDYX75nJW-OyTWTV6WDibQ" alt="" data-size="original">

We will cover in this article the following three layers for an ease of understanding:

* Network layer: Responsible for the propagation of transactions between the nodes of the ecosystem
* Consensus layer: Enables the nodes to agree on the current state of the system.
* Application layer: Responsible for updating the state given a set of transactions, i.e. processing transactions

#### Tendermint and Cosmos SDK as a quickstart

To reach adoption and grow the internet of blockchain, developers should focus on their application specific development. They should not spend time on building from scratch the consensus and networking layers. That’s what Tendermint core is taking care of by providing Networking and Consensus layers saving a lot of time and headaches for the developers.

The following figure shows the Networking and Consensus layers as “Tendermint Core” and Cosmos SDK as the “Application layer”:

![](https://lh4.googleusercontent.com/O4uq4YCo6BN6SWc0yGpUHWqkE51o3ely7Nh2YkoBHFVg0Qx\_HVoEt0swUpSgT4oOif8PoeEgZvMK28mvkcFvvYJ6SZM6UQyBMpnuuCJ-AOUmikRX2s9HFnMCQsgdBpMDsUeTfrMnRZ72uIHHfg)

On top of Tendermint Core, Cosmos introduced the Cosmos SDK, an open-source framework for building application specific blockchains with composable modules (plugins) to help developers build their blockchain faster and easier. Developers could build their application directly on Tendermint core using ABCI to interact with Tendermint but Cosmos SDK allows a faster and battle tested path to bootstrap an application.

#### &#x20;Interoperabillity at the base layer

In order to scale horizontally and fulfill the vision of an internet of interoperable blockchains, blockchains can support the Inter-Blockchain Communication Protocol (IBC), which enables value transfers, token transfers, and other communication between chains, all without the need to involve exchanges or make compromises regarding the chains' sovereignties. Following figures shows blockchains interconnected with IBC ([IBC Networks](https://hub.mintscan.io/ibc-network))\


![The Map of Zones - IBC in action](https://lh4.googleusercontent.com/mNmzPYZZo94eph706FMyKfG5FvflMIYxwga9UgY-6kEFhBzxQxJVNPBB4ZzQIrs8N05Bzb1aXsE2jw72X66bwjprAZDrdwNZ6-W4NRwQSgERh9C2S-MW4ciTAlvFWVTUnhgKMqSLElGaJ81jiQ)
