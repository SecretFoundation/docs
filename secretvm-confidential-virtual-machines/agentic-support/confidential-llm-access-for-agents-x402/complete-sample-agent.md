---
icon: terminal
---

# Complete Sample Agent

A minimal self-contained agent client in Node.js (requires `ethers` v6):

```javascript
import { ethers } from 'ethers';
import { createHash } from 'crypto';

class X402Agent {
  constructor(baseURL, privateKey) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.wallet = new ethers.Wallet(privateKey);
  }

  async signedFetch(method, path, body = '') {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const payload = method + path + body + timestamp;
    const hashBytes = createHash('sha256').update(payload).digest();
    const signature = await this.wallet.signMessage(hashBytes);

    const res = await fetch(this.baseURL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Address': this.wallet.address,
        'X-Agent-Signature': signature,
        'X-Agent-Timestamp': timestamp,
      },
      body: body || undefined,
    });
    // 200 and 402 bodies are JSON; 401/503 errors are plain text
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, body: json ?? text };
  }

  chat(model, message) {
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: message }],
      stream: false,
    });
    return this.signedFetch('POST', '/v1/chat/completions', body);
  }

  models() {
    return this.signedFetch('GET', '/v1/models');
  }
}

// Usage
const agent = new X402Agent('https://<secretai-llm-endpoint>', process.env.AGENT_PRIVATE_KEY);

const { status, body } = await agent.chat('gpt-oss:120b', 'Hello from my agent!');
if (status === 200) {
  console.log(body.choices[0].message.content);
} else if (status === 402) {
  console.log(`Top up needed: ${body.topup_amount_usd} USD at ${body.topup_url}`);
} else {
  console.error(`HTTP ${status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
}
```

###
