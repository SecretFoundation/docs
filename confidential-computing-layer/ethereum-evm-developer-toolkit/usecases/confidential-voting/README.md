# Confidential Voting

#### Introduction

Confidential voting on Secret Network enables developers to create and manage voting systems where proposals and votes remain encrypted and secure. This ensures confidentiality and integrity in voting processes across EVM-compatible chains. There are 2 cross-chain voting solutions on Secret Network, the first uses SecretPath, and the other ECDH cryptography. &#x20;

1. [ **Enabling Confidential Voting with SecretPath**](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/usecases/confidential-voting/confidential-voting-developer-tutorial-with-secretpath)

* **Overview**: Introduction to using SecretPath as a Confidential Computation Layer for EVM chains, allowing encrypted data transfer and storage on Secret Network. Description of how SecretPath functions as a bridge for encrypted data, facilitating the creation and voting on proposals within a Secret smart contract.
* **Setup and Deployment**: Step-by-step guide on setting up the development environment, compiling and uploading the Secret contract, and configuring the frontend to interact with the SecretPath-enabled voting system.
* **Passing Encrypted Data**: Detailed explanation of how to pass encrypted proposals and votes from the EVM to the Secret Network using SecretPath.

2. [**Encrypting and Decrypting Votes on EVM with ECDH cryptography**](https://docs.scrt.network/secret-network-documentation/confidential-computing-layer/ethereum-evm-developer-toolkit/usecases/confidential-voting/confidential-voting-developer-tutorial)

* **Introduction**: Guide to encrypting and decrypting votes using Secret Network smart contracts, aimed at building confidential voting on any EVM chain.
* **Setup and Configuration**: Instructions for setting up the developer environment, configuring environment variables, and generating cryptographic keys for encryption. Steps to upload and instantiate the Secret Network and Polygon smart contracts, enabling creation and voting on  proposals.
* **Executing Contracts**: Processes for creating proposals, voting, and decrypting votes using the deployed smart contracts on the Polygon testnet and Secret Network.
