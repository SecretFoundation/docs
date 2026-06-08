---
icon: server
---

# Setting up an SGX Provider Node

### Node Setup

To function as a Provider, an existing SGX node must be enabled to archive its execution data for downstream consumption.

Enable Data Recording: Add the following to \~/.secretd/config/app.toml under the \[wasm] section:

```
[wasm]
store-sgx-data = true
```

Alternatively, you can set the environment variable prior to node startup:

```
export SECRET_STORE_SGX_DATA=true
```

Storage Management (Optional): To manage storage overhead, the Provider utilizes an automated pruning process. Operators can customize the data lifecycle via these parameters:

```
# Define the block retention window (default is ~90 days)
export SECRET_SGX_DATA_RETENTION_BLOCKS=1296000

# Define the execution frequency for the cleanup task
export SECRET_SGX_DATA_PRUNE_INTERVAL=100
```

Start the Node:

```
secretd start
```

The SGX node will now serve recorded traces via its gRPC interface (port 9090). Ensure firewall configurations permit inbound traffic from your Non-SGX infrastructure.

Next step is setting up the secretd-sgx-proxy

