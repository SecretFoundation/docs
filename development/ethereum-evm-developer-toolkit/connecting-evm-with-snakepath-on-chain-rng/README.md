# 🐍 Connecting EVM with Snakepath (on-chain RNG)

{% hint style="info" %}
Need help with using Snakepath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

Snakepath is a protocol for lightweight, secure, privacy preserving message-passing between chains. Its purpose is to serve as a critical building block for bringing private data onchain in a useful yet privacy-preserving manner.

In technical terms, Snakepath is a message passing system for non-malleable, trustless interchain message passing. In more practical terms, Snakepath enables public chains to call arbitrary functions on private compute chains while preserving the privacy of the inputs and validity of the outputs. Snakepath is built using a primitive that we call TNLS ("Transport _Network_ Layer Security") which is effectively a blockchain derivative of the [TLS protocol](https://en.wikipedia.org/wiki/Transport\_Layer\_Security).

_Snakepath itself does not store or compute over data_. Rather, it connects public blockchains and their applications to privacy-preserving computation networks. This design allows public blockchain applications to build and operate private computation contracts on privacy-preserving chains while keeping their primary smart contract logic and liquidity on public blockchains.

Ultimately, Snakepath enables the building of new applications that combine the transparency, UX, and latency benefits of public blockchains with the trust-minimized and private computation features of privacy-preserving blockchains.

In the upcoming days, more docs on how to use Snakepath will be provided here.&#x20;

1. [architecture-overview.md](architecture-overview.md "mention")
2. [gateway-contracts](gateway-contracts/ "mention")

The following sections provide a detailed technical overview of the _current_ relayer and gateway architecture for Snakepath. _As an average user_, all you need to know is how to send messages to one gateway/receive messages from a gateway, which will be covered in those respective documentation sections. _As a maintainer_, you might want to look more closely at the relayer section of the codebase as well.

You can try a demo of Snakepath that bridges Secret VRF into EVMs here: [vrfdemo.secretsaturn.net](https://vrfdemo.secretsaturn.net)

This documentation was taken from [https://fortress-labs.gitbook.io/snakepath](https://fortress-labs.gitbook.io/snakepath) and the curtesy of Leor Fishman.
