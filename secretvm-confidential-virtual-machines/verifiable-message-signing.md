# 🔐 Verifiable Message Signing

## Overview

In certain cases, it may be beneficial for a SecretVM workload to be able to securely sign its messages, proving that they are coming from a genuine TEE running with a verifiable workload.

In order to enable such secure and verifiable signing, SecretVM generates a key pair and a special Attestation Quote tied to the public key.&#x20;

## Key Pairs and Attestation Quote

When a new SecretVM is created, it can be instructed to generate a fresh key pair of a specified algorithm (see [Supported algorithms](verifiable-message-signing.md#supported-algorithms)). The public key of this newly generated pair is then included in a specially generated remote attestation quote.

The private and public keys, as well as the attestation quote, can be mounted into the Docker container, and the application can use the private key for signing operations with the assurance that the key has never been exposed outside the TEE. The public key and the attestation quote can be presented to external parties to prove that the signing key is held within a secure and trusted environment, and that the environment is running a specific workload. See [Verifying a SecretVM](verifying-a-secretvm/) for more detials.

The following schematic illustrates the process:

<figure><img src="../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

## Key benefits

* **Hardware-level Key Protection**: The private key is generated and resides entirely within the TEE, protecting it from compromise even if the host operating system is malicious.
* **Verifiable Trust**: The remote attestation quote provides undeniable proof to third parties that the public key and its corresponding private key were created in a genuine TEE.
* **Simplified Workflow**: The key generation and attestation process is seamlessly integrated into the VM and Docker Compose workflow, requiring minimal configuration.
* **Choice of Cryptography**: Support for both `secp256k1` and `ed25519` allows you to choose the cryptographic algorithm that best suits your application's needs.

## How to use

To enable this feature, you need to add specific volume mounts to your `docker-compose.yaml` file for the service that will use the generated keys. The system will detect these volume mounts and trigger the key generation and attestation process.&#x20;

\
Note:  key generation algorithm is specified directly in the name. For example, if you want to use secp256k1 keys, you should mount `docker_private_key_secp256k1.pem` .

```yaml
services:
  my-secure-app:
    # ... your other service configurations
    volumes:
      - ./crypto/docker_private_key_ed25519.pem:/app/data/privkey.pem
      - ./crypto/docker_public_key_ed25519.pem:/app/data/pubkey.pem
      - ./crypto/docker_attestation_ed25519.txt:/app/data/quote.txt
```

Once the VM and the container are up and running, your application can find the generated files at the paths specified in the `volumes` section.

* **Private Key** (`privkey.pem`): Use this key for any signing operations your application needs to perform.
* **Public Key** (`pubkey.pem`): This key can be shared with other parties who need to verify signatures created by your application.
* **Attestation Quote** (`quote.txt`): This file should be provided to any external service or client that needs to verify the origin and integrity of your public key. The verifier can then use the TEE vendor's services to validate the quote and establish trust in your signing key.

## Code Sample

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature
import base64


def sign(message: str, private_key_path: str) -> str:
    # Load private key
    with open(private_key_path, "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
        )

    # Sign the message
    signature = private_key.sign(bytes(message, "utf-8"))

    # Return base64-encoded signature
    return base64.b64encode(signature).decode("utf-8")


def verify(message: str, signature_b64: str, public_key_path: str) -> bool:
    # Load public key
    with open(public_key_path, "rb") as key_file:
        public_key = serialization.load_pem_public_key(key_file.read())

    # Decode signature
    signature = base64.b64decode(signature_b64)

    # Verify with public_key
    try:
        public_key.verify(signature, bytes(message, "utf-8"))
        return True
    except InvalidSignature:
        return False


if __name__ == "__main__":
    message = "hello, world"
    signature = sign(message, "ed25519_private.pem")

    print(verify(message, signature, "ed25519_public.pem"))
```

## Supported algorithms

* secp256k1 (default)
* ed25519
