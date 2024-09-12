# Storing Encrypted Data on Secret Network

Solana developers can now use [SecretPath](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath) to pass encrypted messages from Solana  applications to a Secret Network smart contract. With this capability, Solana developers can build privacy-centric applications, such as:

* **Private DeFi protocols**: Allow users to interact with decentralized finance applications while keeping transaction details private.
* **Confidential NFTs**: Create NFTs where ownership or content can be privately verified and shared.
* **Encrypted messaging apps**: Build decentralized applications where users can exchange encrypted messages, ensuring confidentiality.
* **Secure Voting Systems**: Implement voting mechanisms where individual votes remain private but outcomes are publicly verifiable.

By integrating Solana with Secret Network via SecretPath, developers can bring enhanced privacy features to decentralized applications, improving security and user trust.

SecretPath seamlessly handles encrypted payloads, as the master gateway contract on Secret Network automatically decrypts payloads and passes the decrypted payload over to the target contract deployed on Secret Network.&#x20;

{% hint style="info" %}
If this sounds confusing, fret now, we will walk you through each step in subsequent Solana developer tutorials 😊
{% endhint %}

The encryption of the payload is done using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305), an [authenticated encryption with additional data (AEAD)](https://en.wikipedia.org/wiki/Authenticated\_encryption) algorithm.

The key for this symmetric encryption is created by using the [Elliptic-curve Diffie-Hellman ](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman)(ECDH) scheme, comprising of two components:&#x20;

1. An extra encryption public key provided from the Secret Gateway Contract
2. A randomly created (ephemeral) encryption private key on the user side (independent of the user wallet's private key)

Combining both of these keys together via the ECDH Scheme yields our encryption key, which we use to encrypt the payload with ChaCha20-Poly1305.

Let's learn how to use SecretPath on Solana in the [key-value store developer tutorial](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/solana-developer-toolkit/usecases/storing-encrypted-data-on-secret-network/using-encrypted-payloads-for-vrf) 😊.&#x20;
