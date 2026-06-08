---
icon: rectangle-code
---

# CLI Reference

```bash
secretvm-verify <command> [options]
```

## Commands

| Command                                               | Description                                       |
| ----------------------------------------------------- | ------------------------------------------------- |
| `--secretvm <url>`                                    | End-to-end SecretVM verification                  |
| `--cpu <file\|--vm url>`                              | Verify a CPU quote (auto-detect TDX vs SEV-SNP)   |
| `--tdx <file\|--vm url>`                              | Verify an Intel TDX quote                         |
| `--sev <file\|--vm url>`                              | Verify an AMD SEV-SNP report                      |
| `--gpu <file\|--vm url>`                              | Verify an NVIDIA GPU attestation                  |
| `--verify-workload <file\|--vm url> --compose <file>` | Verify a quote against a docker-compose           |
| `--resolve-version <file\|--vm url>`                  | Identify which SecretVM template produced a quote |
| `--check-agent <id> --chain <name>`                   | Resolve and verify an ERC-8004 agent              |
| `--compose <file\|--vm url>`                          | Print the docker-compose.yaml to stdout           |

## Options

| Option             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `--json \| --raw`  | Structured output                                  |
| `--strict`         | Disable stale-cache fallback on AMD KDS failure    |
| `--proof-of-cloud` | Run the SCRT Labs proof-of-cloud check             |
| `--reload-amd-kds` | Bypass the local AMD KDS cache                     |
| `--show-compose`   | Print the verified docker-compose after the checks |
| `--verbose, -v`    | Pretty-print parsed report fields                  |

A bare URL defaults to `--secretvm`:

```bash
secretvm-verify my-vm.vm.scrtlabs.com
```
