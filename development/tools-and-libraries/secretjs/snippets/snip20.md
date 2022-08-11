# SNIP20

### Transfer SNIP-20 tokens

```typescript
const txExec = await secretjs.tx.snip20.transfer(
      {
        sender: secretjs.address,
        contractAddress,
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
        contractAddress,
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
  contractAddress,
  msg: { set_viewing_key: { key: "hello" } },
});

const txQuery = await secretjs.query.snip20.getBalance({
  address: secretjs.address,
  contract: { address: contractAddress, codeHash: codeHash },
  auth: { key: "hello" },
});

```

Query Token Parameters

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
