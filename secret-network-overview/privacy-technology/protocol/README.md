# Protocol

The Secret Network Protocol is run by network validators, and consists of two main components: trusted and untrusted sections. The untrusted section is responsible for all untrusted code used by validators in the network, including Cosmos-SDK code, tendermint code, and the creation of enclaves (trusted components). The trusted component (the enclave) is responsible for executing CosmWasm based contracts, executing any functions designated within these contracts, and reading and writing (encrypted data) to Tendermint state during execution. The Secret Network’s `x/compute` model bridges these two sections, and enables access to the trusted component.

Secret Network enables validators to perform computation over private data. This involves a number of processes, including:

* [Registration](https://docs.scrt.network/protocol/encryption-specs.html#new-node-registration): The process of a new validator joining the network
* [Encryption / Decryption](https://docs.scrt.network/protocol/encryption-specs.html): Both of network-wide state keys, as well as encryption keys for input and output of specific computations
* [Computation](https://docs.scrt.network/protocol/components.html#secret-contracts): Executing Secret Contract code

The Secret Network performs computations in a Trusted Execution Environment. More precisely, the Secret Network uses [Intel® Software Guard Extensions](https://en.wikipedia.org/wiki/Software\_Guard\_Extensions) (Intel® SGX), which is set of instructions that increase the security of application code and data, giving them more protection from disclosure or modification.

As requested by SGX technology, the Secret Network Protocol code is partitioned into trusted and untrusted parts. The trusted part contains sensitive data and it is executed inside an “enclave”, which is a term referring to the secure component of a Trusted Execution Environment. The untrusted part includes the rest of the code, along with code for managing the enclave (load and destroy).

![enclave](https://docs.scrt.network/assets/img/enclave.533f8c23.png)

Figure: diagram of Core, trusted and untrusted components
