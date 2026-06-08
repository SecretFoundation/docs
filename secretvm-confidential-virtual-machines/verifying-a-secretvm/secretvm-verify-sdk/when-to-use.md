---
icon: clock-five
---

# When to Use

| Goal                                                       | Use                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| Confirm a SecretVM is genuine before sending it secrets    | `checkSecretVm` / `check_secret_vm`                   |
| Bind an agent identity to its TEE                          | `checkAgent` / `check_agent`                          |
| Confirm a VM is running a specific docker-compose          | `verifyWorkload` / `verify_workload`                  |
| Verify a single CPU quote you already have on disk         | `checkCpuAttestation` / `check_cpu_attestation`       |
| Identify which official SecretVM template produced a quote | `resolveSecretVmVersion` / `resolve_secretvm_version` |

If you only need a CLI, install the npm package globally and run `secretvm-verify` — it covers everything the SDK does.
