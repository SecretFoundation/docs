---
icon: square-check
---

# Verification Checks

The `checks` field on every result is a flat object keyed by check name. For `checkSecretVm`, the relevant set is:

| Check                       | What it proves                                            |
| --------------------------- | --------------------------------------------------------- |
| `cpu_quote_fetched`         | The VM served a CPU quote at `/cpu`                       |
| `tls_cert_fetched`          | The VM's TLS certificate was retrievable                  |
| `cpu_quote_verified`        | Full DCAP / AMD chain verification passed                 |
| `tls_binding_verified`      | `report_data[0:32]` equals SHA-256 of the TLS cert        |
| `gpu_quote_fetched`         | The VM served a GPU quote at `/gpu` (skipped when no GPU) |
| `gpu_quote_verified`        | NVIDIA NRAS verified the GPU attestation                  |
| `gpu_binding_verified`      | `report_data[32:64]` equals the GPU nonce                 |
| `workload_fetched`          | The VM served a `docker-compose.yaml`                     |
| `workload_binding_verified` | The compose hash replays into the measurement             |
| `proof_of_cloud_verified`   | SCRT Labs' parser confirmed the quote (when opted in)     |

The lower-level functions (`checkTdxCpuAttestation`, `checkSevCpuAttestation`, `checkNvidiaGpuAttestation`) emit their own check rows — e.g. TDX has `quote_parsed`, `quote_verified`, `debug_disabled`; SEV-SNP has `report_signature_valid`, `cert_chain_valid`, `crl_signature_valid`, `vcek_matches_report`, `debug_disabled`, `tcb_ordering_valid`.
