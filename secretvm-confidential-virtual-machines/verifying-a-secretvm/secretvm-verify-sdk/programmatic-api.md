---
icon: laptop-code
---

# Programmatic API

Most callers only need three functions:

| Node.js                          | Python                            | Purpose                         |
| -------------------------------- | --------------------------------- | ------------------------------- |
| `checkSecretVm(url)`             | `check_secret_vm(url)`            | End-to-end SecretVM check       |
| `checkAgent(id, chain)`          | `check_agent(id, chain)`          | End-to-end ERC-8004 agent check |
| `verifyWorkload(quote, compose)` | `verify_workload(quote, compose)` | Quote + compose match           |

Lower-level functions are available for each layer:

* `checkTdxCpuAttestation` / `check_tdx_cpu_attestation`
* `checkSevCpuAttestation` / `check_sev_cpu_attestation`
* `checkNvidiaGpuAttestation` / `check_nvidia_gpu_attestation`
* `checkCpuAttestation` / `check_cpu_attestation` (auto-detect TDX vs SEV-SNP)
* `checkProofOfCloud` / `check_proof_of_cloud`
* `resolveSecretVmVersion` / `resolve_secretvm_version`
* `verifyTdxWorkload` / `verify_tdx_workload`
* `verifySevWorkload` / `verify_sev_workload`

All return an `AttestationResult` with `valid`, `attestationType` / `attestation_type`, `checks`, `report`, and `errors`. See the [API reference in the README](https://github.com/scrtlabs/secretvm-verify#api-reference) for the full schema.
