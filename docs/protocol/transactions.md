# Transactions

1. User retrieves `pk_io` (curve secp256k1) from the blockchain to derive a shared key using ECDH. When the user submits a transaction, the body of the message contains the user’s public key and signature (standard Tendermint transaction) enabling validators to also derive a shared key using ECDH.  
2. User encrypts input data with this shared key, using an AES-256-GCM authenticated encryption scheme.
3. User sends a single transaction with encrypted input data, gas fee in SCRT, and optionally a SCRT deposit as required by the contract to the contract address. 
4. Validators receive the transaction. Each Validator has an Intel SGX enclave. The enclave itself is the trusted component, whereas the process interacting with the enclave locally from the outside is the untrusted component. The encrypted input is passed from the untrusted to trusted components. 
5. The enclave uses ECDH to derive the shared key from `sk_io` and the user’s public key. The enclave decrypts the input within the trusted component. The requested contract computation executes with the plaintext input by the WASMI runtime, which is instantiated within the trusted enclave. 
6. There are several possible outcomes from each computation, all of which occur on-chain simultaneously:
    * The contract state is updated.
    * The transaction output is encrypted for the transaction sender and committed on-chain.
    * If present, callbacks to other contracts.
    * If present, send messages to other modules. 
  
::: tip Note 
Currently, only transfer funds messages are available.
:::
    
7. The output of the computation is encrypted (via pseudo-randomness determined by the seed - to ensure deterministic consensus across all nodes) and returned to the untrusted part of the Validator node. An AES-256-GCM encryption key is never used twice, but new keys are derived in a deterministic way from a seed.
8. The validator who is the block proposer broadcasts the encrypted output. 
9. Other validators compare their result to that of the block proposer. If more than two-thirds of the current voting power agrees on the result, the proposed block (and all transactions within it) are included in the Secret Network.
