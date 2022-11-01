# Permits

### Sign a Permit and use in a query

```csharp
var permit = await secretClient.Permit.Sign(
    owner: wallet.Address,
    chainId: secretClient.ChainId,
    permitName: "test",
    allowedContracts: new string[] { contractAddress },
    permissions: new PermissionType[] {
        PermissionType.Owner,
        PermissionType.Balance
    });

var snip20Client = new SecretNET.Token.Snip20Client(secretClient); // SecretNET.Token 
var query = await snip20Client.Query.GetBalance(contractAddress, permit: permit, codeHash: permitContractCodeHash);
```

### Verify a Permit

```csharp
var permit = await secretClient.Permit.Sign(
    owner: wallet.Address,
    chainId: secretClient.ChainId,
    permitName: "test",
    allowedTokens: new string[] { "abcdef" },
    permissions: new PermissionType[] {
        PermissionType.Owner
    });

var result = secretClient.Permit.Verify(
  permit,
  wallet.Address,
  "abcdef",
  new PermissionType[] { PermissionType.Owner }
);
```
