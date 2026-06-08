---
icon: shield-check
---

# Trust Model

Verification is only as strong as what the SDK trusts. The chain is:

* **Intel SGX Root CA** — pinned in code; collateral is fetched from PCCS over HTTPS but the chain is anchored locally.
* **AMD ARK** — pinned per product (Milan, Genoa, Turin) by SHA-256 of its `SubjectPublicKeyInfo`; HTTPS to `kdsintf.amd.com` is **not** load-bearing for trust.
* **NVIDIA NRAS JWKS** — JWT signatures are verified against NVIDIA's published JWKS. The NRAS root CA is **not** currently pinned (NVIDIA does not publish it); the JWKS is trusted via HTTPS.
* **SecretVM registry** — bundled with each release and refreshed from `github.com/scrtlabs/secretvm-verify` on a miss. Refresh content is trusted via HTTPS to GitHub.

The SDK does **not** trust the VM itself, the operator, or the network path beyond what these roots permit.
