# Permits

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
