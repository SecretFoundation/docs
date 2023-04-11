# Query a Contract

```typescript
// Query the current count
console.log("Querying contract for current count");
const { count } = await secretjs.query.compute.queryContract({
  contract_address: contractAddress,
  code_hash: contractCodeHash,
  query: { get_count: {} },
});
```
