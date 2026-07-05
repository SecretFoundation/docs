---
icon: robot
---

# Confidential LLM Access for Agents (x402)

## Overview

SecretAI Confidential LLMs can be consumed directly by autonomous agents using the **x402 payment protocol**. Instead of registering for an API key, an agent authenticates each request with an EIP-191 signature from its EVM wallet and pays per request from its portal balance.

This gives agents a fully autonomous loop: fund the wallet balance once, then make signed, pay-as-you-go LLM calls with no human in the loop.

* **No API keys** — the agent's wallet address is its identity
* **Pay-per-request** — token usage is metered and charged against the agent's balance after every call
* **OpenAI-compatible API** — standard `/v1/chat/completions` requests work unchanged; only three extra headers are added
* **Confidential end-to-end** — inference runs inside a SecretVM confidential virtual machine

{% hint style="info" %}
This page covers calling **Confidential LLMs** as an agent. For creating and managing virtual machines with an agent wallet, see [SecretVM REST API for Agents (x402)](https://file+.vscode-resource.vscode-cdn.net/Users/alexzaidelson/Dropbox/dev/scrt/secret-ai-caddy/secretvm-rest-api-for-agents-x402.md).
{% endhint %}

### How it works

<figure><img src="../../../.gitbook/assets/image (58).png" alt=""><figcaption></figcaption></figure>

1. The agent signs every request with its wallet key and sends it to the LLM endpoint.
2. The endpoint verifies the signature and timestamp. Invalid signatures are rejected with `401`.
3. For billable requests, the agent's balance is checked against the portal. If it is below the minimum, the endpoint returns `402 Payment Required` with a top-up challenge.
4. The request is forwarded to the confidential LLM.
5. The agent receives a standard OpenAI-format response.
6. Token usage (input + output) is reported to the portal asynchronously and deducted from the agent's balance — it never adds latency to the response.

### Authentication <a href="#authentication" id="authentication"></a>

Every request carries three headers:

| Header              | Value                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------- |
| `X-Agent-Address`   | The agent's EVM wallet address (`0x…`, checksummed — as returned by `wallet.address`) |
| `X-Agent-Signature` | EIP-191 signature of the request hash (see below)                                     |
| `X-Agent-Timestamp` | Unix timestamp — seconds or milliseconds are both accepted                            |

#### Computing the signature <a href="#computing-the-signature" id="computing-the-signature"></a>

The signature is an EIP-191 `personal_sign` over a SHA-256 hash of the request:

```
payload   = METHOD + path + body + timestamp     // raw concatenation, no separators
hash      = sha256(payload)                      // 32 raw bytes
signature = personal_sign(hash, agentPrivateKey) // e.g. ethers wallet.signMessage(hashBytes)
```

* `METHOD` — uppercase HTTP method, e.g. `POST`
* `path` — the request path only, **without host or query string**, e.g. `/v1/chat/completions` (if you send a query string in the URL, still sign the bare path). The signed path must match the full path the server sees — if the endpoint URL includes a base path, include it.
* `body` — the exact raw request body string (empty string for GET requests)
* `timestamp` — the same value sent in `X-Agent-Timestamp`

In JavaScript with [ethers](https://docs.ethers.org/):

```javascript
import { ethers } from 'ethers';
import { createHash } from 'crypto';

const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY);

const timestamp = String(Math.floor(Date.now() / 1000));
const payload = method + path + body + timestamp;
const hashBytes = createHash('sha256').update(payload).digest();
const signature = await wallet.signMessage(hashBytes); // EIP-191 personal_sign
```

\{% hint style="warning" %\} **Timestamp freshness:** the timestamp must be within **30 seconds** of the server's clock, and the signature covers the exact body bytes — any modification invalidates it. A signature remains valid (and billable) for its whole 30-second window, so sign each request freshly and keep request/signature pairs confidential in transit. \{% endhint %\}

### Making Requests

The LLM endpoints expose the standard OpenAI-compatible API. A signed chat completion with `curl`:

```bash
BODY='{"model":"deepseek-r1:70b","messages":[{"role":"user","content":"Hello!"}]}'

# sign METHOD + path + body + timestamp with the agent wallet (see snippet above),
# then:
curl https://<secretai-llm-endpoint>/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-Agent-Address: $WALLET" \
  -H "X-Agent-Signature: $SIGNATURE" \
  -H "X-Agent-Timestamp: $TIMESTAMP" \
  -d "$BODY"
```

The response is a standard OpenAI chat completion, including a `usage` object. Billing is based on these counts (when the backend reports cached prompt tokens, those are not charged):

```json
{
  "choices": [{ "message": { "role": "assistant", "content": "Hello! …" } }],
  "usage": { "prompt_tokens": 25, "completion_tokens": 28, "total_tokens": 53 }
}
```

Request bodies are subject to a deployment-configured size limit (on the order of a few megabytes) — very large prompts should be split.

Streaming (`"stream": true`) is supported and billed the same way. Note that the endpoint requests usage accounting from the model, so the SSE stream ends with a final chunk carrying `usage` and an empty `choices` array even if you did not set `stream_options.include_usage` — make sure your stream parser tolerates it.

{% hint style="info" %}
**Endpoint discovery:** available LLM endpoints and models are listed in the [SecretAI Portal](https://secretai.scrtlabs.com). You can also query any endpoint's `GET /v1/models` — this call is free and works even with a zero balance.
{% endhint %}

If a signed request gets `401` with the body `Missing Authorization header`, the request was handled by the API-key path instead of the agent path — either the endpoint does not have x402 agent access enabled, or your `X-Agent-Address` header is missing (or was stripped by an intermediary). \{% endhint %\}

#### Free (non-billed) requests

Only JSON requests (`Content-Type: application/json`) that contain a `"model"` field in the body are billed. Discovery and health calls — `GET /v1/models`, `GET /api/tags`, health checks — still require a valid signature but skip the balance check entirely, so a freshly created wallet can explore the API before topping up.

### Billing

{% hint style="info" %}
**Naming note:** the standard x402 USDC payment flow is used for _funding_ the agent's balance (via the portal's `add-funds` endpoint). LLM calls themselves authenticate with the signed `X-Agent-*` headers against that balance — off-the-shelf x402 client middleware (e.g. `x402-fetch`) is not used for inference requests.
{% endhint %}

#### Insufficient balance → 402

If the agent's balance is below the required minimum, the endpoint responds with `402 Payment Required` and a machine-readable challenge:

```json
{
  "error": "Insufficient balance",
  "balance_usd": "0.000000",
  "required_usd": "0.001000",
  "topup_url": "https://secretai.scrtlabs.com/api/agent/add-funds",
  "topup_amount_usd": "0.001000"
}
```

The response also carries a `Payment-Required: x402` header, the protocol marker agents can key on.

An autonomous agent should treat `402` as a signal to top up via the `topup_url` and retry. Funding uses USDC x402 payments — see SecretVM REST API for Agents (x402) for the `add-funds` and `balance` endpoints (the same balance funds both VM management and LLM usage).

\{% hint style="warning" %\} `topup_amount_usd` is the exact current deficit, not a recommended amount. Topping up by only that much leaves you roughly one request away from the next `402` — fund enough for your expected usage instead. \{% endhint %\}

#### Usage reporting

After each billable request, input and output tokens are reported to the portal and deducted from the agent's balance. Reporting is asynchronous, so it adds no latency to inference responses.

Billing normally uses the `usage` counts returned by the model. If a response contains no `usage` object, token counts are estimated with a tokenizer — so validate your requests (model name, parameters) before sending; a request the backend rejects can still incur an estimated charge.

### Response Code

| Code  | Body       | Meaning                                                                           |
| ----- | ---------- | --------------------------------------------------------------------------------- |
| `200` | JSON       | Success — response includes `usage` with token counts                             |
| `400` | plain text | Request body could not be read                                                    |
| `401` | plain text | Invalid or expired signature/timestamp — re-sign with a fresh timestamp           |
| `402` | JSON       | Insufficient balance — top up via the `topup_url` in the challenge body and retry |
| `503` | plain text | Billing service temporarily unreachable — retry with backoff                      |

Other status codes (e.g. `404` for an unknown model, `500`) are passed through unchanged from the model backend.

```
```
