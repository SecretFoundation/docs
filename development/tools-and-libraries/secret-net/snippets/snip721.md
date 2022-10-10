# SNIP721 via SecretNET.NFT package 
[**SecretNET.NFT**](https://github.com/0xxCodemonkey/SecretNET.NFT) is a layer on top of the Secret.NET which supports all methods of the [reference implementation](https://github.com/baedrik/snip721-reference-impl) of the [**SNIP721 contract**](https://docs.scrt.network/secret-network-documentation/development/snips/snip-721-private-non-fungible-tokens-nfts).

`nuget install SecretNET.NFT`

### Add Minter

```csharp
var snip721Client = new SecretNET.NFT.Snip721Client(secretClient); // SecretNET.NFT 

var addMinterMsg = new SecretNET.NFT.AddMinterRequest(minters: new[] { "" });
var addMinter = await snip721Client.Tx.AddMinter(
                msg: new SecretNET.NFT.MsgAddMinter(addMinterMsg, contractAddress, codeHash), 
                txOptions: new TxOptions() { GasLimit = 100_000 });
```    

### Mint SNIP721 Token

```csharp
var mintNftMsg = SecretNET.NFT.MintNftRequest.Create(tokenId: "1");
var mintNft = await snip721Client.Tx.MintNft(
                msg: new SecretNET.NFT.MsgMintNft(mintNftMsg, contractAddress, codeHash), 
                txOptions: new TxOptions() { GasLimit = 200_000 }); 


### Transfer SNIP721 Token

```csharp
var transferNftMsg = new SecretNET.NFT.TransferNftRequest(recipient, tokenId);
var transferNft = await snip721Client.Tx.TransferNft(
                msg: new SecretNET.NFT.MsgTransferNft(transferNftMsg, contractAddress, codeHash), 
                txOptions: new TxOptions() { GasLimit = 50_000 }); 

```


### Query Tokens with Permit

```csharp
var permit = await secretClient.Permit.Sign(
    owner: wallet.Address,
    chainId: secretClient.ChainId,
    permitName: "test",
    allowedContracts: new string[] { contractAddress },
    permissions: new PermissionType[] {
        PermissionType.Owner
    });

var tokens = await snip721Client.Query.GetTokens(contractAddress, wallet.Address, permit: permit, codeHash: codeHash);

```

### Query Tokens with Viewing Key

```csharp
var txExec = await snip20Client.Tx.SetViewingKey(
                    contractAddress,
                    "hello",
                    txOptions: new TxOptions() { GasLimit = 100_000 });

var tokens = await snip721Client.Query.GetTokens(contractAddress, wallet.Address, viewingKey: "hello", codeHash: codeHash);

```
