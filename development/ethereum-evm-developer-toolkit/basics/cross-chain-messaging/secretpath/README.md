# SecretPath

{% hint style="info" %}
Need help with using SecretPath or want to discuss use cases for your dApp? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

SecretPath is a protocol for lightweight, secure, privacy preserving message-passing between chains. Its purpose is to serve as a critical building block for bringing private data onchain in a useful yet privacy-preserving manner.

In technical terms, SecretPath is a message passing system for non-malleable, trustless interchain message passing. In more practical terms, SecretPath enables public chains to call arbitrary functions on private compute chains while preserving the privacy of the inputs and validity of the outputs. SecretPath is built using a primitive that we call TNLS ("Transport _Network_ Layer Security") which is effectively a blockchain derivative of the [TLS protocol](https://en.wikipedia.org/wiki/Transport\_Layer\_Security).

_SecretPath itself does not store or compute over data_. Rather, it connects public blockchains and their applications to privacy-preserving computation networks. This design allows public blockchain applications to build and operate private computation contracts on privacy-preserving chains while keeping their primary smart contract logic and liquidity on public blockchains.

Ultimately, SecretPath enables the building of new applications that combine the transparency, UX, and latency benefits of public blockchains with the trust-minimized and private computation features of privacy-preserving blockchains.

The following sections provide a detailed technical overview of the _current_ relayer and gateway architecture for SecretPath.&#x20;

1. To get an overview of the Architecture go here: [architecture-overview.md](architecture-overview.md "mention")
2. If you like to use SecretVRF in the most elegant way for you as an EVM developer, go here:[vrf-developer-tutorial.md](../../../usecases/vrf/vrf-developer-tutorial.md "mention")
3. To review supported EVM chains, go here: [gateway-contracts](../../../gateway-contracts/ "mention")

_As an user and developer_, all you need to know is how to send messages to one gateway/receive messages from a gateway, which will be covered in those respective documentation sections. More tutorials with encrypted payloads are coming soon.

_As a maintainer_, you might want to look more closely at the relayer section of the codebase as well here: [https://github.com/SecretSaturn/TNLS](https://github.com/SecretSaturn/TNLS)

You can try a demo of SecretPath that bridges Secret VRF into EVMs here: [vrfdemo.secretsaturn.net](https://vrfdemo.secretsaturn.net)

This documentation was adapted from [https://fortress-labs.gitbook.io/snakepath](https://fortress-labs.gitbook.io/snakepath), courtesy of Leor Fishman.
