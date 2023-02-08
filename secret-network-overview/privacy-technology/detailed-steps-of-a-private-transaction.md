# Steps Of A Private Transaction

1. Using the Eliptic-Curve Diffie Hellman key exchange (ECDH) the user generates a shared secret from their private key and the Secret Network public key. The network can generate the same shared secret using the user public key and the Network private key (only available within the Trusted Execution Environment (TEE)).
2. The user then generates a shared `tx_encryption_key` using HKDF-SHA256 and the shared secret generated in step 1. The pseudo-random HDKF is used to ensure deterministic consensus across all nodes. The random component comes from a 256-bit nonce so that each transaction has its own encryption key, an AES-256-GCM encryption key is never used twice.
3. After initiating a transaction the user encrypts the input data with the shared transaction encryption key, using an AES-256-GCM authenticated encryption scheme.
4. The user then sends a single transaction with encrypted input data, gas fee in SCRT, and optionally a SCRT deposit (as required by the contract) to the contract address. The transaction adds a message with the user public key and the used Nonce so that the network can generate the same `tx_encryption_key.`
5. Validators receive the transaction in the shared mempool, after the Tendermint `check_tx` is deemed successful, and take up the data to process the transaction.
6. Each validator runs on a machine with an Intel SGX compatible CPU. The enclave within this CPU is the trusted component, whereas the process interacting with the enclave locally from the outside is the untrusted component. The encrypted transaction input is passed from the untrusted to the trusted component.
7. The enclave uses ECDH to derive the same shared secret from the users public key and the networks private key. The network then derives the `tx_encryption_key` from the public signed nonce and this shared secret using HDKF. Within the trusted component the transaction input is decrypted to plaintext.
8. The requested contract computation is executed on the plaintext input by the WASMI runtime, which is instantiated within the trusted enclave.
9. There are several possible outcomes from each computation, all of which occur on-chain simultaneously:
   * The contract state is updated.
   * The transaction output is encrypted for the transaction sender and committed on-chain
   * If present, callbacks to other contracts.
   * If present, send messages to other modules.
10. The output of the computation is encrypted using the `tx_encryption_key` and an AES-256-GCM authenticated encryption scheme.
11. The encrypted output is then returned to the untrusted component of the validator node.
12. The validator that proposes the current block broadcasts the encrypted output.
13. Other validators compare their result to that of the block proposer. If more than two-thirds of the current voting power agrees on the result, the proposed block (and all transactions within it) are included in the Secret Network.
