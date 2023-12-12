---
description: Learn how to do contract migration with SecretJS.
---

# Contract Migration

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

### SecretJS Contract Migration

[**`secretjs.tx.compute.migrateContract()`**](https://secretjs.scrt.network/#secretjstxcomputemigratecontract)

Migrate a contract's code while keeping the same address. Invokes the `migrate()` function on the new code.

Input: [MsgMigrateContractParams](https://secretjs.scrt.network/interfaces/MsgMigrateContractParams)

```ts
const tx = await secretjs.tx.compute.migrateContract(
  {
    sender: myAddress,
    contract_address: contractAddress,
    code_id: newCodeId,
    code_hash: codeHash, // optional but way faster
    msg: {
      migrate_state_to_new_format: {},
    },
    sent_funds: [], // optional
  },
  {
    gasLimit: 100_000,
  },
);
```

{% hint style="info" %}
See [here](https://docs.scrt.network/secret-network-documentation/development/development-concepts/contract-migration/native-from-v1.11) for further docs on contract migration.&#x20;
{% endhint %}
