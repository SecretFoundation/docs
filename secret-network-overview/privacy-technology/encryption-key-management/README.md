# Encryption - Key Management

The Secret Network uses both symmetric and asymmetric encryption protocols. Specifically, asymmetric cryptography is used for achieving consensus and sharing secrets between nodes and users, whereas symmetric cryptography is used for input/output encryption with users of Secret Contracts, as well as internal contract state encryption.&#x20;

Secret Network Protocol uses the ECDH key exchange mechanism between users and validators. This process involves the user, the Secret Blockchain, as well as the trusted component of the Secret Protocol. It is initiated any time a transaction is sent from the user to the Secret Contract.&#x20;

For a more extensive discussion of our cryptography we have developed this section of the documentation.

* [Overview](overview.md)
* [Key Derivation & Encryption Techniques](key-derivation-and-encryption-techniques.md)
* [The Initialization Of Secret Network](bootstrap-process.md)
* [Fill Node Bootstrap](full-node-boostrap.md)
* [Nodes](broken-reference)
* [Contract State Encryption](contract-state-encryption.md)
* [Transaction Encryption](transaction-encryption.md)

