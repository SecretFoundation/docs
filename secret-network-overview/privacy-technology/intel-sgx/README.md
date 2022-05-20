# Intel SGX

The Secret Network uses a type of Trusted Execution Environment based on Intel’s Software Guard Extensions (SGX). SGX chips are found in most Intel hardware products. By using SGX chips, the chip owners, system operators, and observers have strong cryptographic guarantees that no party can view what's happening inside of the Secret Networks memory space.

Enclaves generate and contain their private signing/attestation keys, preventing access from any entity outside of each enclave. All data can only be signed using keys associated with specific instruction sets running in each enclave. For more details on key generation and management within enclaves, see our section about [encryption](https://docs.scrt.network/protocol/encryption-specs.html).

For our purposes, the attestation key is only used once upon registration. After registration new keys are provisioned to the enclave and used to communicate with the network. This process is described in more detail below.

Enclaves also go through a detailed registration and attestation process. Specifically, the attestation process which each validator running an SGX enclave must go through ensures the following assertions regarding privacy and correctness:

* The application’s identity
* Its intactness (that it has not been tampered with)
* That it is running securely within an enclave on an Intel SGX enabled platform

For more detailed information on the Intel SGX remote attestation process, see the below section on the attestation process.
