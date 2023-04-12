# Input data verification

Secret Contract developers must always consider the trade-off between privacy, user experience, performance and gas usage. Secret Contracts are able to provide privacy by default functionalities through verifying values during Secret Contract execution and verification of transaction parameters.

## Input data needs to be verified

During execution, some contracts may want to use "external-data", meaning data generated outside of the enclave and sent into the enclave, such as the tx sender address, the funds sent with the tx, block height, etc...

As these parameters are sent to the enclave, they can theoretically be tampered with, and an attacker might send false data; making relying on this data **conceivably risky**.

For example, let's say we are implementing an admin interface for a contract, i.e. functionality only for a predefined address. We want to ensure the `env.message.sender` parameter provided during contract execution is legitimate, so we will confirm that `env.message.sender == predefined_address`. If this condition is met we can provide admin functionality. If the `env.message.sender` parameter can be tampered with — we effectively can't rely on it and cannot implement the admin interface.

## Tx Parameter Verification

Some parameters are easier to verify than others. Exact details about individual parameters are detailed further in this document.

The parameter verification method depends on the contract caller:

* If the contract is called by a transaction (i.e. someone sends a compute tx) we use the already-signed transaction and verify it's data inside the enclave. More specifically:
  * Verify the signed data and the signature bytes are self consistent
  * Verify the parameters sent to the enclave matches with the signed data
* If the contract is called by another contract (i.e. we don't have a signed tx to rely on) we create a callback signature (which can only be created inside the enclave), effectively signing the parameters sent to the next contract:
  * Caller contract creates `callback_signature` based on parameters it sends, passes it on to the next contract
  * Receiver contract creates `callback_signature` based on the parameter it got.
  * Receiver contract verifies the signature it created matches the signature it got from the caller
  * For the specifics, visit the [encryption specs](../encryption-key-management/)

For more detailed explanations of Secret Contracts see the [Secret Contracts section under Development](broken-reference).
