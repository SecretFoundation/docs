---
description: Learn how to use query permits with SecretJS.
---

# Query Permits

### Secret Network Client Setup

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

### Sign a Permit and use in a query

```typescript
let permit = await secretjs.utils.accessControl.permit.sign(
      accounts[0].address,
      "secret-2",
      "test",
      [contractAddress],
      ["owner", "balance"],
        false
    );

    let query = await secretjs.query.snip20.getBalance({
      contract: { address: contractAddress, codeHash },
      address: accounts[0].address,
      auth: { permit },
    });
```

### Verify a Permit

```typescript
let permit = await secretjs.utils.accessControl.permit.sign(
  accounts[0].address,
  "secret-2",
  "test",
  ["abcdef"],
  ["owner", "balance"],
    false
);

// can also use the variant "verifyNoExcept"
let result = secretjs.utils.accessControl.permit.verify(
  permit,
  accounts[0].address,
  "abcdef",
  ["owner"],
);
```

{% hint style="info" %}
Learn more about Query Permits [here](https://docs.scrt.network/secret-network-documentation/development/development-concepts/permissioned-viewing/certs-viewing-permits).&#x20;
{% endhint %}
