---
description: >-
  Learn how to encrypt a message on EVM and decrypt it in a Secret Network
  contract.
---

# 🤫 EVM Shared Secret Cryptography

## Overview

**ECDH (Elliptic Curve Diffie-Hellman)**: ECDH is a key agreement protocol that allows two parties, each having an **elliptic curve public-private key pair**, to establish a **shared secret** over an insecure channel. This shared secret can then be used to encrypt subsequent communications. We use ECDH between Secret Network and Polygon to establish a shared secret that can be used to safely encrypt and decrypt the messages being sent.

1. **Key Pairs**: Each party (our front end and our Secret smart contract) generates their own ECDH key pair, which consists of a private key and a public key (a point on the elliptic curve). The private key is kept secret, while the public key can be openly shared.
2. **Public Key Exchange**: The two parties exchange their public keys. The security of ECDH ensures that even if this exchange is intercepted, the shared secret cannot be easily computed by a third party.
3. **Shared Secret:**
   * Due to the properties of elliptic curves, when you multiply your private key with someone else's public key, the result is the same point on the curve as when the other party multiplies their private key with your public key.
   * This resulting point on the elliptic curve is used to derive the shared secret, typically by taking the x-coordinate of the point and using a hash function to generate a fixed-size key.
   * This shared secret will be the same for both parties and can now be used to encrypt and decrypt messages between them. The ECDH shared secret is used as the symmetric key in an encryption algorithm like AES.
