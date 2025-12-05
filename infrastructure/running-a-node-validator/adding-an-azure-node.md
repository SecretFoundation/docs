# Adding an Azure node

Starting from v 1.23, Secret Network can accept Azure nodes without the need to whitelist them.

In order to register an Azure node, an additional step is required to sign the attestation report with an Azure signature.

This additional step needs to be performed right after[ Verify Enclave Initialization](setting-up-a-node-validator/testnet/run-a-full-node.md#verify-enclave-initialization) step in the [Setup Full Node](setting-up-a-node-validator/testnet/run-a-full-node.md) guide

```
wget https://github.com/scrtlabs/SecretNetwork/releases/download/v1.23.0/embed_azure_attestation.sh

chmod +x embed_azure_attestation.sh

./embed_azure_attestation.sh /opt/secret/.sgx_secrets/attestation_combined.bin
```

After the script executes, the `attestation_combined.bin` file will be updated (verify the change in the file size), and continue to the next step of the node setup - [Configure secretd](setting-up-a-node-validator/testnet/run-a-full-node.md#configure-secretd)&#x20;
