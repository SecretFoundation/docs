# Secret Contracts - Execution

A Secret Contract’s code is always deployed publicly on-chain, so users and developers know exactly what code will be executed on submitted data. However, the data that is submitted is encrypted, so as previously stated, it cannot be read by a developer, anyone observing the chain, or anyone running a node. If the behavior of the code is trusted (which is possible because it is recorded on chain), a user of Secret Contracts obtains strong privacy guarantees.

This encrypted data can only be accessed from within the “trusted execution environment”, or enclave, that the compute module requires each validator to run. The computation of the Secret Contract is then performed, within this trusted enclave, where the data is decrypted. When the computation is completed, the output is encrypted and recorded on-chain.&#x20;

There are various types of outputs that can be expected, including:&#x20;

* An updated contract state (i.e., the user’s data should update the state or be stored for future computations)&#x20;
* A computation result encrypted for the transaction sender (i.e., a result should be returned privately to the sender)&#x20;
* Callbacks to other contracts (i.e., a contract is called conditional on the outcome of a Secret Contract function)&#x20;
* Send messages to other modules (i.e., for sending value transfer messages that depend on the outcome of a computation).&#x20;

The “compute” module currently requires validators to run nodes with Intel SGX chips (enclaves). These enclaves contain signing keys generated within the enclave for remote attestation.
