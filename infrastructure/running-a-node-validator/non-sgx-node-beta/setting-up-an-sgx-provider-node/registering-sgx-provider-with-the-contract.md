---
icon: file-signature
---

# Registering SGX Provider with the Contract

Optionally, the SGX Provider can register its services with the Registration Conract so that the Non-SGX node operators can discover the services

The registry repository, including the contract details and listed provider nodes, is available in the [sgx-node-registry README](https://github.com/scrtlabs/sgx-node-registry/blob/master/README.md). This step is optional. Direct connections still work when the provider endpoint is already known.

The registry contract is deployed on Secret mainnet, so you can query it directly to inspect registered providers before configuring a Non-SGX node. This is useful when you want to discover available SGX providers, check a specific node identity, or list all nodes published by one operator.

Use the following examples against the mainnet contract:

```bash
# List registered nodes
secretcli q compute query secret1h7xzl06j47vvp4ajwfge6la7gu8anxvpqt326k \
  '{"list_nodes":{}}'

# Get one node by identity
secretcli q compute query secret1h7xzl06j47vvp4ajwfge6la7gu8anxvpqt326k \
  '{"get_node":{"identity":"<NODE_IDENTITY>"}}'

# List all nodes registered by one operator
secretcli q compute query secret1h7xzl06j47vvp4ajwfge6la7gu8anxvpqt326k \
  '{"list_nodes_by_operator":{"operator":"<WALLET_ADDRESS>"}}'
```

