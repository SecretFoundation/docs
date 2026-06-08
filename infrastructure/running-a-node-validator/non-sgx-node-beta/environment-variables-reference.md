---
icon: sliders
---

# Environment Variables Reference

<table><thead><tr><th width="196.66796875">Variable</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td>SECRET_NODE_MODE</td><td>sgx</td><td>Set to replay for Non-SGX functionality.</td></tr><tr><td>SECRET_STORE_SGX_DATA</td><td>false</td><td>Enables trace recording on SGX Providers.</td></tr><tr><td>SECRET_SGX_DATA_RETENTION_BLOCKS</td><td>1296000</td><td>Retention window for Provider trace records.</td></tr><tr><td>SECRET_SGX_DATA_PRUNE_INTERVAL</td><td>100</td><td>Frequency of the cleanup process.</td></tr><tr><td>SECRET_ECALL_RECORD_DIR</td><td>~/.secretd/data/</td><td>Path for the LevelDB trace storage.</td></tr><tr><td>SECRET_SGX_NODES_CONFIG</td><td>~/.secretd/config/sgx_nodes.json</td><td>JSON configuration for Consumer nodes.</td></tr><tr><td>SECRET_SGX_NODE_GRPC</td><td>localhost:9090</td><td>Fallback gRPC address for trace retrieval.</td></tr></tbody></table>
