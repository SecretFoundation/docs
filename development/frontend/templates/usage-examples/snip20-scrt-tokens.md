---
description: Learn how to send SNIP20 tokens with SecretJS.
---

# SNIP20 (SCRT Tokens)

### Secret Network Client setup

```javascript
import { SecretNetworkClient, Wallet } from "secretjs";

const wallet = new Wallet("Your mnemonic words go here");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

### Transfer SNIP-20 tokens

```typescript
const txExec = await secretjs.tx.snip20.transfer(
      {
        sender: secretjs.address,
        contract_address,
        msg: { transfer: { recipient: accounts[1].address, amount: "2" } },
      },
      {
        gasLimit: 5_000_000,
      },
    );
```

### Send SNIP-20 Tokens

```typescript
const txExec = await secretjs.tx.snip20.send(
      {
        sender: secretjs.address,
        contract_address,
        msg: { send: { recipient: accounts[1].address, amount: "2" } },
      },
      {
        gasLimit: 5_000_000,
      },
    );
```

### Set Viewing Key and Query Balance

```typescript
const txExec = await secretjs.tx.snip20.setViewingKey({
  sender: secretjs.address,
  contract_address: contractAddress,
  msg: { set_viewing_key: { key: "hello" } },
});

const txQuery = await secretjs.query.snip20.getBalance({
  address: secretjs.address,
  contract: { address: contractAddress, codeHash: codeHash },
  auth: { key: "hello" },
});

```

### Query Token Parameters

```typescript
const txQuery = await secretjs.query.snip20.getSnip20Params({
  contract: { address: contractAddress, codeHash: codeHash },
});

expect(txQuery).toEqual({
  token_info: {
    decimals: 6,
    name: "Secret SCRT",
    symbol: "SSCRT",
    total_supply: "2",
  },
});
```

### Get Transaction History

```typescript
const txQuery = await secretjs.query.snip20.getTransactionHistory({
      contract: { address: contractAddress, codeHash: codeHash },
      address: secretjs.address,
      auth: { key: "hello" },
      page_size: 10,
    });
```
