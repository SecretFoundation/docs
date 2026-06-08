---
icon: hand-holding-star
---

# How it Works

```
                         ┌─────────────────────────────┐
   TLS handshake ───────►│  X.509 cert (TLS)           │──┐
                         └─────────────────────────────┘  │  SHA-256(cert)
                                                          ▼
   GET /cpu ────────────►┌─────────────────────────────┐  │
                         │  CPU quote (TDX or SEV-SNP) │──┤  report_data[0:32] ?
                         └──────┬──────────────────────┘  │
                                │ signature, TCB, CRL     │
                                ▼                         ▼
                         ┌─────────────────────────────┐  TLS binding
                         │  Manufacturer root of trust │
                         │  (Intel SGX RootCA / AMD ARK)│
                         └─────────────────────────────┘
                                │
                                ▼
   GET /gpu ────────────►┌─────────────────────────────┐
                         │  NVIDIA NRAS verdict        │──► report_data[32:64] ?
                         └─────────────────────────────┘     GPU binding
                                │
                                ▼
   GET /docker-compose ─►┌─────────────────────────────┐
                         │  docker-compose.yaml        │──► RTMR3 replay (TDX)
                         └─────────────────────────────┘     launch digest (SEV)
                                │                            ?= measurement
                                ▼
                         ┌─────────────────────────────┐
                         │  SecretVM registry lookup   │──► template + version
                         └─────────────────────────────┘
```

Each arrow is a check that must pass. A failure short-circuits the result with a specific error message but the SDK still returns the partial `checks` map so you can see exactly which step failed.
