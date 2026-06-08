---
icon: diagram-project
---

# How it Works

The operational framework depends on a symbiotic interaction between two distinct node roles:

* **The Provider** (SGX Node): During transaction processing, this node captures the deterministic outcomes of contract execution—including state transitions and gas consumption—within a specialized local database.
* **The Consumer** (Non-SGX Node): By establishing a gRPC connection to one or more Providers, the Consumer fetches authoritative execution traces and applies these operations to its own ledger in a bit-for-bit identical manner.
* **secretd-sgx-proxy** (beta) - a gRPC transparent proxy sidecar for Secret Network SGX nodes. It gates access to sgx data endpoints (traces, enclave records) behind a block-based consumption billing model.
* **SGX Provider Registry Contract** - A Smart Contract on Secret Network where SGX data providers can register their SGX Providers

The diagram below shows the overall architecture of the system:

<figure><img src="../../../.gitbook/assets/image (52).png" alt=""><figcaption></figcaption></figure>
