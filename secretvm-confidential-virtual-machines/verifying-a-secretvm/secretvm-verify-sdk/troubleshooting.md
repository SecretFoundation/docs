---
icon: square-question
---

# Troubleshooting

<details>

<summary><code>tls_cert_fetched: FAIL — Hostname/IP does not match certificate's altnames</code></summary>

SecretVM TLS certs are issued for a hostname, not the bare IP. Verify by hostname (e.g. `my-vm.vm.scrtlabs.com`), not the IP literal.

</details>

<details>

<summary><code>workload_binding_verified: FAIL</code></summary>

The VM is genuine, but the `docker-compose.yaml` you passed (or that the VM serves) does not match the launch measurement. Either you have the wrong compose file or the VM is not running what it advertises.

</details>

<details>

<summary><code>workload_binding_verified: FAIL — not_authentic</code></summary>

The MRTD/RTMR (TDX) or family\_id/image\_id (SEV-SNP) is not in the SecretVM registry. If you're on an older SDK release the auto-refresh will pull the latest registry from GitHub on the next miss; otherwise, upgrade with `npm i -g secretvm-verify@latest` or `pip install -U secretvm-verify`.

</details>

<details>

<summary><code>gpu_quote_verified: FAIL — NRAS timeout</code></summary>

NRAS occasionally rate-limits. Retry; if persistent, NRAS may be experiencing an incident.

</details>

<details>

<summary><code>AMD KDS 429 / unreachable</code></summary>

The default cache rescues you in this case. If you've enabled `--strict`, KDS unavailability surfaces as a verification failure on purpose — switch off strict mode or wait for KDS to recover.

</details>
