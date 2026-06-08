# 🚀 Quick Start

## Verify a SecretVM end-to-end

The most common entry point. Connects to the VM, fetches CPU and GPU quotes, validates every binding, and returns a structured result.

{% tabs %}
{% tab title="Node.js" %}
```typescript
import { checkSecretVm } from "secretvm-verify";

const result = await checkSecretVm("my-vm.vm.scrtlabs.com");

if (result.valid) {
  console.log("VM is genuine:", result.report.tls_fingerprint);
} else {
  console.error("Failed checks:", result.errors);
}
```
{% endtab %}

{% tab title="Python" %}
```python
from secretvm.verify import check_secret_vm

result = check_secret_vm("my-vm.vm.scrtlabs.com")

if result.valid:
    print("VM is genuine:", result.report["tls_fingerprint"])
else:
    print("Failed checks:", result.errors)
```
{% endtab %}

{% tab title="CLI" %}
```bash
secretvm-verify --secretvm my-vm.vm.scrtlabs.com
```

Output:

```
Verifying my-vm.vm.scrtlabs.com

Checks:
  cpu_quote_fetched:                  PASS
  tls_cert_fetched:                   PASS
  cpu_quote_verified:                 PASS
  tls_binding_verified:               PASS
  gpu_quote_fetched:                  PASS
  gpu_quote_verified:                 PASS
  gpu_binding_verified:               PASS
  workload_fetched:                   PASS
  workload_binding_verified:          PASS

OK
```
{% endtab %}
{% endtabs %}

## Verify a workload against a docker-compose

Use when you have an expected compose file and need to confirm a VM is running it.

{% tabs %}
{% tab title="Node.js" %}
```typescript
import { verifyWorkload, formatWorkloadResult } from "secretvm-verify";
import { readFileSync } from "node:fs";

const quote = readFileSync("cpu_quote.txt", "utf8");
const compose = readFileSync("docker-compose.yaml", "utf8");

const result = verifyWorkload(quote, compose);
console.log(formatWorkloadResult(result));
```
{% endtab %}

{% tab title="Python" %}
```python
from secretvm.verify import verify_workload, format_workload_result

with open("cpu_quote.txt") as q, open("docker-compose.yaml") as c:
    result = verify_workload(q.read(), c.read())

print(format_workload_result(result))
```
{% endtab %}
{% endtabs %}

The result is one of:

| Status               | Meaning                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `authentic_match`    | Quote is from a known SecretVM **and** the compose matches        |
| `authentic_mismatch` | Quote is from a known SecretVM but the compose does **not** match |
| `not_authentic`      | Quote's measurements do not appear in the SecretVM registry       |

If a VM URL is passed instead of a raw quote, both the quote and the compose are fetched from the VM automatically.

## Verify an ERC-8004 agent

Resolve an on-chain agent and run the full TEE verification against the endpoints it advertises.

{% tabs %}
{% tab title="Node.js" %}
```typescript
import { checkAgent } from "secretvm-verify";

const result = await checkAgent(38114, "base");

console.log(result.valid, result.checks);
```

RPC configuration is **required** — set `SECRETVM_RPC_BASE` (or `SECRETVM_RPC_<CHAIN>`) to your preferred provider.
{% endtab %}

{% tab title="Python" %}
```python
from secretvm.verify import check_agent

result = check_agent(38114, "base")
print(result.valid, result.checks)
```
{% endtab %}

{% tab title="CLI" %}
```bash
export SECRETVM_RPC_BASE="https://base-mainnet.example/..."
secretvm-verify --check-agent 38114 --chain base -v
```
{% endtab %}
{% endtabs %}
