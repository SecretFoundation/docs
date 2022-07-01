# Roadmap

In this section we will be sketching out the roadmap as it pertains to the Secret Network layer 1 and its development. For an overview of the entire Secret Network ecosystem you can refer to the Secret Network monthly roadmap blog.

{% embed url="https://scrt.network/ecosystem/ecosystem-roadmap" %}

### CosmWasm V1.0

The next update for Secret Network will bring an updated version of the Secret Contract library to CosmWasm V1.0. This will bring IBC smart contract compatibility and Interchain accounts to Secret Network, enabling the cross-chain privacy hub vision. The upgrade will be tested in phases with the first test being a local testnet planned for early July and deployment to the main testnet a few weeks later. The CosmWasm V1 upgrade is expected to launch in august.

### WASM Engine Replacement

When initially developing secret contracts a decision was made to go with WebAssembly (WASM) engine _wasmi_ - a slower, older engine that was made for SGX (the core technology that enables privacy) - rather than undertaking long development to adapt a more performant engine. This allowed the network to launch faster, and now it is catching up with the newer more performant engines. The intention is to replace the current WASM engine with the vanilla CosmWasm’s WASM engine, Wasmer. This is going to be a difficult task, as the engine that runs the Secret contracts is tightly integrated with many system components. The team is confident they can pull this off and is aiming for a Q4 release for this feature.

### More Snformation

{% embed url="https://scrt.network/blog/scrt-labs-update-scaling-secrets" %}

