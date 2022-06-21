# Encryption - Key Management

The Secret Network enables Secret Contracts by using encryption protocols and trusted execution environments (TEEs). The reliability of TEEs is verified through a process known as remote attestation (which is required for a node to participate in the network). The Secret Network uses both symmetric and asymmetric encryption protocols. Specifically, asymmetric cryptography is used for achieving consensus and sharing secrets between nodes and users, whereas symmetric cryptography is used for input/output encryption with users of Secret Contracts, as well as internal contract state encryption.

Secret Network Protocol uses the ECDH key exchange mechanism between users and validators. This process involves the user, the Secret Blockchain, as well as the trusted component of the Secret Protocol. It is initiated any time a transaction is sent from the user to the Secret Contract.

For a more extensive discussion of our cryptography approaches, see our [encryption specs](https://docs.scrt.network/protocol/encryption-specs.html).

\-------



The Secret Network Protocol is run by network validators, and consists of two main components: trusted and untrusted sections. The untrusted section is responsible for all untrusted code used by validators in the network, including Cosmos-SDK code, tendermint code, and the creation of enclaves (trusted components). The trusted component (the enclave) is responsible for executing CosmWasm based contracts, executing any functions designated within these contracts, and reading and writing (encrypted data) to Tendermint state during execution. The Secret Network’s `x/compute` model bridges these two sections, and enables access to the trusted component.

Secret Network enables validators to perform computation over private data. This involves a number of processes, including:

* [Registration](https://docs.scrt.network/protocol/encryption-specs.html#new-node-registration): The process of a new validator joining the network
* [Encryption / Decryption](https://docs.scrt.network/protocol/encryption-specs.html): Both of network-wide state keys, as well as encryption keys for input and output of specific computations
* [Computation](https://docs.scrt.network/protocol/components.html#secret-contracts): Executing Secret Contract code

The Secret Network performs computations in a Trusted Execution Environment. More precisely, the Secret Network uses [Intel® Software Guard Extensions](https://en.wikipedia.org/wiki/Software\_Guard\_Extensions) (Intel® SGX), which is set of instructions that increase the security of application code and data, giving them more protection from disclosure or modification.

As requested by SGX technology, the Secret Network Protocol code is partitioned into trusted and untrusted parts. The trusted part contains sensitive data and it is executed inside an “enclave”, which is a term referring to the secure component of a Trusted Execution Environment. The untrusted part includes the rest of the code, along with code for managing the enclave (load and destroy).

![enclave](https://docs.scrt.network/assets/img/enclave.533f8c23.png)

Figure: diagram of Core, trusted and untrusted components



\-------







1. public key and signature (standard Tendermint transaction) enabling validators to also derive a shared key using ECDH.
2. User encrypts input data with this shared key, using an AES-256-GCM authenticated encryption scheme.
3. User sends a single transaction with encrypted input data, gas fee in SCRT, and optionally a SCRT deposit as required by the contract to the contract address.
4. Validators receive the transaction. Each Validator has an Intel SGX enclave. The enclave itself is the trusted component, whereas the process interacting with the enclave locally from the outside is the untrusted component. The encrypted input is passed from the untrusted to trusted components.
5. The enclave uses ECDH to derive the shared key from `sk_io` and the user’s public key. The enclave decrypts the input within the trusted component. The requested contract computation executes with the plaintext input by the WASMI runtime, which is instantiated within the trusted enclave.
6. There are several possible outcomes from each computation, all of which occur on-chain simultaneously:
   * The contract state is updated.
   * The transaction output is encrypted for the transaction sender and committed on-chain.
   * If present, callbacks to other contracts.
   * If present, send messages to other modules.

Note

Currently, only transfer funds messages are available.

1. The output of the computation is encrypted (via pseudo-randomness determined by the seed - to ensure deterministic consensus across all nodes) and returned to the untrusted part of the Validator node. An AES-256-GCM encryption key is never used twice, but new keys are derived in a deterministic way from a seed.
2. The validator who is the block proposer broadcasts the encrypted output.
3. Other validators compare their result to that of the block proposer. If more than two-thirds of the current voting power agrees on the result, the proposed block (and all transactions within it) are included in the Secret Network.
