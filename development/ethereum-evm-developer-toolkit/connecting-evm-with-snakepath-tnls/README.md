# Connecting EVM with Snakepath (TNLS)

Snakepath is a protocol for lightweight, secure, privacy preserving message-passing between chains. Its purpose is to serve as a critical building block for bringing private data onchain in a useful yet privacy-preserving manner.

In technical terms, Snakepath is a message passing system for non-malleable, trustless interchain message passing. In more practical terms, Snakepath enables public chains to call arbitrary functions on private compute chains while preserving the privacy of the inputs and validity of the outputs. Snakepath is built using a primitive that we call TNLS ("Transport _Network_ Layer Security") which is effectively a blockchain derivative of the [TLS protocol](https://en.wikipedia.org/wiki/Transport\_Layer\_Security).

_Snakepath itself does not store or compute over data_. Rather, it connects public blockchains and their applications to privacy-preserving computation networks. This design allows public blockchain applications to build and operate private computation contracts on privacy-preserving chains while keeping their primary smart contract logic and liquidity on public blockchains.

Ultimately, Snakepath enables the building of new applications that combine the transparency, UX, and latency benefits of public blockchains with the trust-minimized and private computation features of privacy-preserving blockchains.

In the upcoming days, more docs on how to use Snakepath will be provided here.&#x20;

You can try a demo of Snakepath that bridges Secret VRF here: [vrfdemo.secretsaturn.net](https://vrfdemo.secretsaturn.net)

1. [evm-mainnet](evm-mainnet/ "mention")
2. [evm-testnet](evm-testnet/ "mention")
