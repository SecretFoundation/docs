---
icon: gears
---

# Configuration

## PCCS endpoint (TDX collateral)

By default the SDK fetches Intel TCB Info, QE Identity, and CRLs from `https://pccs.scrtlabs.com`. Point elsewhere with:

```bash
export SECRETVM_PCCS_URL=https://api.trustedservices.intel.com
```

## RPC endpoints (ERC-8004 agents)

No default RPC is shipped. Configure per-chain:

```bash
export SECRETVM_RPC_BASE=https://base-mainnet.example/...
export SECRETVM_RPC_ETHEREUM=https://eth-mainnet.example/...
```

## AMD KDS cache

The SDK caches AMD VCEK certificates, cert chains, and CRLs on disk:

* Default location: `~/.cache/secretvm-verify/amd/`
* Override with `SECRETVM_VERIFY_CACHE_DIR=<path>` — the SDK appends `/amd` automatically.

VCEK and chain entries expire after 30 days; CRLs use the `nextUpdate` field from the CRL itself (typically \~7 months for AMD).

## Strict mode

The default behaviour falls back to a stale cache entry when AMD KDS is unreachable — better to verify with a slightly old CRL than fail every attestation while KDS is down. **Strict mode** disables this fallback so a failed live fetch fails the verification closed:

{% tabs %}
{% tab title="Node.js" %}
```typescript
const result = await checkSecretVm(url, "", false, { strict: true });
```
{% endtab %}

{% tab title="Python" %}
```python
result = check_secret_vm(url, strict=True)
```
{% endtab %}

{% tab title="CLI" %}
```bash
secretvm-verify --secretvm <url> --strict
```
{% endtab %}
{% endtabs %}

Use strict when freshness matters more than availability — for example, to ensure a recently-revoked VCEK can't slip through.

## Registry auto-refresh

The SecretVM identity registry (`tdx.csv`, `sev.json`) is bundled with each release. When the SDK encounters a quote whose measurements are not in the local registry, it transparently fetches the latest registry from GitHub and retries the lookup. This lets the CLI verify VMs running builds that shipped after your installed package version.

A `Registry miss — fetching latest artifacts from GitHub...` line is printed to stderr when the refresh fires.

To trigger the refresh programmatically:

{% tabs %}
{% tab title="Node.js" %}
```typescript
import { refreshRegistryFromGitHub } from "secretvm-verify";

await refreshRegistryFromGitHub();  // returns true on success
```
{% endtab %}

{% tab title="Python" %}
```python
from secretvm.verify import refresh_registry_from_github

refresh_registry_from_github()  # returns True on success
```
{% endtab %}
{% endtabs %}
