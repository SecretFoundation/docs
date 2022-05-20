# Trusted Core

Trusted Core

* Responsible for executing Secret Contracts.
* Responsible for SGX-specific mechanisms: Remote Attestation and Sealing (see subsections). The core protocol uses [Rust SGX SDK](https://github.com/apache/incubator-teaclave-sgx-sdk) to call Intel® SGX C++ APIs.
* Able to make read/write calls from the Tendermint state at any point during execution.
* The enclave only stores the seed. The enclave may potentially also store the local node's (sk\_node,pk\_node) key pair, though this is up for debate.

note

During contract execution you can only change the state of the contract you're executing. You can query other contracts (i.e. run code that can't change the state of another contract) synchronously, but you can only queue calls to other contracts and requests for transactions. Those operations will happen after the contract has finished running. This is intentional as it prevents a lot of bugs, like the reentrancy bugs plaguing ethereum.

### [#](https://docs.scrt.network/protocol/intro.html#untrusted-core) <a href="#untrusted-core" id="untrusted-core"></a>

\
