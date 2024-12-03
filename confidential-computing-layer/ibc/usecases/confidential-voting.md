---
description: >-
  A fullstack  tutorial for cross-chain confidential voting on IBC-connected
  chains.
---

# Confidential Voting

{% hint style="danger" %}
_**In progress - 12/3/24**_
{% endhint %}

### Overview <a href="#overview" id="overview"></a>

Clone the repo:

```bash
git clone https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo
```

`cd` into next-frontend and install the dependencies:&#x20;

```bash
cd next-frontend && npm install
```

Add environment variables in cosmos-ccl-encrypted-payloads-demo/next-frontend:&#x20;

```
NEXT_PUBLIC_SECRET_MNEMONIC=""
NEXT_PUBLIC_SECRET_CHAIN_ENDPOINT="https://lcd.mainnet.secretsaturn.net"
NEXT_PUBLIC_SECRET_CHAIN_ID="secret-4"
NEXT_PUBLIC_SECRET_TOKEN="uscrt"

NEXT_PUBLIC_CONSUMER_MNEMONIC=""
NEXT_PUBLIC_CONSUMER_CHAIN_ENDPOINT="https://rpc.osmosis.zone:443"
NEXT_PUBLIC_CONSUMER_CHAIN_ID="osmosis-1"
NEXT_PUBLIC_CONSUMER_TOKEN="uosmo"
NEXT_PUBLIC_CONSUMER_PREFIX="osmo"
NEXT_PUBLIC_CONSUMER_GAS_PRICE="0.25"
NEXT_PUBLIC_CONSUMER_DECIMALS=6
```

Start the application:

```bash
npm run dev
```
