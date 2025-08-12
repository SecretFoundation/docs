# 🔐 Verifiable Message Signing

## Overview

In certain cases, it may be beneficial for a SecretVM workload to be able to securely sign its messages, proving that they are coming from a genuine TEE running with a verifiable workload.

In order to enable such secure and verifiable signing, SecretVM generates a key pair and a special Attestation Quote tied to the public key.&#x20;

## Key Pairs and Attestation Quote

When a new SecretVM is created, it generates fresh key pairs for all the supported algorithms (see [Supported algorithms](verifiable-message-signing.md#supported-algorithms)). Each newly generated public key is then embedded in a dedicated remote attestation quote, with a separate quote generated for each algorithm-key pair.

The private and public keys, as well as the attestation quote, can be mounted into the Docker container, and the application can use the private key for signing operations with the assurance that the key has never been exposed outside the TEE. The public key and the attestation quote can be presented to external parties to prove that the signing key is held within a secure and trusted environment, and that the environment is running a specific workload. See [Verifying a SecretVM](verifying-a-secretvm/) for more detials.

The following schematic illustrates the process:

<figure><img src="../.gitbook/assets/image (35).png" alt=""><figcaption></figcaption></figure>



## Key benefits

* **Hardware-level Key Protection**: The private key is generated and resides entirely within the TEE, protecting it from compromise even if the host operating system is malicious.
* **Verifiable Trust**: The remote attestation quote provides undeniable proof to third parties that the public key and its corresponding private key were created in a genuine TEE.
* **Simplified Workflow**: The key generation and attestation process is seamlessly integrated into the VM and Docker Compose workflow, requiring minimal configuration.
* **Choice of Cryptography**: Support for both `secp256k1` and `ed25519` allows you to choose the cryptographic algorithm that best suits your application's needs.

## How to use

To enable this feature, you need to add specific volume mounts to your `docker-compose.yaml` file for the service that will use the generated keys. The system will detect these volume mounts and trigger the key generation and attestation process.&#x20;

\
Note:  key generation algorithm is specified directly in the name. For example, if you want to use secp256k1 keys, you should mount `docker_public_key_secp256k1.pem` .

```yaml
services:
  my-secure-app:
    # ... your other service configurations
    volumes:
      - ./crypto/docker_public_key_ed25519.pem:/app/data/pubkey.pem
      - ./crypto/docker_attestation_ed25519.txt:/app/data/quote.txt
```

Once the VM and the container are up and running, your application can find the generated files at the paths specified in the `volumes` section.

* **Public Key** (`pubkey.pem`): This key can be shared with other parties who need to verify signatures created by your application.
* **Attestation Quote** (`quote.txt`): This file should be provided to any external service or client that needs to verify the origin and integrity of your public key. The verifier can then use the TEE vendor's services to validate the quote and establish trust in your signing key.

### SecretVM Signing Server

The SecretVM Signing Server provides a secure way to generate a cryptographic signature for an arbitrary piece of data (a "payload"). This is useful for verifying the integrity and origin of data.

The process involves sending a payload to the server, which then uses a private key stored in a secure environment to sign it. The server returns a unique signature. This signature can then be publicly verified by anyone who has the corresponding public key, confirming that the payload has not been altered and was indeed signed by the holder of the private key.

#### Signing a Payload

**Endpoint**

To generate a signature, you need to send a POST request to the `/sign` endpoint.

* URL: `http://172.17.0.1:49153/sign`
* Method: `POST`
* **Note**: This endpoint is only accessible from within the internal Docker network for security reasons.

**Request Body**

The request body must be a JSON object containing two fields:

* `key_type` (string): The type of cryptographic key to use for signing. In this example, it's `"secp256k1"`.
* `payload` (string): The data that you want to sign.

**Example:**

```bash
curl -X POST 172.17.0.1:49153/sign -d '{"key_type": "secp256k1", "payload": "My Secret Message" }' 
```

**Response**

If the request is successful, the server will return a JSON object containing the base64-encoded signature.

```json
{
  "signature": "MEUCIQD..."
}
```

## Code Sample

```python
import requests
import base64
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature


def sign_with_server(payload: str) -> str | None:
    signing_server_url = "http://172.17.0.1:49153/sign"
    request_data = {"key_type": "ed25519", "payload": payload}

    try:
        response = requests.post(signing_server_url, json=request_data, timeout=5)

        # Check if the request was successful
        response.raise_for_status()

        signature = response.json().get("signature")
        if signature:
            return signature
        else:
            return None

    except requests.exceptions.RequestException as e:
        print(f"Network or HTTP Error: Could not connect to the signing server. {e}")
        return None
    except ValueError:
        print("Error: Failed to decode JSON response from server.")
        return None


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
    message = "My Secret Message"
    public_key_file = "ed25519_public.pem"

    signature = sign_with_server(message)

    print(verify(message, signature, public_key_file))

```

## Supported algorithms

* secp256k1 (default)
* ed25519
