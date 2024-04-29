# Secretcli vs. Secretd

There are differences between `secretcli` and `secretd`. `secretd` is a full node including the code running inside [SGX](../../../introduction/secret-network-techstack/privacy-technology/intel-sgx/why-sgx.md), and secretcli is a command line interface (CLI) for sending and querying Secret Network transactions.

## Why Make A Distinction Between `secretcli` And `secretd`?

Since `secretd` requires a full node with SGX capabilities; it's less user-friendly than secretcli because users must do the secondary step of installing SGX for its use. Most users interacting with the Secret Network using a CLI will not require a full node for sending and querying transactions and do not need to access a full node with the code running inside SGX.

### A Better User Experience

The decision to make a distinction between `secretcli` and `secretd` was created to improve user experience. Installing SGX on Windows (hard), Mac (not supported), and desktop Linux (hard) is challenging and only required for specific use cases like running a full node, checking the status of a node, viewing public keys associated with a node, backing up mnemonics of a node, etc...
