# Registration and Cryptography

The Secret Network enables Secret Contracts by using encryption protocols and trusted execution environments (TEEs). The reliability of TEEs is verified through a process known as remote attestation (which is required for a node to participate in the network). The Secret Network uses both symmetric and asymmetric encryption protocols. Specifically, asymmetric cryptography is used for achieving consensus and sharing secrets between nodes and users, whereas symmetric cryptography is used for input/output encryption with users of Secret Contracts, as well as internal contract state encryption.

Secret Network Protocol uses the ECDH key exchange mechanism between users and validators. This process involves the user, the Secret Blockchain, as well as the trusted component of the Secret Protocol. It is initiated any time a transaction is sent from the user to the Secret Contract.

For a more extensive discussion of our cryptography approaches, see our [encryption specs](https://docs.scrt.network/protocol/encryption-specs.html).
