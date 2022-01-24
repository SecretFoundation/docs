# Intel SGX

## Overview

The Secret Network uses a type of Trusted Execution Environment based on Intel’s Software Guard Extensions (SGX). SGX chips are found in most Intel hardware products. By using SGX chips, the chip owners, system operators, and observers have strong cryptographic guarantees that no party can view what's happening inside of the Secret Networks memory space. 

Enclaves generate and contain their private signing/attestation keys, preventing access from any entity outside of each enclave. All data can only be signed using keys associated with specific instruction sets running in each enclave. For more details on key generation and management within enclaves, see our section about [encryption](encryption-specs.md). 

For our purposes, the attestation key is only used once upon registration. After registration new keys are provisioned to the enclave and used to communicate with the network. This process is described in more detail below.

Enclaves also go through a detailed registration and attestation process. Specifically, the attestation process which each validator running an SGX enclave must go through ensures the following assertions regarding privacy and correctness:

- The application’s identity
- Its intactness (that it has not been tampered with)
- That it is running securely within an enclave on an Intel SGX enabled platform

For more detailed information on the Intel SGX remote attestation process, see the below section on the attestation process.

## Why SGX

Intel SGX is one of the most used and widely available implementations of Trusted Execution Environments (TEEs). We have selected this technology for the initial version of the Secret Network for two main reasons:

1. Usability: SGX is more performant and more flexible than other solutions for privacy-preserving computation. The Secret Network is building a platform for decentralized, general purpose private computation. This requires a privacy solution that can enable a wide-range of use cases. It also requires computations to be on par, performance-wise, with non-privacy preserving computation, so that speed does not limit application usability.
2. Security: SGX is one of the most widely adopted technologies for TEEs, it is also battle-hardened. Attacks are often theoretical, executed in laboratory settings, and are rapidly addressed by Intel. Many high-value targets exist which have not been compromised. No privacy solution is 100% secure, but we believe the security guarantees provided by Intel SGX are adequate for a wide range of use-cases.

## SGX Updates

The Secret Network uses validators equipped with Intel SGX. Upon registration, validators are required to have the latest compatible version of Intel SGX. When significant updates are released, the network may enforce upgrades through governance proposals and Secret Network code updates (hard forks).

## Remote Attestation

Remote attestation, an advanced feature of Intel SGX, is the process of proving an enclave is established in a secure hardware environment. A remote party should be able to verify that the right application is running inside an enclave on an Intel SGX enabled platform. 

Remote attestation provides verification for three things: 

- The application’s identity 
- Its intactness (that it has not been tampered with) 
- That it's running securely within an enclave on an Intel SGX enabled platform 

Attestation is necessary in order to make remote access secure because an enclave’s contents may have to be accessed remotely, not from the same platform [[1]]

The attestation process consists of seven stages, encompassing several actors, namely the service provider (referred to as a challenger) on one platform; and the application, the application’s enclave, the Intel-provided Quoting Enclave (QE), and Provisioning Enclave (PvE) on another platform. A separate entity in the attestation process is Intel Attestation Service (IAS), which carries out the verification of the enclave [[1]][[2]][[3]].

In short, the seven stages of remote attestation comprise of making a remote attestation request
(stage 1), performing a local attestation (stages 2-3), converting the local attestation to a remote
attestation (stages 4-5), returning the remote attestation to the challenger (stage 6), and verifying
the remote attestation (stage 7) [[1]][[3]].

Intel Remote Attestation also includes the establishment of a secure communication session between the service provider and the application. This is analogous to how the familiar TLS handshake includes both authentication and session establishment.

[1]: https://courses.cs.ut.ee/MTAT.07.022/2017_spring/uploads/Main/hiie-report-s16-17.pdf
[2]: https://software.intel.com/en-us/articles/innovative-technology-for-cpu-based-attestation-and-sealing
[3]: https://software.intel.com/content/www/us/en/develop/download/intel-sgx-intel-epid-provisioning-and-attestation-services.html
