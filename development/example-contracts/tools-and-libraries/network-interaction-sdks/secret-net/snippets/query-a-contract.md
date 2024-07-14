# Query a Contract

```csharp
// Query the current count
Console.WriteLine("Querying contract for current count");
await secretClient.Query.Compute.QueryContract<string>(
        contractAddress, 
        new { get_count = new { } }, 
        contractCodeHash);
```
