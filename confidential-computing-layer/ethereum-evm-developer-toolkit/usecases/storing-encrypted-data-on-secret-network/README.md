# Storing Encrypted Data on Secret Network

One of SecretPath's key features is the ability to use encrypted payloads to send over confidential messages to a Secret Smart contract.&#x20;

SecretPath can seamlessly handle encrypted payloads, as the master gateway contract on Secret automatically decrypts the payload and hands the decrypted payload over to the target contract.&#x20;

The encryption of the payload is done using the [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305), an [authenticated encryption with additional data (AEAD)](https://en.wikipedia.org/wiki/Authenticated\_encryption) algorithm.

The key for this symmetric encryption is created by using the [Elliptic-curve Diffie-Hellman ](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman)(ECDH) scheme, comprising of two components:&#x20;

1. An extra encryption public key provided from the Secret Gateway Contract
2. A randomly created (ephemeral) encryption private key on the user side (independent of the user wallet's private key)

Combining both of these keys together via the ECDH Scheme yields our encryption key, which we use to encrypt the payload with ChaCha20-Poly1305.

As a first example for this, we have used SecretPath to  encrypt a `string` and subsequently store it in a Secret contract.&#x20;
