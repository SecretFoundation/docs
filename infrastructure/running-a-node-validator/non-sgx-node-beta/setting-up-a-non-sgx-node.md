---
icon: microchip
---

# Setting up a Non-SGX Node

Download the Non-SGX Binary from the release page and replace secretd.

Configure Upstream Providers: Define your Provider pool by creating the `~/.secretd/config/sgx_nodes.json` configuration:

```
{
  "nodes": [
    "sgx-provider-1.yourdomain.com:9090",
    "sgx-provider-2.yourdomain.com:9090"
  ]
}
```

Enable Replay Mode:

```
export SECRET_NODE_MODE=replay
```

Start the Node:

```
./secretd-nosgx start
```

#### **Syncing Strategies**

Non-SGX instances are fully compatible with standard Cosmos SDK synchronization methods. Operators may perform a full sync from genesis, utilize rapid State Sync, or deploy a standard snapshot and begin trace replay from the snapshot height.

### Troubleshooting

#### Node stalls with "Waiting for SGX node trace"

The Non-SGX node will persist in retry attempts if the execution trace is unavailable. Verify the following:

* Provider Connectivity: Ensure the SGX Provider is active and the gRPC port is reachable via the network.
* Consensus Lag: It is standard for the Consumer to lag approximately 1-2 blocks behind the Provider during real-time synchronization.
* Data Pruning: The requested block may have been pruned by the Provider. In this case, synchronize from a more recent state.

#### Cannot serve encrypted queries

This is expected behavior. Since Non-SGX nodes do not possess a secure enclave, they lack the keys required to decrypt contract state. All privacy-preserving requests must be routed to an SGX-enabled RPC endpoint.
